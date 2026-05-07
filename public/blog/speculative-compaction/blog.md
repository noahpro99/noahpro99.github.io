# Speculative Compaction: Catching What Summaries Lose

[Noah Provenzano](https://noahpro99.github.io/), advised by [Dr. Tu Vu](https://tuvllms.github.io/), Virginia Tech

> **TL;DR.** When an LLM agent's context fills up, the standard fix is _compaction_, summarize the conversation, drop the old turns, keep going. Compaction loses information. **Speculative Compaction (SC)** has the original full-context model review the post-compaction agent's first moves and inject targeted feedback. On SWE-bench Lite (dev) with Kimi-K2.6 at 64k context, SC raises resolution from **43.5% to 60.9% (+17.4pp)** while using **half the tokens per task**. The lift is real but model and configuration dependent.

## The Problem

Compaction is lossy. Models forget the fine-grained details that mattered (failed approaches, edge cases, why a path was ruled out), and after a summary they often re-litigate work they already did. In practice, agents become noticeably worse to work with right after compaction.

## The Idea

Call the agent with full prior context $M_1$ and the post-compaction agent $M_2$ (same model, different conversation states).

1. Conversation fills up. The inner condenser produces summary $S$.
2. $M_2$ starts working from $S$.
3. After $M_2$ accumulates a small amount of new work (a "headroom" we set, e.g. 16k tokens), $M_1$, which still has the full prior conversation, reviews $M_2$'s recent moves.
4. If $M_1$ spots a divergence ("you're editing the wrong file"), it injects feedback as a note to $M_2$.
5. $M_2$ continues with the correction.

One extra LLM call per compaction. No agent loop changes.

The framing in $M_1$'s prompt is intentionally personal:

> _"You've been working on a coding task and got partway through. Your supervisor just paired you with a coworker agent who will take over from here. The coworker received a summary of your progress, not the full conversation. Glance at their first few moves and advise them..."_

Treating $M_1$ as a hand-off advisor (a role it has training data for) produces specific feedback. Meta-instructions like _"you are a code reviewer, analyze this transcript"_ caused the model to lapse into description mode.

### Why proactive injection beats a "look up old context" tool

A natural alternative is to give $M_2$ a tool that grep's its pre-summary history on demand. We think proactive injection wins for two reasons:

1. **Models are lazy with tools.** If the missing detail isn't blatantly relevant, $M_2$ won't bother to look, and the divergence happens precisely when $M_2$ doesn't realize something is missing. Pushing the correction in beats relying on $M_2$ to pull it.
2. **The model is a fuzzy-find, not a grep.** $M_1$ over the full conversation is an excellent retriever; it surfaces relevance even when the query is implicit ("are they about to repeat a failed approach?"). A grep tool requires $M_2$ to know what string to search for. Most useful corrections aren't keyword-matchable.

## Results

### SWE-bench Lite (dev), Kimi-K2.6, 64k context

| Method                     | Resolved          | Tokens / task |
| -------------------------- | ----------------- | ------------- |
| Std. compaction            | 43.5% (10/23)     | 4.1M          |
| **Speculative Compaction** | **60.9% (14/23)** | **2.0M**      |
| SC-Rewrite                 | 52.2% (12/23)     | 2.4M          |

**+17.4pp absolute**, _and_ about half the tokens per task. Fewer turns spent rediscovering things the summary lost.

### LongBench-v2, Kimi-K2.5, 32k context

On the 93 longest LongBench-v2 documents, SC raised accuracy from **51% to 68% (+17pp)**. Document QA is the cleanest test bed: the answer lives only in the conversation, so anything dropped in summarization is unrecoverable.

### A note on Qwen

A scaling sweep on the SWE-bench Lite _test_ split (50 tasks) with Qwen3-Coder-30B at varying context sizes and forced review cycles produced lifts ranging from **−7pp to +3pp** across five settings, only one positive. Looking at the actual reviews, Kimi distinguishes real failures from environmental noise and tells the agent to stop wasting cycles ("the two failures in `test_skip_if_db_feature` are pre-existing Python 3.12 issues, don't spend more time on them"); Qwen often endorses what it sees rather than flagging divergence (and on one task it _approved_ a violation of the "don't modify test files" rule). SC's value depends on the reviewer model's instruction-following character: a coding assistant that defaults to "critique" adds value, one that defaults to "bless what I see" adds filler.

## Takeaways

- **The benchmark matters.** SC's pitch is "preserve reasoning lost in compaction," which only pays off when (a) compaction actually fires often and (b) the lost information is hard to re-derive. Most SWE-bench Lite tasks at 131k context fit comfortably without compacting, and even when they do compact, the agent can re-read source cheaply. So what gets lost is _operational reasoning_ (failed approaches, ruled-out paths), not _code_. LongBench (document QA, the answer lives only in the conversation) fits SC's assumption directly, and that's where we see the +17pp. ProgramBench-style "reimplement from binary + docs" should fit even better: hundreds of behavioral tests, long horizons, lots of forced compactions, and reasoning that genuinely cannot be re-derived from the workspace.

- **SC only unlocks lift with a strong verifier.** The $M_1$ review has to actually _critique_ to add value. Kimi surfaces non-obvious issues (real failures vs Python-3.12 noise, repeated failed approaches, sloppy edits). Qwen-Coder-30B's reviews mostly bless what they see, occasionally endorse rule violations (it once approved a "do not modify test files" violation), and pad with generic edge-case advice. We think this is why Qwen struggles: it's a capable coder but not a strong enough critic. SC inherits its ceiling from whatever reasoning capacity the verifier brings. A model that can't generate new useful signal can't recover what compaction lost, and the extra calls become pure overhead.

## What's Next

- **[ProgramBench](https://programbench.com/)**: long-horizon reimplement-from-binary tasks where compaction has to fire many times and lost reasoning matters.
- **Stronger baselines**: compare against ACE, agentic grep, and RLM-style approaches to past-context recall, not just standard compaction.

## Citation

```
@misc{provenzano2026speculative,
  title={Speculative Compaction},
  author={Provenzano, Noah and Sharma, Rituraj and Vu, Tu},
  year={2026},
  note={Pre blog writeup}
}
```

## Acknowledgments

Conducted at Virginia Tech under the supervision of [Dr. Tu Vu](https://tuvllms.github.io/). Compute provided by Virginia Tech ARC, Tinkercliffs, Falcon, and UMass Unity.

---

_Feedback welcome, please reach out via [my homepage](https://noahpro99.github.io/)._
