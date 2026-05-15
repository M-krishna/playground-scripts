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