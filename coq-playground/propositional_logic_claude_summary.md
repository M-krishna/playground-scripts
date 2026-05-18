# Coq & Formal Logic — Session Summary

---

## Context

- Learning Coq from **absolute scratch**
- Background: some college math, knows AND/OR/NOT/implication informally
- Teaching style: concepts in plain English first, then Coq second, no assumptions, every new word explained immediately
- Parallel goal: also learning **nand2tetris in Verilog** (currently at sequential logic) — separate thread

---

## What We Covered

---

### 1. The Core Idea — What is a Proof?

- A proof is not just a "true" label — it is **actual evidence** you construct and carry
- Coq never takes your word for it — you must **build** the evidence piece by piece
- Two separate things always exist:
  - The **proposition** — the claim
  - The **proof** — the evidence for that claim

---

### 2. Propositions and Types

- A **proposition** is a statement that can be true or false
- In Coq **everything has a type** — this is non-negotiable
- Propositions have the special type **`Prop`**
- `P : Prop` means *"P is a proposition"*
- `forall P : Prop` means *"for any proposition P whatsoever"*
- Names like `HP`, `proof_of_P`, `evidence_of_P` are just labels — you can name things anything you want. `H` is a common shorthand for "hypothesis" but it is just a convention, not a rule

---

### 3. Implication — `P -> Q`

- Means *"if P then Q"*
- A proof of `P -> Q` is a **function**
  - A function is a machine — takes input, produces output
  - Input: evidence of P
  - Output: evidence of Q
- Proofs chain like an assembly line: `proof_of_P → [PQ machine] → proof_of_Q → [QR machine] → proof_of_R`

---

### 4. Tactics — What They Are

- A **tactic** is a command you give Coq to build evidence one step at a time
- The **proof state** has two parts:
  - **Above the line** — things you currently have (your hypotheses)
  - **Below the line** — what you still need to prove (your goal)
- You use tactics to shrink the goal until nothing is left
- How to decide which tactic to use — ask two questions every time:
  - **What is my goal right now?**
  - **What do I have in my hypotheses?**

---

### 5. All Connectives Covered

These are the building blocks of all logical statements:

| Connective | Coq Symbol | Meaning |
|---|---|---|
| Implication | `->` | If...then |
| Conjunction | `/\` | AND |
| Disjunction | `\/` | OR |
| Negation | `~` | NOT |
| Biconditional | `<->` | If and only if |
| Falsity | `False` | A proposition with no proof — absolute impossibility |
| Truth | `True` | A proposition trivially true |

---

### 6. Complete Connectives Cheat Sheet

| Connective | Meaning | When it's your GOAL | When it's a HYPOTHESIS |
|---|---|---|---|
| `P -> Q` | If P then Q | `intros` | `apply` it |
| `P /\ Q` | P and Q | `split` into two goals | `destruct` with space: `[proof_of_P proof_of_Q]` |
| `P \/ Q` | P or Q | `left` or `right` | `destruct` with pipe: `[proof_of_P \| proof_of_Q]` |
| `~P` | Not P (same as `P -> False`) | `intros` then prove `False` | `contradiction` if you also have `P` |
| `P <-> Q` | P if and only if Q | `split` into two directions | `destruct` with space: `[proof_of_PtoQ proof_of_QtoP]` |
| `forall x, ...` | For all x | `intros` | `apply` it |

---

### 7. Complete Tactics Cheat Sheet

| Tactic | What it does |
|---|---|
| `intros` | Takes things handed to you in the goal and gives them names |
| `exact` | Points at something you already have as the final answer |
| `apply` | Uses a function/implication to reduce the goal to what it needs as input |
| `split` | Breaks an AND or IFF goal into two separate goals |
| `destruct ... as [...]` | Opens up a hypothesis (AND, OR, IFF) into its pieces or cases |
| `left` | Choose the left side when goal is OR |
| `right` | Choose the right side when goal is OR |
| `contradiction` | Closes any goal when you have both `P` and `~P` in hypotheses |
| `unfold not` | Replaces `~P` with `P -> False` to make it visible |

---

### 8. Theorems Proved So Far

```coq
(* Theorem 1 — Identity *)
Theorem easy_1 : forall P : Prop, P -> P.
Proof.
  intros P proof_of_P.
  exact proof_of_P.
Qed.

(* Theorem 2 — Implication is Transitive *)
Theorem easy_2 : forall P Q R : Prop, (P -> Q) -> (Q -> R) -> P -> R.
Proof.
  intros P Q R proof_of_PtoQ proof_of_QtoR proof_of_P.
  apply proof_of_QtoR.
  apply proof_of_PtoQ.
  exact proof_of_P.
Qed.

(* Theorem 3 — AND is Symmetric *)
Theorem easy_3 : forall P Q : Prop, P /\ Q -> Q /\ P.
Proof.
  intros P Q proof_of_PandQ.
  destruct proof_of_PandQ as [proof_of_P proof_of_Q].
  split.
  - exact proof_of_Q.
  - exact proof_of_P.
Qed.

(* Theorem 4 — AND implies OR *)
Theorem easy_4 : forall P Q : Prop, P /\ Q -> P \/ Q.
Proof.
  intros P Q proof_of_PandQ.
  destruct proof_of_PandQ as [proof_of_P proof_of_Q].
  left.
  exact proof_of_P.
Qed.

(* Theorem 5 — Contradiction is impossible *)
Theorem easy_5 : forall P : Prop, P /\ ~P -> False.
Proof.
  intros P proof_of_PandNotP.
  destruct proof_of_PandNotP as [proof_of_P proof_of_notP].
  contradiction.
Qed.

(* Theorem 6 — IFF is Symmetric *)
Theorem easy_6 : forall P Q : Prop, (P <-> Q) -> (Q <-> P).
Proof.
  intros P Q proof_of_PiffQ.
  destruct proof_of_PiffQ as [proof_of_PtoQ proof_of_QtoP].
  split.
  - exact proof_of_QtoP.
  - exact proof_of_PtoQ.
Qed.
```

---

## What's Next

### Immediate Next Step — Practice
- Solve several theorems using everything learned so far
- Goal: internalize propositional logic before moving forward
- Suggested theorems to try:
  - `forall P Q : Prop, P /\ Q -> Q` (extract right side of AND)
  - `forall P Q : Prop, (P -> Q) -> ~Q -> ~P` (contrapositive)
  - `forall P Q R : Prop, (P \/ Q) -> (P -> R) -> (Q -> R) -> R` (case analysis)
  - `forall P : Prop, ~~P -> P` (double negation — harder, good challenge)

### After Practice — What Comes Next
1. **Natural numbers in Coq** — how Coq defines numbers from scratch
2. **The `induction` tactic** — proving things that hold for all numbers
3. **`rewrite` and `reflexivity`** — proving equalities
4. **Simple arithmetic theorems** — commutativity, associativity of `+`
5. **Lists** — length, append, reverse
6. **The Curry-Howard correspondence** — the deep idea that proofs are programs (will emerge naturally)

---

## Teaching Style Rules (for next session)

- Never introduce a word or symbol without explaining it immediately
- Always explain concepts in plain English before showing Coq
- Never assume prior knowledge — ask if unsure
- Descriptive names for everything (e.g. `proof_of_P` not `HP`) unless shorthand is explicitly introduced
- Every new tactic gets added to the cheat sheet
- Before every proof — read the theorem in plain English first
- Before every tactic — explain what it does and why we're using it here
