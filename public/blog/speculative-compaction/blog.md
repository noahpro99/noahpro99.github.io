# Speculative Compaction: Catching What Summaries Lose

_May 2026 • Research_

[Noah Provenzano](https://noahpro99.github.io/), advised by [Dr. Tu Vu](https://tuvllms.github.io/) — Virginia Tech

> **TL;DR.** When an LLM agent's context fills up, the standard fix is *compaction* — summarize the conversation, drop the old turns, keep going. Compaction loses information. **Speculative Compaction (SC)** has the original full-context model review the post-compaction agent's first moves and inject targeted feedback. On SWE-bench Lite (dev) with Kimi-K2.6 at 64k context, SC raises resolution from **43.5% → 60.9% (+17.4pp)** while using **half the tokens per task**. The lift is real but model- and configuration-dependent.

## The Problem

Compaction works but it's lossy. A debugging agent might try fix A, fail, try fix B, fail, then realize the bug is somewhere else entirely. When compaction fires, the summary preserves "investigated DurationField error" but loses "I already tried fix A and it broke unrelated tests." Re-reading source code is cheap, but re-deriving operational lessons isn't.

## The Idea

Call the agent with full prior context $M_1$ and the post-compaction agent $M_2$ (same model, different conversation states).

1. Conversation fills up. The inner condenser produces summary $S$.
2. $M_2$ starts working from $S$.
3. After $M_2$ accumulates a small amount of new work (a "headroom" we set, e.g. 16k tokens), $M_1$ — which still has the full prior conversation — reviews $M_2$'s recent moves.
4. If $M_1$ spots a divergence ("you're editing the wrong file"), it injects feedback as a note to $M_2$.
5. $M_2$ continues with the correction.

One extra LLM call per compaction. No agent loop changes.

The framing in $M_1$'s prompt is intentionally personal:

> *"You've been working on a coding task and got partway through. Your supervisor just paired you with a coworker agent who will take over from here. The coworker received a summary of your progress, not the full conversation. Glance at their first few moves and advise them..."*

Treating $M_1$ as a hand-off advisor — a role it has training data for — produces specific feedback. Meta-instructions like *"you are a code reviewer, analyze this transcript"* caused the model to lapse into description mode.

## Results

### SWE-bench Lite (dev) — Kimi-K2.6, 64k context

| Method | Resolved | Tokens / task |
|---|---|---|
| Std. compaction | 43.5% (10/23) | 4.1M |
| **Speculative Compaction** | **60.9% (14/23)** | **2.0M** |
| SC-Rewrite | 52.2% (12/23) | 2.4M |

**+17.4pp absolute**, *and* about half the tokens per task — fewer turns spent rediscovering things the summary lost.

### LongBench-v2 — Kimi-K2.5, 32k context

On the 93 longest LongBench-v2 documents, SC raised accuracy from **51% → 68% (+17pp)**. Document QA is the cleanest test bed: the answer lives only in the conversation, so anything dropped in summarization is unrecoverable.

### Where it doesn't consistently help — Qwen-Coder-30B sweep

We ran a scaling sweep on the SWE-bench Lite *test* split (50 tasks) with Qwen3-Coder-30B-A3B-Instruct-FP8, varying context size and the minimum number of forced review cycles per task:

| Context | min-comp | STD | SC | Δ |
|---|---|---|---|---|
| 131k | 1 | **40%** | 33% | −7pp |
| 131k | 2 | 31% | **34%** | **+3pp** |
| 131k | 4 | **33%** | 28% | −5pp |
| 64k | 1 | **40%** | 34% | −6pp |
| 32k | 2 | 34% | 34% | 0pp |

Only one of five settings shows a positive lift, and only by +3pp. A real finding, not a tuning failure.

## Why the Disparity?

Looking at the actual feedback for both models tells the story.

**Kimi:**

> *"The two failures in `test_skip_if_db_feature` and `test_skip_unless_db_feature` are pre-existing Python 3.12 unittest formatting issues unrelated to this change, so don't spend more time on them. You can stop grepping for additional references since you've already validated that explicit `None` overrides still work."*

**Qwen:**

> *"You've correctly identified and modified the main `DurationField` ... and updated the corresponding test."* (This review *endorsed* a violation of the explicit "do NOT modify test files" rule, costing SC the task.)

Kimi distinguishes real bug-related failures from environmental noise and tells the agent to stop wasting cycles. Qwen is accurate about what happened but rarely adds new information; when it does, it sometimes endorses rule violations because the model defaults to "constructive coding assistant" rather than "strict reviewer."

## Takeaways

- **SC's value depends on the reviewer model's instruction-following character.** A model that defaults to "critique this code" mode adds value. A model that defaults to "bless what I see" adds filler.
- **The benchmark matters too.** SWE-bench tasks are mostly localized single-file fixes — agents can re-read source cheaply, so memory of *code* isn't really lost. What gets lost in compaction is *operational reasoning* (failed approaches, ruled-out paths). For SC to shine, the benchmark needs tasks where that reasoning matters and can't be cheaply re-derived. LongBench fits, SWE-bench partially fits, ProgramBench-style "reimplement from binary + docs" should fit best.

## What's Next

- Reproduce LongBench-v2 under the current OpenHands implementation.
- Try [ProgramBench](https://programbench.com/) where compaction has to fire many times and lost reasoning matters.
- Programmatic rule enforcement before LLM review (catch test-file edits deterministically).
- Tighter, structured $M_1$ output to remove the filler-pad-the-answer pressure.

## Citation

```
@misc{provenzano2026speculative,
  title={Speculative Compaction: Recovering Information Lost in Agent Context Summarization},
  author={Provenzano, Noah and Vu, Tu},
  year={2026},
  note={Working paper}
}
```

## Acknowledgments

Conducted at Virginia Tech under the supervision of [Dr. Tu Vu](https://tuvllms.github.io/). Compute provided by Virginia Tech ARC, Tinkercliffs, Falcon, and UMass Unity.

---

_Feedback welcome — please reach out via [my homepage](https://noahpro99.github.io/)._
