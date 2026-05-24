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

## How to read a theorem before touching the keyboard
Before writing a single tactic, do this every time:

* Step 1 -- Read what you're given
* Step 2 -- Read what you must produce
* Step 3 -- Ask: Is there more than one way the situation could be?

**For example, let's apply this to a theorem.**
```
(P \/ Q) -> (P -> R) -> (Q -> R) -> R
```
**what you're given:**
* `proof_of_PorQ` -- P is true, or Q is true. You don't know which.
* `PR` -- if P is true, you can get R
* `QR` -- if Q is true, you can get R

**What you must produce: R**

**Is there more than one way the situation could be?**

Yes -- and this is the key insight.

`proof_of_PorQ` says *either P or Q* -- but you don't know which one. So you have **two possible situations**:
* Situation 1: P is true -> use `PR` to get R
* Situation 2: Q is true -> use `QR` to get R

Either way you get R. But you have to handle **both cases separately**.

## Natural Numbers in Coq -- Built From Nothing
**The core question: what even is a number?**

You've known numbers your whole life. But Coq doesn't know anything. It needs you to *define* what a number is from scratch.

So here's a question: what is the minimum amount of information needed to describe all natural numbers?

Think about the natural numbers: 0,1,2,3,4,....

Notice two things:
1. There is a **starting point** -- zero
2. Every other number is just **"one more than" some other number**

That's it. That's all you need. 1 is "one more than zero". 2 is "one more than one more than zero". 3 is "one more than one more than one more than zero".

This idea has a name -- it's called **Peano arithmetic**, after the mathematician Giuseppe Peano.

<hr>

### How Coq defines natural numbers
```coq
Inductive nat: Type :=
    | 0: nat
    | S: nat -> nat.
```
Let's read this in plain English before anything else.
* `nat` is the name for the type of natural numbers
* `0` means zero -- it is a natural number, full stop
* `S` means "successor of" -- one more than. It takes a natural number and produces the next one.

So the numbers look like this:
| Math | Coq |
|------|-----|
| 0 | `0` |
| 1 | `S 0` |
| 2 | `S (S 0)` |
| 3 | `S (S (S 0))` |

Every number is just a tower of `S`s sitting on top of `0`.

### Why does this matter?
Because now *you can prove things about all numbers* -- by reasoning about this structure. A number is either `0`, or it is `S` of something smaller. That's the only two cases that exist.

That idea -- that there are exactly two cases, and the second one refers back to something smaller -- is what makes **induction** possible.

## Induction -- From Real Life to Coq
**A real life analogy first**

Imagine an infinite row of dominoes streching forward forever.

You want to prove that **every single domino will fall**.

You can't push each one individually -- there are infinitely many. But you can make two observations:
1. **The first domino falls** -- you push it yourself
2. **If any domino falls, the next one will fall too** -- because of how they're spaced.

Those two facts together gurantee every domino falls. Every single one, forever, no matter how far down the line.

That's induction.

<hr>

### In Math
Say you want to prove some statement is true for every natural number. Call the statement `P(n)`.

You can't check every number individually -- there are infinitely many. But if you can show:
1. **Base case:** `P(0)` is true
2. **Inductive step:** if `P(n)` is true, then `P(n + 1)` is true

Then `P(n)` is true for every number. Here's why:
* You know `P(0)`✓
* Since `P(0)`, you get `P(1)` ✓
* Since `P(1)`, you get `P(2)` ✓
* Since `P(2)`, you get `P(3)` ✓
* ...forever

The base case is pushing the first domino. The inductive step is the spacing gurantee.

<hr>

### A Concrete Math Example
Let's prove that `0 + n = n` for every natural number `n`.

**Base case -- n is 0**:

Is `0 + 0 = 0`? Yes, obviously.

**Inductive step -- assume it's true for n, prove it for n+1:**

Assume `0 + n = n`. Now consider `0 + (n+1)`

By how addition works, `0 + (n+1) = (0 + n) + 1`. And since we assumed `0 + n = n`, this becomes `n + 1`.

So `0 + (n+1) = n+1`

Both case handled -- the statement is true for every number.

<hr>

### The Crucial Thing About The Inductive Step
Notice you don't prove the inductive step from scratch. You get to **assume it's already true for n** -- that assumption is called **induction hypothesis**. You just have to show the next step follows from it.

This is what makes induction powerful. You're not proving each case independently. You're proving a chain reaction.

<hr>

### How this maps to Coq's `nat`
Remember the two cases for `nat`:
* `0` -- zero
* `S n` -- one more than `n`

Induction in Coq matches this exactly:
* **Base case**: prove your statement for `0`
* **Inductive step**: assume your statement is true for some `n`, prove it for `S n`

The tactic that does this simply:
```coq
induction n.
```
When you write that, Coq splits your goal into exactly those two cases. You handle them one at a time, just like you did with `destruct` for **OR**.

<hr>

### One more thing before we write code
In the inductive step, after you write `induction n`, Coq automatically puts the **induction hypothesis** into your hypothesis for you. It will look something like:
```
IH: P n
```
Meaning "assume this statement is already true for n." You job is just to use it to prove it for `S n`. 

## The `simpl` Tactic -- Explanation from scratch

**First -- what is computation?**

Before `simpl` makes sense, you need to understand what Coq considers "computation".

Think about a vending machine. You press button B3. The machine doesn't need to *think* -- it just mechanically follows a rule: B3 is always a bag of chips. No judgement involved. No creativity. Just a fixed rule applied automatically.

Coq has the same idea. Some things in Coq are defined as pure mechanical rules. Given a specific input, there is exactly one correct output, always, no thinking required.

<hr>

### How addition is defined in Coq
Remember how `nat` has exactly two cases -- `0` and `S n` ?

Addition is defined by following that same structure. Here is what it looks like:
```coq
Fixpoint add (n m: nat): nat :=
  match n with
  | 0 => m
  | S n' => S (add n' m)
  end.
```
Read it in plain English:
* If the first number is `0` -- just return `m`. Zero plus anything is that thing.
* If the first number is `S n'` -- meaning "one more than n" -- return `S (add n' m)`. Peel off one `S`, add the rest, put the `S` back.

Let's trace through `2 + 3` to make it concrete.
```
add (S (S 0) S (S (S 0)))
= S (add (S 0) (S (S (S 0))))   <- peel one S off the first number
= S (S (add 0 (S (S (S 0)))))   <- peel another S
= S (S (S (S (S 0))))           <- first number is 0, just return second
= 5
```
This is pure mechanical symbol shuffling. No arithmetic intution needed. Just rules applied repeatedly until nothing is left to do.

<hr>

### What `simpl` does
`simpl` tells Coq: **run the computation. Apply all the mechanical rules until you can't anymore. Show me what's left.**

It's like pressing fast forward on that mechanical process above. Coq traces through the definition, peels of all the `S`s, follows the rules, and hands you the simplified result.

Real world analogy: imagine you have a receipe that says "fold the dough, then fold it again, then fold it again." `simpl` is a machine that just...does all the folding instantly and hands you the result. You don't watch each step -- you just get the final dough.

<hr>

### What `simpl` does NOT do
This is important.

`simpl` only does **mechanical computation**. It does not do any logical reasoning. It cannot cross a gap where actual thought is required.

For example -- `simpl` can turn `add (S 0) (S 0)` into `S (S 0)` because that's just following rules. But it cannot prove `n + 0 = n` for all `n` by itself -- because that requires induction, which is reasoning and not computation.

Think of it this way:
* `simpl` is a calculator -- fast, mechanical, no judgement
* `induction` is a mathematician -- slow, thoughful, handles infinity

You'll often use both in the same proof. `simpl` cleans things up, and then you do the real reasoning.

<hr>

### One more tactic you need -- `reflexivity`
Before we write the proof, there's a second small tactic to introduce.

After `simpl` runs and simplifies both side of an equation, you'll often end up with something like:
```
n = n
```
That's obviously true -- anything equals itself. The tactic that closes the goal is:
```coq
reflexivity.
```
It does exactly one thing: looks at both sides of an equation, checks they are identical, and closes the goal. That's it.

Real world analogy: imagine someone asks you "is this cup the same as itself?" You don't need to measure it or analyze it. You just say "yes, obviously, it's the same thing." That's `reflexivity`.

### The two new tactics summarized
| Tactic | What it does |
|--------|--------------|
| `induction n` | Splits a goal about a number into two cases -- base case (`0`) and inductive step (`S n`), and puts the induction hypothesis into your hypothesis automatically |
| `simpl` | Runs mechanical computation -- simplifies expression by following definitions |
| `reflexivity` | Closes a goal from `X = X` -- both sides are identical |

### The Theorem
```coq
Theorem add_0_n: forall n: nat, 0 + n = n.
```
In plain English: *zero plus any number n equals n.*

Before writing any tactics -- let's do the reading exercise.

**What are the two cases induction will split this into?**

* So the base case will be `0`
* The inductive step will be `S n`

**Here is the full theorem:**
```coq
Theorem add_0_n: forall n: nat, 0 + n = n.
Proof.
  intros n.
  induction n.
  - simpl. reflexivity.
  - simpl. reflexivity.
Qed.
```

<hr>

**The base case -- obvious**

Goal was `0 + 0 = 0`. `simpl` ran the computation, got `0 = 0`. `reflexivity` closed it. Clear.

<hr>

**The inductive step**

Your goal was `0 + S n = S n`.

When `simpl` ran, it followed the definition of addition. Remember the rule:
```
add 0 m => m
```
So `0 + S n` just mechanically becomes `S n`. Goal became `S n = S n`. `reflexivity` closed it.

Notice something -- you had an induction hypothesis sitting in your hypothesis:
```
IH: 0 + n = n
```
But you didn't even need to use it here. `simpl` was powerful enough to just compute the answer directly.

This won't always be the case. There will be theorems where `simpl` gets you partway but then stops -- and that's exactly when you'll need to reach for the induction hypothesis.

The next theorem is specifically designed to force you to use it:

<hr>

### Next Theorem
```coq
Theorem add_n_0: forall n: nat, n + 0 = n.
```

**Full theorem**
```coq
Theorem add_n_0: forall n: nat, n + 0 = n.
Proof.
  intros n.
  induction n.
  - simpl. reflexivity.
  - simpl. rewrite IHn. reflexivity.
Qed.
```
Notice a new tactic `rewrite`. We take a look at it:

### The new tactic -- `rewrite`
This is exactly what `rewrite` does.

Real world analogy: imagine you're editing a document and you do a find-and-replace. You say "wherever you see `n + 0`, replace it with `n`." That's `rewrite`.

You point it at an equation you already have, and it finds that expression in your goal and swaps it out.

The syntax is:
```coq
rewrite IH.
```
This tells Coq: "take the equation `IH: n + 0 = n`, find `n + 0` in my goal, and replace it with `n`."

After that your goal becomes `S n = S n` -- and you know exactly what closes that.

Add `rewrite` to your tactics cheat sheet:
| Tactic | What it does |
|--------|--------------|
| `rewrite` | Takes an equation `H: A = B` and replaces `A` and `B` in the current goal |

## Coq Building Blocks -- From Scratch

### `Definition` -- Giving a name to something
**In math**

In mathematics, you constantly give names to things to avoid repeating yourself.

For example:
```
Let x = 5
Let f(n) = n + 1
```
You're not creating anything new or complex. You're just saying "I want to refer to this thing by this name from now on."

**In Programming**

Every language has this. In JavaScript:
```javascript
const x = 5;
const double = (n) => n * 2;
```
You're binding a name to a value or a function.

**In Coq**

`Definition` does exactly the same thing. You're giving a name to something -- a value, a function, anything -- as long as it is **not recursive**.
```coq
Definition five: nat := S (S (S (S (S 0))))
```
This just says "from now on, `five` means `S (S (S (S (S 0))))`
```coq
Definition is_zero (n: nat) : bool :=
  match n with
  | 0 => true
  | S _ => false
  end.
```
This defines a function called `is_zero` that takes a number and returns true if it is zero, false otherwise. The `_` means "I don't care what this value is, I'm ignoring it."

**Another Example**
```coq
Definition identity (P : Prop) (proof : P) : P := proof.
```
This is a function that takes a proposition and a proof of it, and just returns the proof unchanged.s

**The key rule**

`Definition` is for things that are **not recursive**. The moment a function needs to call itself, you must use `Fixpoint` instead.

<hr>

### `Inductive` -- Building a new type from cases

**In math**

When mathematicians define something precisely, they list every possible form it can take.

For example, defining a **binary tree**:
* A tree is either **empty**
* Or a **node** containing a value, a left subtree, and a right subtree

Nothing else is a binary tree. The definition is complete and closed.

Or defining **natural numbers** informally:
* Zero is a natural number
* If n is a natural number, then n+1 is a natural number
* Nothing else is a natural number

**In programming**

In languages like Rust or Haskell this is called an **enum** or **algebraic data type**:
```rust
enum Shape {
  Circle(f64),          // a circle with a radius
  Rectangle(f64, f64)   // a rectangle with width and height
}
```
You're saying: "a Shape is either a Circle or a Rectangle. Nothing else."

**In Coq**

`Inductive` is Coq's way of defining a new type by listing every possible way to build something of that type.

**Example 1 -- Natural numbers:**
```coq
Inductive nat : Type :=
  | 0 : nat
  | S : nat -> nat.
```
In plain English: "A `nat` is either `0` (zero) or `S` applied to another `nat` (one more than something)." Every number ever is covered by these two cases.

**Example 2 -- Booleans:**
```coq
Inductive bool : Type :=
  | true : bool
  | false : bool.
```
In plain English: "A `bool` is either `true` or `false`." Exactly two cases, nothing else.

**Example 3 -- A simple tree:**
```coq
Inductive tree : Type :=
  | Leaf : tree
  | Node : tree -> nat -> tree -> tree.
```
In plain English: "A `tree` is either a `Leaf` (empty), or a `Node` containing a left tree, a number, and a right tree."

**Why the word `Inductive`?**

Because these definitions naturally support **induction**. Every value of an inductive type is built from smaller value of the same type. So you can always reason about them by handling each case -- which is exactly what induction does.

<hr>

### `Fixpoint` -- A function that calls itself

**In math**

Some functions are defined in terms of themselves:
```
factorial(0) = 1
factorial(n) = n x factorial(n-1)
```
This works because each call makes the input strictly smaller, and you always eventually hit the base case.

**In programming**

This is recursion:
```javascript
function factorial(n) {
  if (n == 0) return 1;
  return n * factorial(n - 1);
}
```

**In Coq**

`Fixpoint` is used instead of `Definition` whenever a function needs to call itself.

**Example 1 -- Addition:**
```coq
Fixpoint add (n m : nat) : nat :=
  match n with
  | 0 => m
  | S n' => S (add n' m)
  end.
```
In plain English: "To add n and m -- if n is zero, return m. If n is one more than n', return one more than (n' + m)." Each recursive call uses `n'` which is strictly smaller than `S n'`.

**Example 2 -- Multiplication:**
```coq
Fixpoint mul (n m : nat) : nat :=
  match n with
  | 0 => 0
  | S n' => add m (mul n' m)
  end.
```
In plain English: "To multiply n and m -- if n is zero, return zero. If n is one more than n', return m added to (n' x m)." Multiplication is just repeated addition.

**Example 3 -- Checking if a number is even:**
```coq
Fixpoint is_even (n : nat) : bool :=
  match n with
  | 0 => true
  | S 0 => false
  | S (S n') => is_even n'
  end.
```
In plain English: "Zero is even. One is not even. Anything else -- peel off two and check again."

**Why not just use `Definition`?**

Coq requires you to be explicit about recursion because it needs to verify the function always terminates. Coq checks that every recursive call is made on something is strictly smaller. If you tried to write a recursive function with `Definition`, Coq would reject it.

<hr>

### `Lemma` -- A stepping stone theorem

**In math**

Mathematics use different words for proven statements depending on their role:
* **Theorem** -- a major result, important on its own
* **Lemma** -- a smaller result proved specifically as a tool to help prove something bigger
* **Corollary** -- a result that follows easily and directly

These are not technical distinctions. They are communication tools. A lemma is a mathematicians way of saying "I need to prove this smaller thing first because I'll need it as a tool later".

**In real life**

Imagine you're building a house. Before you can build the roof, you need to build the walls. The walls are not the final goal -- the house is. But you prove the walls are sound before moving on.

A lemma is like the walls. You prove it not because it's the end goal, but because the bigger thing depends on it.

**In Coq**

`Theorem`, `Lemma`, `Example` and `Proposition` are all technically identical in Coq. The difference is purely for human reader.

**Example 1 -- A lemma used to support a bigger proof:**

You already proved this:
```coq
Lemma add_n_0: forall n: nat, n + 0 = n.
```
This is a lemma because you proved it specifically to use it as a tool inside the proof of `add_comm` (addition is commutative). It's not the main result -- it's a stepping stone.

**Example 2 -- A lemma about successors:**
```coq
Lemma succ_add: forall n m: nat, S (n + m) = n + S m.
```
In plain English: "One more than (n + m) equals n plus (one more than m)." This looks small and uninteresting on its own -- but you'll need it as a tool inside `add_comm`.

**Example 3 -- Using a lemma inside a proof:**
```coq
Theorem add_comm: forall n m : nat, n + m = m + n.
Proof.
  (* at some point inside here you will write: *)
  rewrite add_n_0.
  (* using the lemma as a tool *)
```

**The Key Point**

In Coq you can use any previously proved `Theorem` or `Lemma` inside a future proof by name -- just like you use `IHn` for the induction hypothesis. Proved results become tools you can reach for at any time.

### Complete Summary
| Keyword | What it defines | Recursive? | Real World Analogy |
|---------|-----------------|------------|------------|
| `Definition` | A name for a value or simple function | No | Giving a nickname to something |
| `Inductive` | A new type listed by its possible forms | N/A | A blueprint listing every shape something can take |
| `Fixpoint` | A recursive function | Yes | A machine that solves a problem by breaking it into smaller versions of itself |
| `Lemma` | A helper theorem for a bigger result | N/A | A stepping stone -- proved because you'll need it as a tool |
| `Theorem` | A major proved result | N/A | The final destination you were building toward |

## The Theorem

### `add_comm` -- Addition is Commutative
What we're proving
```coq
Theorem add_comm : forall n m : nat, n + m = m + n.
```
In plain English: *for any two numbers n and m, it doesn't matter which order you add them -- you always get the same result.*

### Reading exercise first
Before touching the keyboard -- what are the two cases induction will give you?

We're doing induction on `n`. So:
* **Base case:** n is `0` -- prove `0 + m = m + 0`
* **Inductive step:** n is `S n'` -- assume `n' + m = m + n'`, prove `S n' + m = m + S n'`

**Think about what tools you already have**

You have two lemmas already proved:
* `add_n_0 : forall n : nat, n + 0 = n`
* `add_0_n : forall n : nat, 0 + n = n`

You will need both.

**Now try the base case first**

Your goal in the base case will be:
```
0 + m = m + 0
```
Think about this carefully:
* The left side -- `0 + m` -- what does `simpl` do to it? Remember how addition is defined. When the first argument is `0`, it just returns the second argument. So `simpl` turns `0 + m` into `m`.
* The right side -- `m + 0` -- can `simpl` handle this? The first argument is `m`, which is unknown. So `simpl` gets stuck here.

After `simpl` your goal will be:
```
m = m + 0
```
You have a lemma that says exactly that `m + 0 = m`. Which tactic do you use to apply an equation from your toolkit to replace something in the goal?

### Full Theorem
```coq
Lemma add_S_comm: forall n m : nat, m + S n = S (m + n).
Proof.
  intros n m.
  induction m.
  - simpl. reflexivity.
  - simpl. rewrite IHm. reflexivity.
Qed.


Theorem add_comm: forall n m : nat, n + m = m + n.
Proof.
  intros n m.
  induction n.
  - simpl. rewrite add_n_0. reflexivity.
  - simpl. rewrite add_S_comm. rewrite IHn. reflexivity.
Qed.
```

**What just happened -- the big picture**

Step back and look at what you just did:

You proved `add_comm` -- a fundamental fact about arithmetic -- from **absolute scratch**. Coq doesn't know addition is commutative until you prove it. You built that fact yourself, piece by piece, using nothing but the definition of natural numbers and logic.

And notice the structure of how you got there:
```
add_O_n        — proved earlier
add_n_O        — proved earlier
add_S_comm     — proved just now as a lemma
add_comm       — the final result, built on top of all three
```
This is exactly how mathematics works. Big results rest on smaller lemmas, which rest on even smaller ones, all the way down to the foundations.

<hr>

**What you used in the inductive step of `add_comm`**
```coq
simpl.       -> peeled off S, goal became S (n + m) = m + S n
rewrite add_S_comm. -> turned m + S n into S (m + n), goal became S (n + m) = S (m + n)
rewrite IHn. -> turned n + m into m + n, goal became S (m + n) = S (m + n)
reflexivity. -> both sides identical, closed
```
Every step had a clear reason. Nothing was guesswork.

<hr>

**Where you are now**

You have now covered:
* Propositional logic -- all connectives, all tactics
* Natural numbers -- how Coq builds them from scratch
* Induction -- base case, inductive step, induction hypothesis
* `simpl`, `rewrite`, `reflexivity`
* Lemmas as stepping stones

## Lists in Coq -- From Scratch

### What is a list?

**What?**

A list is an ordered collection of elements where **order matters** and **repetition is allowed**.

For example:
* `[1, 2, 3]` is a list of three numbers
* `[3, 2, 1]` is a different list -- same elements, different order
* `[1, 1, 2]` is valid -- repeatition is fine

**Why?**

Lists are one of the most fundamental data structures in all of computer science and mathematics. Almost every program ever written uses lists in some form. In Coq specifically, lists are important because:
* They are simple enough to define from scratch
* They are complex enough to need induction to reason about
* Proving things about lists teaches you patterns that apply to every data structure you'll ever meet

**How?**

Just like `nat` had exactly two cases - `0` and `S n` -- a list has exactly two cases:
* It is **empty** -- nothing in it
* It is an **element attached to the front of another list**

That second case is the key insight. A list is not a flat container -- it is **recursive**. A non-empty list is always one element stuck onto the front of a smaller list.

Visually:
```
[1, 2, 3]
= 1 :: [2, 3]
= 1 :: 2 :: [3]
= 1 :: 2 :: 3 :: []
```
Where `::` means "attach to the front of" and `[]` means the empty list.

### How Coq defines it

**What?**
```coq
Inductive list (A : Type) : Type :=
  | nil : list A
  | cons : A -> list A -> list A.
```

**Why each part?**

Let's read every single piece:

`Inductive list (A : Type) : Type`
* `Inductive` -- we are defining a new type by listing its cases
* `list` -- the name of the type we're creating
* `(A : Type)` -- this is new. It means "list works for any type A". A list of numbers, a list of booleans, a list of propositions -- all covered by the same definition. `A` is a placeholder for whatever type you want to store.
* `: Type` -- list itself is a type

`| nil : list A`
* `nil` is the empty list -- it contains nothing
* It is a valid `list A` for any type `A`

`| cons : A -> list A -> list A`
* `cons` is short for "construct" -- it builds a new list by attaching one element to the front of an existing list.
* It takes an element of type `A` and an existing `list A`, and produces a new `list A`
* This is the `::` operation you saw above

**How does this look in practice?**
```coq
(* The empty list of natural numbers *)
Definition empty : list nat := nil.

(* The list [1] *)
Definition one_item : list nat := cons 1 nil.

(* The list [1, 2, 3] *)
Definition three_items : list nat := cons 1 (cons 2 (cons 3 nil)).
```
Coq actually gives you a nicer notation so you don't have to write `cons` everywhere:
```coq
(* These mean exactly the same thing *)
cons 1 (cons 2 (cons 3 nil))
1 :: 2 :: 3 :: []
[1; 2; 3]
```

### What is `(A : Type)` -- Polymorphism

**What?**

This is called **polymorphism**. It means "works for many types".

**Why?**

Without it you'd need a separate definition for every type:
```coq
Inductive list_of_nat ...
Inductive list_of_bool ...
Inductive list_of_prop ...
```
That's absurd. The structure of a list is the same regardless of what it contains. Polymorphism lets you write the definition once and use it for anything.

**How?**

`A` is a **type parameter** -- a placeholder. When you actually use the list, you fill in what `A` is:
```coq
list nat (* a list of natural numbers *)
list bool (* a list of booleans *)
list prop (* a list of propositions *)
```
Think of it like a box factory. The factory doesn't care what you put in the boxes -- it just knows how to make boxes. `A` is whatever you decide to put inside.

### Three Fundamental List Functions
Now that we have lists, we need functions to work with them. There are three you'll prove things about:

1. `length` -- **How many elements are in a list?**
```coq
Fixpoint length (A : Type) (l: list A) : nat :=
  match l with
  | nil => 0
  | cons _ t => S (length A t)
  end.
```
In plain English:
* Empty list has length zero
* A non-empty list has length one more than the length of its tail

The `_` means "I don't care about the head element -- I'm just counting".

`t` stands for **tail** -- everything after the first element.

Example:
```
length [1; 2; 3]
= S (length [2; 3])
= S (S (length [3]))
= S (S (S length []))
= S (S (S 0))
= 3
```

2. `append` -- Join two lists together
```coq
Fixpoint append (A : Type) (l1 l2 : list A) : list A :=
  match l1 with
  | nil => l2
  | cons h t => cons h (append A t l2)
  end.
```
In plain English:
* Appending an empty list to l2 gives you l2
* Appending a non-empty list -- take the head off, append the rest, put the head back

`h` stands for **head** -- the first element.

Example:
```
append [1; 2] [3; 4]
= 1 :: append [2] [3; 4]
= 1 :: 2 :: append [] [3; 4]
= 1 :: 2 :: [3; 4]
= [1; 2; 3; 4]
```
Coq uses the notation `++` for append, so `[1; 2] ++ [3; 4]` means the same thing.

3. `reverse` -- Flip a list backwards
```coq
Fixpoint reverse (A : Type) (l : list A) : list A :=
  match l with
  | nil => nil
  | cons h t => append A (reverse A t) (cons h nil)
```
In plain English:
* Reversing an empty list gives you an empty list
* Reversing a non-empty list -- reverses the tail, then append the head at the end.

Example:
```
reverse [1; 2; 3]
= reverse [2; 3] ++ [1]
= (reverse [3] ++ [2]) ++ [1]
= ((reverse [] ++ [3]) ++ [2]) ++ [1]
= (([] ++ [3]) ++ [2]) ++ [1]
= ([3] ++ [2]) ++ [1]
= [3; 2] ++ [1]
= [3; 2; 1]
```

### Summary so far
| Concept | What it is | Coq keyword |
|---------|------------|-------------|
| List | A recursive structure -- empty or element plus smaller list | `Inductive` |
| Polymorphism | Works for any type -- `A` is placeholder | `(A : Type)` |
| `nil` | The empty list | `[]` |
| `cons` | Attach the element to front of list | `::` |
| `length` | Count elements | `Fixpoint` |
| `append` | Join two lists | `++` |
| `reverse` | Flip a list backwards | `Fixpoint` |

### What comes next
Now that you understood what lists are and how the three functions, work, you're going to prove things about them. For example:
* The length of two appended lists equals the sum of their lengths
* Reversing a list twice gives you the original list back

These proofs will use everything you've learned -- `induction`, `simpl`, `rewrite`, `reflexivity` -- applied to lists instead of numbers.

<hr>

### First List Proof -- Length of Append

**What we're proving**
```coq
Theorem length_append : forall (A : Type) (l1 l2: list A),
  length A (append A l1 l2) = length A l1 + length A l2.
```

**What?**

In plain English: *the length of two lists joined together equals the length of the first list plus the length of the second list.*

For example:
```
length [1; 2] = 2
length [3; 4; 5] = 3
length ([1; 2] ++ [3; 4; 5]) = length [1; 2; 3; 4; 5] = 5 = 2 + 3
```

**Why?**

This is the most fundamental fact about `append` and `length`. It connects two functions together. Almost every bigger proof about lists will need this fact as a tool -- making it a perfect lemma to prove first.

**How?**

Same pattern as always -- induction. But on which variable?

Think carefully. `append` is defined by peeling apart `l1` -- remember its definition:
```coq
| nil => l2
| cons h t => cons h (append A t l2)
```
It recurses on `l1`. So `simpl` will be able to make progress when `l1` is `nil` or `cons h t`. That means we should do induction on `l1`.

### Reading Exercise
Induction on `l1` gives you two cases. But notice -- for lists, the two cases are different from numbers:
* **Base case:** `l1` is `nil` -- the empty list
* **Inductive step:** `l1` is `cons h t` -- one element `h` attached to a smaller list `t`

And your induction hypothesis will be about `t` -- the smaller list.

<hr>

### Your proof state after `intros` and `induction l1`

**Base case goal:**
```
length A (append A nil l2) = length A nil + length A l2
```

**Inductive step goal:**
```
length A (append A (cons h t) l2) = length A (cons h t) + length A l2
```

**With induction hyposthesis:**
```
IHt : length A (append A t l2) = length A t + length A l2
```

<hr>

### One thing to notice about `induction` on lists
When you write `induction l1`, Coq splits into two cases and automatically names things:
* The head element is called `a` by default
* The tail is called `l` by default -- but you can name them yourself.

To name them yourself you write:
```coq
induction l1 as [| h t IHt].
```
Read this as:
* `|` separates the two cases
* First case is `nil` -- nothing to name
* Second case is `cons h t` -- head is `h`, tail is `t`, induction hypothesis is `IHt`

This is the same `as` syntax you used with `destruct` before -- just applied to lists now.

### The Full Theorem
```coq
(* length function *)
Fixpoint length (A : Type) (l : list A) : nat :=
  match l with
  | nil _=> 0
  | cons _ _ t => S (length A t)
  end.
  
Fixpoint append (A : Type) (l1 l2: list A) : list A :=
  match l1 with
  | nil _ => l2
  | cons _ h t => cons A h (append A t l2)
  end.


Theorem length_append : forall (A : Type) (l1 l2: list A),
  length A (append A l1 l2) = length A l1 + length A l2.
Proof.
  intros A l1 l2.
  induction l1.
  - simpl. reflexivity.
  - simpl. rewrite IHl1. reflexivity.
Qed.
```

<hr>

### Where are you now
You have proved:
* `add_0_n` -- zero plus n equals n
* `add_n_0` -- n plus zero equals n
* `add_S_comm` -- helper lemma for commutativity
* `add_comm` -- addition is commutative
* `length_append` -- length distributes over append

### Next proof -- reverse of append
Before we get to proving that reversing twice gives you the original list, you need one stepping stone lemma first:
```coq
Lemma reverse_append : forall (A : Type) (l1 l2 : list A),
  reverse A (append A l1 l2) = append A (reverse A l2) (reverse A l1).
```

### Full Theorem
```coq
Lemma append_nil : forall (A : Type) (l : list A),
  append A l (nil A) = l.
Proof.
  intros A l.
  induction l as [| h t IHt].
  - simpl. reflexivity.
  - simpl. rewrite IHt. reflexivity.
Qed.

Lemma append_assoc : forall (A : Type) (l1 l2 l3 : list A),
  append A (append A l1 l2) l3 = append A l1 (append A l2 l3).
Proof.
  intros A l1 l2 l3.
  induction l1 as [| h t Iht].
  - simpl. reflexivity.
  - simpl. rewrite Iht. reflexivity.
Qed.

Lemma reverse_append : forall (A : Type) (l1 l2 : list A),
  reverse A (append A l1 l2) = append A (reverse A l2) (reverse A l1).
Proof.
  intros A l1 l2.
  induction l1 as [| h t IHt].
  - simpl. rewrite append_nil. reflexivity.
  - simpl. rewrite IHt. rewrite append_assoc. reflexivity.
Qed.

(* Different Theorem *)
Theorem reverse_reverse : forall (A : Type) (l : list A),
  reverse A (reverse A l) = l.
Proof.
  intros A l.
  induction l as [| h t IHt].
  - simpl. reflexivity.
  - simpl. rewrite reverse_append. simpl. rewrite IHt. reflexivity.
Qed.
```

**Where are you now**

You have now completed:
```
Propositional logic ✓
Natural numbers ✓
Induction ✓
Lists ✓
```

**What's next -- Curry-Howard Correspondence**

This is where everything you've done suddenly looks completely different and much deeper.

Remember back at the very beginning -- a proof of `P -> Q` is a function that takes evidence of P and produces evidence of Q?

Curry-Howard says that wasn't just an analogy. It is literally true. Proofs are programs. Propositions are types. The entire logical system you've been working in is secretely a programming language.

## I had a question
Before proceeding I have a question. In few theorems we've solved, we had a solve a separate Lemma and use it in the main theorem. My question is, while solving the main theorem, how do we get to know that we had solve this sub problem first before tackling the main theorem. I don't think I can figure out the sub problem first. Answer this question first and if possible provide an example.

<hr>

### Way 1 -- Get stuck first, then extract the lemma
This is the most natural way. You don't figure out the lemma in advance. You just start the proof, get stuck, and the stuck point tells you exactly what lemma you need.

**Example -- `reverse_append**

When you were proving `reverse_reverse`, if you had tried to prove it directly without `reverse_append`, your inductive step after `simpl` would have left you with:
```
reverse A (append A (reverse A t) [h]) = h :: t
```
You're stuck. `simpl` can't help. `rewrite IHt` can't help directly. But look at what's blocking you -- there's a `reverse` applied to an `append`. You can't simplify that without knowing how `reverse` distributes over `append`.

That stuck point is telling you exactly what lemma you need:
```coq
Lemma reverse_append : forall (A : Type) (l1 l2 : list A),
  reverse A (append A l1 l2) = append A (reverse A l2) (reverse A l1).
```
The shape of what's blocking you IS the lemma. You extract it, prove it separately, come back and use it.

**The practical workflow**
```
Start main proof
    ↓
Get stuck at some goal
    ↓
Ask: what fact about my functions would unstick me?
    ↓
That fact is your lemma
    ↓
Set main proof aside
    ↓
Prove the lemma
    ↓
Come back and use it
```
This is how most mathematicians and Coq programmers actually operate. They don't plan all lemmas upfront. They discover them by getting stuck.

<hr>

### Way 2 -- Read the function definitions carefully upfront
This is a more experienced skill. Once you know it, you can sometimes predict lemmas before getting stuck.

**The key insight**

Every function you define by recursion has a fixed pattern -- it always recurses on one specific argument. That pattern tells you what facts will be easy to prove and what facts will be hard.

**Example -- `append`**
```coq
Fixpoint append (A : Type) (l1 l2 : list A) : list A :=
  match l1 with
  | nil _ => l2
  | cons _ h t => cons A h (append A t l2)
  end.
```
`append` recurses on `l1`. This means:
* Facts about the LEFT argument of append will be easy -- `simpl` can make progress
* Facts about the RIGHT argument will be hard -- `simpl` gets stuck

So just from reading the definition you can predict:
* `append nil l = l` -- easy, `simpl` handles it directly
* `append l nil = l` -- hard, needs a lemma -- because `nil` is on the right

That's exactly why `append_nil` was needed as a lemma. The definition told you in advance.

**Example -- `reverse`**
```coq
Fixpoint reverse (A : Type) (l : list A) : list A :=
  match l with
  | nil _ => nil A
  | cons _ h t => append A (reverse A t) (cons A h (nil A))
  end.
```
`reverse` is defined using `append` internally. So whenever you have `reverse` applied to an `append`, `simpl` won't know how to untangle them -- because that combination isn't directly in any definition. That tells you upfront that you'll need a lemma connecting `reverse` and `append`.

### The honest summary
| Situation | What to do |
|-----------|------------|
| You're new to a problem | Just start. Get stuck. Extract the lemma from the stuck point. |
| You're experienced | Read function definitions. Notice which arguments they recurse on. Predict hard cases upfront |

Every time you hit a wall in a Coq proof, stop and ask: "what fact about my functions, if I had it, would let me move forward?" That fact is your next lemma.