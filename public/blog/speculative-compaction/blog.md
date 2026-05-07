# Speculative Compaction: Catching What Summaries Lose

_May 2026 • Research_

[Noah Provenzano](https://noahpro99.github.io/), advised by [Dr. Tu Vu](https://tuvllms.github.io/) — Virginia Tech

> **TL;DR.** When an LLM agent's context window fills up, the standard fix is *compaction* — summarize the conversation so far, throw the originals away, keep going. But compaction loses information. We propose **Speculative Compaction (SC)**: after the summary is made, the original full-context model reviews what the new summary-only model does next, and injects targeted feedback for anything the summary missed. On SWE-bench Lite (dev) with Kimi-K2.6 at 64k context, SC raises resolution from **43.5% → 60.9% (+17.4pp)** while using **half the tokens per task**. The lift is real but model- and configuration-dependent — Qwen-Coder-30B shows a much smaller and inconsistent benefit across settings.

## The Problem with Compaction

Every long-running coding agent eventually hits the same wall: the context window fills up. The conventional response is *compaction* — call the LLM, ask it to write a self-contained summary of the conversation so far, drop the actual messages, and continue working from the summary alone.

This works, but it's lossy. Consider a debugging session that goes like this:

1. Agent reads the bug report.
2. Agent inspects three files, narrowing down the problem.
3. Agent tries fix A. It compiles but breaks an unrelated test.
4. Agent backs out, tries fix B in a different file. Tests pass but now there's a regression.
5. Agent realizes the actual issue is at a third location.
6. Compaction fires. Summary says: *"investigated DurationField error message, identified the format string, considered several approaches."*
7. Agent continues from the summary and... immediately tries fix A again, because nothing in the summary said *"don't try A — it breaks unrelated tests."*

The summary preserved the *headline* of what happened but lost the *operational lessons* — the failed approaches, the red herrings, the specific reasons certain paths were ruled out. Re-reading the source code is cheap, but re-deriving "I already tried this and it broke X" requires re-running the experiment.

## The Idea

**Speculative Compaction** keeps the agent that built the summary in the loop after compaction. We call the agent with full prior context $M_1$ and the post-compaction agent $M_2$ (they're the same underlying model — just different conversation states).

The flow:

1. The conversation fills up. The standard inner condenser produces summary $S$.
2. $M_2$ takes $S$ as its starting context and begins working.
3. After $M_2$ accumulates a small amount of new work (a "headroom" we set, e.g. 16k tokens), $M_1$ — which still has the full pre-compaction conversation in its context — is asked to review $M_2$'s recent moves.
4. If $M_1$ spots a divergence ("you're editing the wrong file", "you're trying approach A which already failed at turn 12"), it injects that feedback into $M_2$'s conversation as a note from a coworker.
5. $M_2$ continues, now with the targeted correction.

The whole thing fits inside a single existing OpenHands `CondenserBase` subclass. No agent loop changes. The cost is one extra LLM call per compaction.

```
                            inner-summarize
   ┌────── M₁ context ──────┐ ─────────────► S
   │  (full conversation)   │                │
   └────────────────────────┘                ▼
                                    ┌── M₂ context ──┐
                                    │  S + new work  │
                                    └───────┬────────┘
                                            │ (headroom worth of new work)
                                            ▼
                            ┌──────────────────────────────────┐
                            │ M₁ reviews M₂'s recent steps     │
                            │ against its full prior context   │
                            └─────────────┬────────────────────┘
                                          │ feedback (or "on track")
                                          ▼
                                  M₂ continues working
```

The framing in the actual prompt to $M_1$ is intentionally personal:

> "You've been working on a coding task and got partway through. Your supervisor just paired you with a coworker agent who will take over from here. The coworker received a summary of your progress, not the full conversation. Glance at their first few moves and advise them..."

We found that meta-instructions like *"you are a code reviewer, analyze this transcript"* caused the model to lapse into description mode (*"the user has provided a complex mix of code snippets..."*). Treating $M_1$ as a hand-off advisor — a role it has training data for — produces specific, actionable feedback far more reliably.

## Results

### SWE-bench Lite (dev) — Kimi-K2.6, 64k context

On the 23-task dev split with Kimi-K2.6 at a 64k effective context:

| Method | Resolved | Tokens / task |
|---|---|---|
| Std. compaction | 43.5% (10/23) | 4.1M |
| **Speculative Compaction** | **60.9% (14/23)** | **2.0M** |
| SC-Rewrite | 52.2% (12/23) | 2.4M |

**+17.4pp absolute** improvement, *and* about half the tokens per task — fewer turns spent rediscovering things the summary lost. SC-Rewrite (a variant that re-summarizes incorporating $M_1$'s feedback rather than injecting it as a message) sits between the two on both metrics.

### LongBench-v2 — Kimi-K2.5, 32k context

On the 93 longest LongBench-v2 documents, SC improved Kimi-K2.5 accuracy from **51% → 68% (+17pp)**. Document QA is the cleanest test bed for compaction loss: the answer lives only in the document, so anything dropped during summarization is unrecoverable.

### Where it doesn't (consistently) help — Qwen-Coder-30B sweep

We ran a scaling sweep on the SWE-bench Lite *test* split (50 tasks) with Qwen3-Coder-30B-A3B-Instruct-FP8, varying context size and the minimum number of forced review cycles per task:

| Context | min-comp | STD | SC | Δ |
|---|---|---|---|---|
| 131k | 1 | **40%** | 33% | −7pp |
| 131k | 2 | 31% | **34%** | **+3pp** |
| 131k | 4 | **33%** | 28% | −5pp |
| 64k | 1 | **40%** | 34% | −6pp |
| 32k | 2 | 34% | 34% | 0pp |

Across five Qwen settings, only one (131k, min-comp=2) shows a positive lift, and only by +3pp. Forcing too many review cycles (m=4) actively hurts; too few (m=1) and the mechanism never activates. Smaller contexts where compaction fires naturally don't recover the gains either.

The Qwen result is a real finding, not a tuning failure. Across qualitatively similar configurations to the +17pp Kimi run, SC's lift is much smaller or negative on a different model.

## Why the Disparity?

Looking at the actual feedback $M_1$ produced for both models tells the story.

**Kimi (good lift):**

> *"The two failures in `test_skip_if_db_feature` and `test_skip_unless_db_feature` are pre-existing Python 3.12 unittest formatting issues unrelated to this change, so don't spend more time on them. You can stop grepping for additional references since you've already validated that explicit `None` overrides still work."*

> *"Stop calling finish — write and run a minimal reproduction script using the exact multiline RawSQL `order_by` example from the issue to confirm the generated SQL retains all three clauses..."*

**Qwen (small lift):**

> *"You've correctly identified and modified the main `DurationField` in `django/db/models/fields/__init__.py` and updated the corresponding test. ...ensure the test expectation matches the actual change made."* (This review *endorsed* a violation of the explicit "do NOT modify test files" task rule, costing SC the task.)

> *"Make sure your implementation is robust and handles edge cases like empty choices or malformed data gracefully."* (Generic filler when the agent was on track.)

Kimi's reviews distinguish real bug-related failures from environmental noise, name specific test files, and tell the agent to stop wasting cycles. Qwen's reviews are accurate about what happened but rarely add new information; when they do, they sometimes endorse rule violations because the model defaults to "constructive coding assistant" rather than "strict reviewer."

A cycle-by-cycle classification of all 98 Qwen SC reviews:

- **92%** referenced a specific file/method/line (so the *form* was right)
- **18%** included generic filler ("handle edge cases", "make sure to verify")
- **11%** confused gate meta-feedback ("min-compactions") with task content
- **4%** echoed task rules back instead of flagging real divergences

The mechanism is firing correctly; the model in the reviewer seat is the bottleneck.

## What This Means

Two takeaways:

1. **SC's value depends heavily on the reviewer model's instruction-following character.** A model that defaults to "let me critique this code" mode adds value. A model that defaults to "let me bless what I see" mode produces filler that doesn't unlock task wins.
2. **The benchmark matters too.** SWE-bench tasks are mostly localized single-file fixes — agents can re-read the source file cheaply, so memory of *code* isn't really lost. What gets lost in compaction is *operational reasoning* (failed approaches, ruled-out paths). For SC to shine, the benchmark needs tasks where that operational reasoning matters AND can't be cheaply re-derived.

We saw the same +17pp pattern on LongBench-v2 (where information lives only in the conversation), and the dev-set SWE-bench result with Kimi. Where SC shows weak results — Qwen across five SWE-bench settings — the failure modes are diagnosable: either the reviewer can't add new signal, or compaction barely fires in the first place (131k context with single-file tasks).

## What's Next

- **Reproduce LongBench-v2** under the current OpenHands implementation. The legacy result was on a custom harness; bringing it under the same code path closes the loop.
- **Try ProgramBench** ([programbench.com](https://programbench.com/)) — task is "reimplement this binary from scratch in Rust given only docs and the executable" with hundreds of behavioral tests for granular scoring. This is the regime where compaction has to fire many times and lost reasoning matters.
- **Programmatic rule enforcement.** Models endorsing task-rule violations is a real failure. A deterministic check (did $M_2$ touch any file matching `tests/*.py`?) before the LLM review removes that failure mode entirely.
- **Tighter, structured $M_1$ output** — force JSON or a single-deviation answer to remove the filler-pad-the-answer pressure.

## Citation

The full paper is in preparation. For now:

```
@misc{provenzano2026speculative,
  title={Speculative Compaction: Recovering Information Lost in Agent Context Summarization},
  author={Provenzano, Noah and Vu, Tu},
  year={2026},
  note={Working paper}
}
```

## Acknowledgments

This work was conducted at Virginia Tech under the supervision of [Dr. Tu Vu](https://tuvllms.github.io/). Compute provided by Virginia Tech ARC, Tinkercliffs, Falcon, and UMass Unity. Models accessed via the Tinkercliffs ARC LLM API and on-cluster vLLM serving Qwen3-Coder-30B-A3B-Instruct-FP8.

---

_Feedback welcome — please reach out via [my homepage](https://noahpro99.github.io/) if you have questions or ideas._
