## What is a Proof?
Forget Coq. Forget math notation. Think about everyday life.

If I say *"it rained last night"* -- how would you prove that to me?

You might say:
* "The ground is wet"
* "I heard it on the weather app"
* "I saw it with my own eyes"

That **evidence** you just gave me -- *that is the proof*. A proof is just **evidence that convinces someone a statement is true.**

Now here's the key question Coq is always asking:
> *"You say this statement is true -- okay, show me the evidence"*

Coq never takes your word for it. It wants to **see** the evidence. And your job, when writing proofs in Coq, is to **build that evidence piece by piece**.

That's the whole game.

## What is a Proposition?
A **proposition** is just a **statement that can be true or false**. That's it. Examples:

* "It is raining" -- proposition
* "2 + 2 = 4" -- proposition
* "All cats are black" -- proposition

These are all statements where you can ask *"is this true or false?"*

Now here's the thing. A proposition by itself is just a **claim**. It's just words. It means nothing until someone provides **evidence** for it.

So in Coq, there are always **two separate things:**
1. **The Proposition** -- the statement (*"it is raining"*)
2. **The proof** -- the evidence (*"the ground is wet, I can show you"*)

These are **different things**. Never mix them up. 

Let's make this concrete with a tiny example in plain English before we ever touch Coq.

| **Proposition** | **Proof** |
|-----------------|-----------|
| It is raining | The ground is wet |
| 2 + 2 = 4 | count on your fingers |
| P | ??? (depends on what P is) |

The proposition is the **question**. The proof is the **answer**.

One more tiny thing before we move on.

When mathematicians want to talk about a proposition without caring *what* it says specifically, then just call it **P**. That's all P means -- *"some statement, I don't care which one."*

So when you see `P` in math or Coq -- it just means *"some proposition"*. Nothing scary.

That's it for now. Two ideas:
1. A proposition is a statement that can be true or false.
2. A proof is the evidence for that statement.

Then next we talk about **implication** -- which is were things start getting interesting.

## Implication
You already know this from real life.

Implication is just the idea of **"if this, then that."**

Examples:
* *"If it is raining, then the ground is wet"*
* *"If I study, then I will pass"*
* *"If a number is even, then it is divisible by 2"*

In Math we write implications with an arrow: **P -> Q**

Which just means: *"If P is true, then Q is true"*.

### The crucial question -- What is a PROOF of an implication?
Remember, we always ask -- *what is the evidence?*

So what would convince you that **"If it is raining, then the ground is wet"** is true?

Think about it in plain English. You'd want someone to show you:
> "Give me any situation where it is raining -- and I will show you the ground is wet in that situation"

In other words, a proof that **P -> Q** is a **method**. A process. Something that:
* **Takes** evidence that P is true.
* **Produces** evidence that Q is true.

Not magic. Just a process that converts one piece of evidence into another.

Let's make it concrete.

| Implication | What a proof looks like |
|-------------|-------------------------|
| If raining -> ground is wet | "Show me the rain, I'll point to the wet ground" |
| If P -> Q | "Give me proof of P, I'll give you proof of Q |

This is the single most important idea in all of Coq:
> A proof of P -> Q is a function. It takes a proof of P and returns a proof of Q.

A **function**. Like in programming. It takes input and produces output.
* Input -> proof of P
* Output -> proof of Q

So now we have three connected ideas:
1. A **proposition** is a statement
2. A **proof** is evidence for a statement
3. A **proof of P -> Q** is a function that converts evidence of P into evidence of Q

## Your First Theorem
Here is the simplest possible theorem:
```coq
Theorem easy_1: P -> P.
```
Read this in plain English:
> *"If P is true, then P is true."*
Obvious right? If it's raining, then it's raining. But let's **prove** it in Coq step by step.

### Starting the proof
You start every proof in Coq like this:
```coq
Theorem easy_1: P -> P.
Proof.

Qed.
```
* `Proof.` -- tells Coq *"I'm starting my evidence now"*
* `Qed.` -- tells Coq *"I'm done, check my work."*

Everything you write **between** those two is how you build the evidence.

### The Proof State
When you start a proof, Coq shows you something called the **proof state**. Think of it as Coq asking you a question:
```
============================
P -> P
```
Everything below this line is what you need to prove. Right now it's saying:
> *"Okay, prove to me that P -> P."*

### Step 1 -- `intros`
Remember what a proof of `P -> P` is?

It's a **function**. It takes evidence of P and returns evidence of P.

So the first thing we do is say -- *"okay Coq, hand me the evidence of P and I'll give it a name."*

That's exactly what `intros` does. It says:
> *I'll take whatever you're giving me as input, and name it."*
```coq
intros evidence_of_P.
```
After this, the proof state changes to:
```
evidence_of_P : P
============================
P
```
Read this as:
* **Above the line** -- *"I currently have something called `evidence_of_P` which is a proof of P"*
* **Below the line** -- *"I still need to prove: P"*

### Step 2 -- `exact`
Now look at what you need to prove -- just `P`.

And look at what you already have -- `evidence_of_P`, which IS a proof of P.

You already have the answer! So just point at it and say:
```coq
exact evidence_of_P.
```
This tells Coq: *"the evidence you're looking for is exactly this thing I'm holding."*

Coq checks it, says ✓, and you're done.

### The Full Proof
```coq
Theorem easy_1: P -> P.
Proof.
    intros evidence_of_P.
    exact evidence_of_P.
Qed.
```

### What just happened -- In Plain English
1. Coq asked us to prove *"if P then P"*
2. We said *"okay, give me the evidence that P is true, I'll call it `evidence_of_P`"*
3. Coq gave it to us and said "now prove P"
4. We said "I already have that -- it's literally `evidence_of_P`
5. Coq said ✓

Notice -- we never said what P actually **is**. It could be *"it is raining"* or *"2 + 2 = 4"* or anything. Didn't matter. The proof works for **any** P.

## What I Should Have Told You -- Types
In Coq, **everything has a type**. This is non-negotiable. Coq is extremely strict about it.

You know types from programming already:
* `42` has type `int`
* `"hello"` has type `string`
* `true` has type `bool`

Coq works the same way. Everything -- including propositions -- has a type.

### The Type `Prop`
In Coq, propositions have a special type called `Prop`.

`Prop` just means *"this thing is a proposition -- a statement that could be proven."*

So when we write:
```coq
P: Prop
```
We're saying: *"P is a proposition"*. That's it. We're telling Coq -- hey, P is not a number or a string, it's a **statement** that can have evidence for it.

### The Correct Theorem
So the theorem should have been:
```coq
Theorem easy_1 : forall P : Prop, P -> P.
```
Read this out loud as:
> "For any proposition, if P is true then P is true."

Let's break it down word by word:
| Part | Meaning |
|------|---------|
| `forall P: Prop` | For any proposition P |
| `P -> P` | if P then P |

The `forall P: Prop` part is just us telling Coq -- "we're not talking about one specific P, we mean any proposition whatsoever".

### And the Proof Changes Slightly
```coq
Theorem easy_1: forall P: Prop, P -> P.
Proof.
    intros P evidence_of_P.
    exact evidence_of_P.
Qed.
```

Notice `intros` now takes **two** things:
* `P` -- the proposition itself
* `evidence_of_P` -- the proof of P

Because `forall P: Prop` is also something being handed to us, just like `P -> P` was. The `intros` tactic collects both.

The proof state after `intros P evidence_of_P` looks like:
```
P : Prop
evidence_of_P : P
============================
P
```
And then `exact evidence_of_P` finishes it exactly like before.

## What is a Tactic? (`intros`, `exact`)
Remember we said a proof is **evidence you build piece by piece**?

A **tactic** is just a **command you give to Coq** to help build that evidence one step at a time.

That's it. Nothing more.

Think of it like this. Imagine Coq is a very strict friend who needs convincing:
* You make **claim** -- the theorem
* Coq says *"prove it"*
* You give Coq **instructions** one by one -- those instructions are tactics
* Each tactic makes the remaining job **smaller**
* When there's nothing left to prove, you're done 

Tactics are just **instructions**. Each one does one small job.

### The Two Tactics We Used
`intros`

Remember, our goal was:
```
forall P : Prop, P -> P
```
This goal has two things being **given to us**:
1. `forall P: Prop` -- a proposition P is being handed to us
2. `P -> P` -- a proof of P is being handed to us (because that's what implication means -- give me evidence of P, I give back evidence of P)

The `intros` tactic says:
> *"Whatever is being handed to me in the goal -- I'll take it and give it a name."*

So when we write:
```
intros P evidence_of_P.
```
We're saying:
* Take the `forall P: Prop` part -- call it `P`
* Take the proof of P from `P -> P` -- call it `evidence_of_P`

### Why did the first version only take `evidence_of_P`?
In the first version I wrote:
```coq
Theorem easy_1 : P -> P.
```
There was no `forall P: Prop`. So Coq was only being given **one thing** -- a proof of P. So `intros` only needed one name:
```coq
intros evidence_of_P.
```
In the correct version:
```coq
Theorem easy_1 : forall P : Prop, P -> P.
```
Coq is being given **two things** -- the proposition P itself, AND a proof of P. So `intros` needs two names:
```coq
intros P evidence_of_P.
```
The rule is simple:
> `intros` takes exactly as many names as there are things being given to you in the goal.

<hr>

`exact`

After `intros`, we had:
```
P : Prop
evidence_of_P : P
============================
P
```
We needed to prove `P`. We already had `evidence_of_P` which is a proof of `P`. The `exact` tactic says:
> *"The proof you're looking for is exactly this thing right here. No more work needed."*

```coq
exact evidence_of_P.
```
Coq checks -- yes, `evidence_of_P` is indeed a proof of `P`. Done.

### Summary So Far
| Word | What it means |
|------|---------------|
| Proposition | A statement that can be true or false |
| Proof | Evidence that a proposition is true |
| `Prop` | The type of propositions in Coq |
| Tactic | A command you give Coq to build evidence step by step |
| `intros` | Takes things being handed to you in the goal and gives them names |
| `exact` | Points at something you already have as the final answer |

## The Next Theorem -- Implication is Transitive
Here is the next theorem:
```coq
Theorem easy_2 : forall P Q R : Prop, (P -> Q) -> (Q -> R) -> P -> R.
```
Before we touch Coq, let's understand what this is saying in **plain English**.

### Plain English First
Imagine three statements:
* P = "It is raining"
* Q = "The ground is wet"
* R = "My shoes are wet"

Now imagine you know three things:
1. "If it is raining, the ground is wet" -- (P -> Q)
2. "If the ground is wet, my shoes are wet" -- (Q -> R)
3. "It is raining" -- P

Can you conclude that your shoes are wet?

**Yes, obviously**. You just chain the facts together:
* It is raining -> ground is wet -> shoes are wet

That chain of reasing is exactly what this theorem is saying:
> *"If you can go from P to Q, and from Q to R, and you have P -- then you can reach R."*

### Breaking Down the Theorem
```coq
forall P Q R : Prop, (P -> Q) -> (Q -> R) -> P -> R
```
| Part | Meaning |
|------|---------|
| `forall P Q R: Prop | For any three propositions P, Q, R |
| `(P -> Q)` | If we have a way to go from P to Q |
| `(Q -> R)` | And a way to go from Q to R |
| `P` | And we have P |
| `R` | Then we can produce R |

Notice `forall P Q R: Prop` -- this is just like before but now we have **three** propositions instead of one. Coq lets you list them together like that.

### Step 1 -- Start the Proof
```coq
Theorem easy_2 : forall P Q R : Prop, (P -> Q) -> (Q -> R) -> P -> R.
Proof.

Qed.
```
Coq shows us the goal:
```
============================
forall P Q R : Prop, (P -> Q) -> (Q -> R) -> P -> R
```

### Step 2 -- `intros`
How many things are being handed to us? Let's count:
1. `P` -- a proposition
2. `Q` -- a proposition
3. `R` -- a proposition
4. `(P -> Q)` -- a proof that P implies Q
5. `(Q -> R)` -- a proof that Q implies R
6. `P` -- a proof of P

So we need **six names:**
```coq
intros P Q R PQ QR HP.
```
* `P`, `Q`, `R` -- the three propositions
* `PQ` -- our proof that P -> Q
* `QR` -- our proof that Q -> R
* `HP` -- our proof of P

After this, the proof state looks like:
```
P : Prop
Q : Prop
R : Prop
PQ : P -> Q
QR : Q -> R
HP : P
============================
R
```
Read this as: *"I have all these things above the line. I need to prove R."*

### Step 3 -- Think Before Typing
Now pause. Don't touch Coq yet.

You have:
* `HP` which is evidence of P
* `PQ` which is a function -- give it evidence of P, it gives evidence of Q
* `QR` which is a function -- give it evidence of Q, it gives evidence of R

And you need evidence of R.

How would you get it in plain English?
> Feed `HP` into `PQ` -> you get evidence of Q. Feed that into `QR` -> you get evidence of R.

### Step 4 -- `apply`
Here we need a new tactic -- `apply`.

Remember `exact` says *"I already have the exact proof you need."*

But here we don't have R directly. We have a **function that can produce R** -- namely `QR`. We just need to feed it the right input.

`apply` says:
> *"I know how to produce what you want -- use this function. Now just give me its input."*

So when we write:
```coq
apply QR.
```

Coq says -- *"okay, `QR` can produce R if you give it evidence of Q. So now prove Q."*

The proof state becomes:
```
P : Prop
Q : Prop
R : Prop
PQ : P -> Q
QR : Q -> R
HP : P
============================
Q
```

### Step 5 -- `apply` Again
Now we need Q. We have `PQ` which produces Q if given evidence of P. And we have `HP` which is evidence of P.
```coq
apply PQ.
```

Coq says -- *"okay, `PQ` can produce Q if you give it evidence of P. So now prove P."*

The proof state becomes:
```
P : Prop
Q : Prop
R : Prop
PQ : P -> Q
QR : Q -> R
HP : P
============================
P
```

### Step 6 -- `exact`
Now we need P. We have `HP` which is exactly a proof of P.
```coq
exact HP.
```
Done.

### The Full Proof
```coq
Theorem easy_2 : forall P Q R : Prop, (P -> Q) -> (Q -> R) -> P -> R.
Proof.
  intros P Q R PQ QR HP.
  apply QR.
  apply PQ.
  exact HP.
Qed.
```

### What Just Happened -- In Plain English
1. We took everything we were given and named them
2. We said *"to prove R, use `QR`"* -- now just prove Q
3. We said *"to prove Q, use `PR`"* -- now just prove P
4. We said *"P is exactly `HP`"* -- Done

Notice how `apply` **works backwards** -- it looks at the goal, finds a function that produces it, and replaces the goal with what function **needs as input**.

### New Tactic Summary
| Tactic | What it does |
|--------|--------------|
| `intros` | Takes things handed to you in the goal and names them |
| `exact` | Points at something you already have as the final answer |
| `apply` | Uses a function to reduce the goal to what the function needs |

## Thing 1 -- Naming
When I wrote, `evidence_of_P` earlier, that was a full descriptive name. When I wrote `HP` later, I just used a shorthand without explaining it.

There is **no rule** that says you must call it `HP`. You can call it **anything you want**. It is just a name. A label. Like naming a variable in programming.

I could write:
```coq
intros P Q R PQ QR HP.
```
Or I could write:
```coq
intros P Q R proof_of_PtoQ proof_of_QtoR proof_of_P.
```
Both are identical to Coq. The names are just for **you** -- so you can refer to things later.

The reason mathematicians use short names like `HP` is just **convenience** -- `H` stands for "hypothesis" and `P` reminds us it's about P. But it's just a convention. Not a rule. Not magic.

## Thing 2 -- Functions

**What is a Function?**

Forget Coq. Forget Math. Think about a **vending machine**.

A vending machine does one thing:
* You put something **in** -- a coint
* You get something **out** -- a snack

That's a function. A function is just a **machine that takes input and produces output.**
```
Input -> [ machine ] -> Output
```
In math we write functions like this:
```
f(x) = x + 1
```
This means -- give me a number, I'll give you back that number plus one.
* Input: 3
* Output: 4

Simple.

**Now -- What Does This Have to do With Proofs?**

Remember we said:
> *"A proof of P -> Q is something that takes evidence of P and produces evidence of Q."*

That is **exactly** a function.
* Input -> evidence of P.
* Output -> evidence of Q.

So `PQ` in our proof is not just a fact sitting there. It is an **active machine**. You feed it evidence of P and it produces evidence of Q.

Let's use the rain example:
* P = "It is raining"
* Q = "The ground is wet"
* `PQ` = "If it is raining then the ground is wet"

`PQ` is a machine. You hand it the fact that's it's raining. It hands you back the fact that the ground is wet.

```
evidence that it is raining -> [ PQ machine ] -> evidence that ground is wet
```

**So What does `apply` Actually Do?**

When our goal is R and we have `QR` which is a machine that produces R from Q:
```coq
apply QR.
```
We're telling Coq:
> *"I'm going to use the `QR` machine to produce R. This machine needs evidence of Q as input. So now help me find the evidence of Q."*

Coq says -- *"fair enough, prove Q then"*

So the goal changes from R to Q. We didn't prove R directly. We said *"I have a machine that will give me R, I just need to feed it."*

And then:
```coq
apply PQ.
```
Same thing. We're saying:
> *"I'm going to use the `PQ` machine to produce Q. It needs evidence of P. So now help me find evidence of P."*

Goal changes from Q to P.

And finally:
```coq
exact proof_of_P.
```
We have the evidence of P sitting right there. Hand it over. Done.

### The Full Picture -- Like an Assembly Line
Think of it like a factory assembly line:
```
proof_of_P -> [ PQ machine ] -> proof_of_Q -> [ QR machine ] -> proof_of_R
```
We built that assembly line backwards:
1. First we said *"I need R, I'll use the QR machine"*
2. Then *"I need Q for that machine, I'll use the PR machine"*
3. Then *"I need P for that machine, I already have it"*

That backwards thinking is exactly what `apply` does every single time.

### The Full Proof Again -- With Better Names
```coq
Theorem easy_2 : forall P Q R : Prop, (P -> Q) -> (Q -> R) -> P -> R.
Proof.
  intros P Q R proof_of_PtoQ proof_of_QtoR proof_of_P.
  apply proof_of_QtoR.
  apply proof_of_PtoQ.
  exact proof_of_P.
Qed.
```

### Updated Summary
| Word | What it means |
|------|---------------|
| Function | A machine -- takes input, produces output |
| `proof_of_PtoQ` | A function -- takes evidence of P, produces evidence of Q |
| `apply` | Use a function to produce the goal, then prove what that function needs as input |
| Names like `HP` | Just shorthand conventions -- you can name things anything you want | 

## Conjuction -- AND
So far we've only dealt with implication `->`. Now let's add a new idea -- **AND**.

### Plain English First
AND is simple. You already know it.

*"It is raining AND it is cold."*

For this statement to be true, **both parts must be true**. Not just one. Both.

* Raining, Cold -> whole thing is true
* Raining, Cold -> the whole thing is false
* Raining, Cold -> the whole thing is false

### How Do You Prove an AND statement?
This is the key question. What evidence would convince you that *"it is raining AND it is cold"* is true?

Simple -- you need **two pieces of evidence**:
1. Evidence that it is raining
2. Evidence that it is cold

That's it. A proof of **P AND Q** is just a **pair of proofs** -- one for P and one for Q. You need both. Neither one alone is enough.

### How Coq Writes AND
In Coq, AND is written as:
```coq
P /\ Q
```
This `/\` symbol is just Coq's way of writing AND. Read it as *"P and Q"*.

### New Tactics for AND
AND introduces two new situations:

1. What if the goal is `P /\ Q` -- you need to **produce** an AND
2. What if you **have** `P /\ Q` as a hypothesis -- you need to **use** an AND

Each situation needs a different tactic. Let's cover both.

**Situation 1 -- Proving AND -- `split`**

If your goal is:
```
============================
P /\ Q
```
You need to produce evidence of both P and Q. The tactic `split` says:
> *"OKay, I'll prove both parts separately. Give me P first, then Q"*

It literally **splits** one goal into two goals.

Before `split`:
```
============================
P /\ Q
```

After `split`:
```
Goal 1:
============================
P

Goal 2:
============================
Q
```
Now you prove them one at a time.

**Situation 2 -- Using AND -- `destruct`**

If you have something like:
```
proof_of_PandQ : P /\ Q
```
You know both P and Q are true. But you can't use `proof_of_PandQ` directly -- you need to **open it up** and take out the two pieces inside.

The tactic `destruct` says:
> *"Open this up and give me the two pieces separately."*
```coq
destruct proof_of_PandQ as [proof_of_P proof_of_Q].
```

After this you have:
```
proof_of_P : P
proof_of_Q : Q
```
Two separate usable pieces. The `as [proof_of_P proof_of_Q]` part is just giving names to the two pieces that come out.

### The Theorem
```coq
Theorem easy_3 : forall P Q : Prop, P /\ Q -> Q /\ P.
```
Plain English:
> *"If P and Q are both true, then Q and P are both true."*

Obvious -- AND doesn't care about order. But let's prove it properly.

**Step by Step**

**Start**
```coq
Theorem easy_3 : forall P Q : Prop, P /\ Q -> Q /\ P.
Proof.

Qed.
```
Goal:
```
============================
forall P Q : Prop, P /\ Q -> Q /\ P
```

<hr>

`intros`

How many things are being handed to us?
1. `P` -- a proposition
2. `Q` -- a proposition
3. `P /\ Q` -- a proof that P and Q are both true

```coq
intros P Q proof_of_PandQ
```
Goal becomes:
```
P : Prop
Q : Prop
proof_of_PandQ : P /\ Q
============================
Q /\ P
```

<hr>

`destruct`

We have `proof_of_PandQ` which contains two pieces inside. Let's open it up:
```coq
destruct proof_of_PandQ as [proof_of_P proof_of_Q].
```
Goal becomes:
```
P : Prop
Q : Prop
proof_of_P : P
proof_of_Q : Q
============================
Q /\ P
```
Now we have both pieces separately.

<hr>

`split`

Out goal is `Q /\ P`. We need to prove both parts. Let's split:
```coq
split.
```

Now we have two goals. Coq will ask us to prove them one at a time.

**Goal 1:**
```
============================
Q
```

**Goal 2:**
```
============================
P
```

<hr>

**`exact` twice**

For Goal 1 - We need Q. We have `proof_of_Q`:
```coq
exact proof_of_Q.
```

For Goal 2 - We need P. We have `proof_of_P`:
```
exact proof_of_P.
```
Done.

### The Full Proof
```coq
Theorem easy_3 : forall P Q : Prop, P /\ Q -> Q /\ P.
Proof.
  intros P Q proof_of_PandQ.
  destruct proof_of_PandQ as [proof_of_P proof_of_Q].
  split.
  - exact proof_of_Q.
  - exact proof_of_P.
Qed.
```
One small new thing -- the `-` before each `exact`. This is just a **bullet point**. It tells Coq *"I'm now working on this specific goal."* It keeps things organized when you have multiple goals. Nothing more.

### Updated Tactics Table
| Tactic | What it does |
|--------|--------------|
| `intros` | Takes things handed to you in the goal and names them |
| `exact` | Points at something you already have as the final answer |
| `apply` | Uses a function to reduce the goal to what the function needs |
| `split` | Breaks an AND goal into two separate goals |
| `destruct` | Opens up an AND hyothesis and gives you its two pieces separately |

## Question 1 -- Are Implication and Conjunction Mathematical Concepts?
Yes. They come from a branch of math called **Logic**.

Logic is the study of **reasoning itself**. Not just numbers, not shapes -- just the rules of how we think and conclude things.

Think of it this way. All of math uses reasoning. But logic asks -- *"wait, what ARE the rules of reasoning? Can we write them down precisely?"*

And the answer is yes. And those rules have names.

<hr>

### The Connectives -- The Building Blocks of Logic
In logic, simple propositions like *"it is raining"* can be **combined** using special operations called **connectives**. These are the fundamental building blocks.

Here are all of them:
| Name | Symbol in Coq | Meaning | Example |
|------|---------------|---------|---------|
| Implication | `->` | If...then | If raining then wet |
| Conjunction | `/\` | AND | Raining AND cold |
| Disjunction | `\/` | OR | Raining OR snowing |
| Negation | `~` | NOT | NOT raining |
| Biconditional | `<->` | If and only if | Raining IF AND ONLY IF wet |
| Falsity | `False` | A proposition with no proof | Contradiction |
| Truth | `True` | A proposition trivially true | Always holds |

We've covered the first two. The rest we will cover one by one exactly like we've been doing.

<hr>

### Why You Should Know This?
Because these connectives are the **language** of all mathematical statements.

Every theorem you will ever prove -- in Coq or anywhere -- is built from these pieces. When you see a complex theorem it looks scary. But when you break it down it's always just these connectives combined together.

Knowing them means you can **read** any mathematical statement and understand its structure. And understanding its structure tells you how to prove it.

<hr>

### How it Connects to Coq
This is the beautiful part.

Coq is built on logic. Every theorem in Coq is a proposition built from these connectives. And each connective has a **precise and predictable** behavior in Coq:

* Each connective has a way to **prove it** when it's your goal
* Each connective has a way to **use it** when it's a hypothesis.

That's the whole pattern. Every single time. For example:
| Connective | When it's your GOAL | When it's a Hypothesis |
|------------|---------------------|------------------------|
| `P /\ Q` | `split` into two goals | `destruct` into two pieces |
| `P \/ Q` | choose which side with `left` or `right` | `destruct` into two cases |
| `~P` | ... | ... |
| `P <-> Q` | ... | ... |

We'll fill this table in completely as we go.

<hr>

### Question 2 -- How Many Tactics Exist?
Honestly -- a lot. Dozens. Maybe more.

But here's the truth -- **you don't need most of them** to get started. The core tactics that handle 90% of proofs are maybe 10 to 15.

Here are the ones that matter most as a beginner:
| Tactic | What it does |
|--------|--------------|
| `intros` | Names things handed to you in the goal |
| `exact` | Points at something you already have |
| `apply` | Uses a function to reduce the goal |
| `split` | Breaks an AND goal into two goals |
| `destruct` | Opens up a hypothesis into its pieces |
| `left`/`right` | Choose a side when goal is OR |
| `contradiction` | Closes a goal when you have a contradiction |
| `rewrite` | Replaces something using an equality |
| `induction` | Proves something by induction |
| `simpl` | Simplifies computations |
| `reflexivity` | Proves things like `x = x` |
| `unfold` | Opens up a definition | 

<hr>

### Question 3 -- Are Tactics Math?
This is a subtle question. The honest answer is -- **tactics are tools, not math.**

The **math** is the theorem. The **logic** is the structure. The **tactics** are just the instructions you give Coq to build the proof.

Think of it like this. Imagine you want to build a chair. The chair is the math. The design is the logic. The hammer and saw are the tactics -- they're just tools that help you build it.

Different tactics are good in different situations. A hammer is for nails. A saw is for cutting. You don't use a hammer to cut wood.

<hr>

### Question 4 -- How Do You Know Which Tactic To Use?
This is the most important question. And the honest answer is:

**You look at the goal and your hypothesis and ask two questions:**

**Question A -- What is my GOAL right now?**

| If your goal looks like... | Think about using... |
|----------------------------|----------------------|
| `P /\ Q` | `split` |
| `P \/ Q` | `left` or `right` |
| `P -> Q` | `intros` |
| `forall x, ...` | `intros` |
| Something you already have | `exact` |
| Something a hypothesis can produce | `apply` |

**Question B -- What do my HYPOTHESIS look like?**

| If a hypothesis looks like... | Think about using... |
|-------------------------------|----------------------|
| `P /\ Q` | `destruct` it into two pieces |
| `P \/ Q` | `destruct` it into two cases |
| `P -> Q` and you have P | `apply` it |

These two questions -- *"what is my goal?"* and *"what do I have?"* -- are the entire thought process of proving things in Coq.

Every single proof we do from now on, I want you to ask those two questions before touching any tactic. That habit is what makes someone good at this.

## Disjunction -- OR
OR is simple.

*"It is raining OR it is snowing"*

For this to be true, **at least one part must be true**. Not necessarily both. Just one is enough.

* Raining ✓, Snowing ✗ → the whole thing is true
* Raining ✗, Snowing ✓ → the whole thing is true
* Raining ✓, Snowing ✓ → the whole thing is true
* Raining ✗, Snowing ✗ → the whole thing is false

### How Do You Prove an OR statement?
What evidence would convince you that *"it is raining OR it is snowing"* is true?

You just need **one piece of evidence**. Either:
* Evidence that it is raining OR
* Evidence that it is snowing

You don't need both. You just pick whichever one you can prove and provide that.

So a proof of **P OR Q** means you either:
* Have a proof of P and you're going with that OR
* Have a proof of Q and you're going with that

### How Coq writes OR
In Coq, OR is written as:
```coq
P \/ Q
```
The `\/` symbol is just Coq's way of writing OR. Read it as *"P or Q"*.

### New Tactics for OR
Just like AND, OR has two situations:
1. When OR is your **goal** -- you need to **produce** an OR
2. When OR is a **hypothesis** -- you need to **use** an OR

### Situation 1 -- Proving OR -- `left` or `right`
If your goal is:
```
============================
P \/ Q
```
You need to pick a side. Which one you can prove?

If you can prove P, you say:
```coq
left.
```
This tells Coq *"I'm going with the left side."* The goal becomes just P.

If you can prove Q, you say:
```coq
right.
```
This tells Coq *"I'm going with the right side"*. The goal becomes just Q.

### Situation 2 -- Using OR -- `destruct`
If you have something like:
```
proof_of_PorQ : P \/ Q
```
You know at least one of P or Q is true. But you don't know **which one**. So you have to handle **both possibilities**.

The tactic `destruct` handles this:
```coq
destruct proof_of_PorQ as [proof_of_P | proof_of_Q].
```
Notice the difference from AND:
* AND used `[proof_of_P proof_of_Q]` -- **space** between names -- because you get both pieces at once.
* OR uses `[proof_of_P | proof_of_Q]` -- **pipe** between names -- because you get two separate **cases**.

After this Coq gives you **two separate goals** -- one for each case:

**Case 1 --** assuming P is the true one:
```
proof_of_P : P
============================
(whatever you need to prove)
```  

**Case 2 --** assuming Q is the true one:
```
proof_of_Q : Q
============================
(whatever you need to prove)
```
You prove the goal in each case separately. Both cases must work.

### The Theorem
```coq
Theorem easy_4 : forall P Q : Prop, P /\ Q -> P \/ Q.
```
Plain English:
> *"If P and Q are both true, then P or Q is true"*.

Obvious -- if you have both, you certainly have at least one. But let's prove it.

### Step by step

**Start**

**Goal:**
```
============================
forall P Q : Prop, P /\ Q -> P \/ Q
```

<hr>

`intros`

Things being handed to us:
1. `P` - a proposition
2. `Q` - a proposition
3. `P /\ Q` - proof that both are true

```coq
intros P Q proof_of_PandQ.
```
Goal becomes:
```
P : Prop
Q : Prop
proof_of_PandQ : P /\ Q
============================
P \/ Q
```

<hr>

`destruct`

We have `proof_of_PandQ`. Let's open it up.
```coq
destruct proof_of_PandQ as [proof_of_P proof_of_Q].
```
Goal becomes:
```
P : Prop
Q : Prop
proof_of_P : P
proof_of_Q : Q
============================
P \/ Q
```

<hr>

### Think before Typing
Our goal is `P \/ Q`. We need to pick a side.

Do we have evidence of P? Yes -- `proof_of_P`. Do we have evidence of Q? Yes -- `proof_of_Q`.

We can go either way. Let's go left -- P.

<hr>

`left` and `exact`
```coq
left.
```
Goal becomes:
```
============================
P
```
Now just:
```coq
exact proof_of_P.
```
Done.

### The Full Proof
```coq
Theorem easy_4 : forall P Q : Prop, P /\ Q -> P \/ Q.
Proof.
  intros P Q proof_of_PandQ.
  destruct proof_of_PandQ as [proof_of_P proof_of_Q].
  left.
  exact proof_of_P.
Qed.
```

### One Thing to Notice
We could have also written `right` and used `proof_of_Q`. Both work. In real proofs sometimes only one side works -- you have to look at what you have and pick the side you can actually prove.

### Updated Connective Table
| Connective | When it's you GOAL | When it's your HYPOTHESIS |
|------------|--------------------|----------------|
| `P /\ Q` | `split` into two goals | `destruct` into two pieces with *space* |
| `P \/ Q` | `left` or `right` | `destruct` into two cases with *pipe* |
| `P -> Q` | `intros` | `apply` it |
| `forall X, ...` | `intros` | `apply` it |

### Updated Tactics Table
| Tactic | What it does |
|--------|--------------|
| `intros` | Names things handed to you in the goal |
| `exact` | Points at something you already have |
| `apply` | Uses a function and reduce the goal |
| `split` | Breaks an AND goal into two goals |
| `destruct` | Opens up AND or OR hypothesis into pieces or cases |
| `left` | Choose left side when goal is OR |
| `right` | Choose right side when goal is OR |

## Negation -- NOT
Plain English first.

NOT is simple on the surface.

*"It is NOT raining"*

This just means the statement is **false**. There is no evidence for it.

### But Wait -- What Does NOT Mean as a PROOF?
Here is where it gets interesting. We always ask -- *what is the evidence?*

What would convince you that *"it is NOT raining"* is true?

Think about it. You'd want to show that *"if it were raining, something impossible would happen."* In other words:
> *"Assuming it IS raining leads to a contradiction."*

A **contradiction** means you can prove something that is **absolutely impossible**. Something that can never have any evidence. Ever.

In Coq that impossible thing has a name -- `False`.

`False` is a special proposition in Coq that has **no proof**. Nobody can ever produce evidence for it. It represents an absolute impossibility.

<hr>

### So NOT is actually an Implication
Here is the key insight:
> `~P` in Coq actually means `P -> False`

Read that as: *"assuming P leads to impossibility"*

In other words -- *"if P were true, we could prove something impossible -- therefore P cannot be true"*

So when you see `~P` in Coq, mentally replace it with `P -> False`. They are literally the same thing. Coq defines `~P` as just shorthand for `P -> False`.

<hr>

### A New Tactic -- `contradiction`
Sometimes when working with negation you end up in a situation where you have:
```
proof_of_P: P
proof_of_notP: ~P
```
You have both P and NOT P at the same time. That is a contradiction -- an impossible situation. And in logic, from an impossible situation, you can prove **anything at all**.

The tactic `contradiction` says:
> *"I have both P and ~P -- this is impossible -- therefore the goal is proven"*

You don't even need to look at what the goal is. Contradiction closes it immediately.

<hr>

### The Theorem
```coq
Theorem easy_5 : forall P : Prop, P /\ ~P -> False.
```
Plain English:
> *"If P is true AND P is not true at the same time -- that is impossible"*

This is just saying a contradiction is impossible. Let's prove it.

<hr>

### Step by step

**Start**

Goal:
```
============================
forall P : Prop, P /\ ~P -> False
```

<hr>

`intros`

Things being handed to us:
1. `P` -- a proposition
2. `P /\ ~P` -- proof of both P and NOT P

```coq
intros P proof_of_PandNotP.
```
Goal becomes:
```
P : Prop
proof_of_PandNotP : P /\ ~P
============================
False
```

<hr>

`destruct`

Open up the AND hypothesis:
```coq
destruct proof_of_PandNotP as [proof_of_P proof_of_notP].
```
Goal becomes:
```
P : Prop
proof_of_P : P
proof_of_notP : ~P
============================
False
```

<hr>

### Think before Typing
Look at what we have:
* `proof_of_P` -- evidence that P is true
* `proof_of_notP` -- evidence that P is NOT true

These two things cannot both exist. That is a contradiction. So we use:
```coq
contradiction.
```

Coq sees both `proof_of_P` and `proof_of_notP` in the hypothesis, recognizes the contradiction, and closes the goal immediately.

<hr>

### The Full Proof
```coq
Theorem easy_5 : forall P : Prop, P /\ ~P -> False.
Proof.
  intros P proof_of_PandNotP.
  destruct proof_of_PandNotP as [proof_of_P proof_of_notP].
  contradiction.
Qed.
```

<hr>

### One More Thing -- `unfold not`
Sometimes Coq doesn't automatically simplify `~P` into `P -> False` for you visually. In those cases you can explicitly unfold the definition:
```coq
unfold not.
```
This just tells Coq -- *"replace `~P` with `P -> False` so I can see what I'm working with"*

It doesn't change anything mathematically. It just makes the goal more readable.

<hr>

### Updated Connectives Table
| Connective | When it's your GOAL | When it's a HYPOTHESIS |
|------------|---------------------|------------------------|
| `P /\ Q` | `split` into two goals | `destruct` into two pieces with space |
| `P \/ Q` | `left` or `right` | `destruct` into two cases with pipe |
| `P -> Q` | `intros` | `apply` it |
| `forall x, ...` | `intros` | `apply` it |
| `~P` | `intros` then prove `False` | `contradiction` if you also have `P` |

### The Key Ideas From This Section
1. `False` is a proposition in Coq that can never be proven
2. `~P` is just shorthand for `P -> False`
3. If you have both `P` and `~P` you have a contradiction and can prove anything
4. `contradiction` closes any goal when you both `P` and `~P`

## Biconditional -- IF AND ONLY IF
Plain English First.

You've seen this in everyday language:

*"I will go to the party if and only if you go."*

This means **two things at once:**
* If you go -> I will go
* If I go -> you went

Both directions must hold. Not just one. **Both**.

This is different from regular implication which only goes **one way**.

* Implication `P -> Q` -- only goes from P to Q
* Biconditional `P <-> Q` -- goes **both ways**

<hr>

### How Do You PROVE a Biconditional?
Since it's two implications at once, you need to prove **both directions**:
1. Prove P -> Q
2. Prove Q -> P

That's it. A proof of `P <-> Q` is just **two proofs** -- one for each direction.

<hr>

### How Coq Writes Biconditional
In Coq, IF AND ONLY IF is written as:
```coq
P <-> Q
```
Read it as *"P if and only if Q."*

<hr>

### Tactics for Biconditional
Again two situations:

**Situation 1: Proving Biconditional -- `split`**

If your goal is:
```
============================
P <-> Q
```
You need to prove both directions. Just like AND, you use `split`:
```coq
split.
```
This gives you two goals:

**Goal 1:**
```
============================
P -> Q
```
**Goal 2:**
```
============================
Q -> P
```
You prove each direction separately.

**Situation 2 -- Using Biconditional -- `destruct`**

If you **have** something like:
```
proof_of_PiffQ : P <-> Q
```
You can open it up into its two directions:
```coq
destruct proof_of_PiffQ as [proof_of_PtoQ proof_of_QtoP].
```
Now you have both implications separately and can use them however you need.

<hr>

### The Theorem
```coq
Theorem easy_6 : forall P Q : Prop, (P <-> Q) -> (Q <-> P).
```
Plain English:
> *"If P if and only if Q then Q if and only if P."*

Biconditional is symmetric -- if it works both ways between P and Q, it works both ways between Q and P too. Obvious, but let's prove it carefully.

<hr>

### Step by step

**Start**

Goal:
```
============================
forall P Q : Prop, (P <-> Q) -> (Q <-> P)
```

<hr>

`intros`

Things being handed to us:
1. `P` -- a proposition
2. `Q` -- a proposition
3. `P <-> Q` -- proof of biconditional

```coq
intros P Q proof_of_PiffQ.
```
Goal becomes:
```
P : Prop
Q : Prop
proof_of_PiffQ : P <-> Q
============================
Q <-> P
```

<hr>

`destruct`

Open up the biconditional hypothesis into its two directions:
```coq
destruct proof_of_PiffQ as [proof_of_PtoQ proof_of_QtoP].
```
Goal becomes:
```
P : Prop
Q : Prop
proof_of_PtoQ : P -> Q
proof_of_QtoP : Q -> P
============================
Q <-> P
```
Now we have both directions separately.

<hr>

### Think Before Typing
Our goal is `Q <-> P`. We need to prove both directions:
1. Q -> P -- we already have this as `proof_of_QtoP`
2. P -> Q -- we already have this as `proof_of_PtoQ`

Let's split and handle each one.

<hr>

`split`
```coq
split.
```
Two goals:

**Goal 1:**
```
============================
Q -> P
```
**Goal 2:**
```
============================
P -> Q
```

<hr>

**Goal 1 -- `exact`**

We need Q -> P. We have **exactly** that -- `proof_of_QtoP`:
```coq
exact proof_of_QtoP.
```
Done.

<hr>

**Goal 2 -- `exact`**

We need P -> Q. We have **exactly** that -- `proof_of_PtoQ`:
```coq
exact proof_of_PtoQ.
```
Done.

<hr>

### The Full Proof
```coq
Theorem easy_6 : forall P Q : Prop, (P <-> Q) -> (Q <-> P).
Proof.
  intros P Q proof_of_PiffQ.
  destruct proof_of_PiffQ as [proof_of_PtoQ proof_of_QtoP].
  split.
  - exact proof_of_QtoP.
  - exact proof_of_PtoQ.
Qed.
```

### The Complete Connectives Table
We now have all the connectives. Here is the complete map:
| Connective | Meaning | When it's your GOAL | When it's a HYPOTHESIS |
|------------|---------|---------------------|------------|
| `P -> Q` | If P then Q | `intros` | `apply` it |
| `P /\ Q` | P and Q | `split` | `destruct` with space |
| `P \/ Q` | P or Q | `left` or `right` | `destruct with pipe |
| `~P` | Not P | `intros` then prove `False` | `contradiction` |
| `P <-> Q` | P iff Q | `split` | `destruct` with space |
| `forall x, ...` | For all x | `intros` | `apply` it |

Keep this table in your head. This is your **complete toolkit** for propositional logic in Coq.

Notice a beautiful pattern -- `split` and `destruct` keep showing up. That's not a coincidence:
* `split` always **breaks something into parts** when it's your goal
* `destruct` always **opens something up into parts** when it's a hypothesis

Same idea, two directions.

We have now covered all the connectives. This means you have everything you need for **propositional logic** in Coq.

The next possible items would be: natural numbers, induction and deeper math.