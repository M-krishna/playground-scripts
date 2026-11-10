# Exercise 1 - spot and remove the effects
Problem statement. Here's a function that registers a player joining a game and returns their starting position:
```python
players = {}
next_id = 1

def register_player(name):
    global next_id
    player = {"id": next_id, "name": name, "score": 0}
    players[name] = player
    next_id = next_id + 1
    print(f"Welcome {name!} You are player #{player['id']}")
    return player
```
Your task, in order:
1. List every side effects in this function. There are more than two. For each, say in a few words why it qualifies (what it reaches outside its own inputs and outputs to touch). One of them sneakier than the printing and the dictionary write -- look at what determines the player's `id`.
2. Extract a pure core function out of this. The question to let drive your design, exactly as before: once the function isn't allowed to touch `players`, `next_id`, or the console, what must arrive as arguments and what must leave as the return value? The sneaky effect from task 1 is the interesting one here -- if the `id` can't come from a global counter, where does it have to come from?
3. Write one assertion proving your core function is pure: same inputs give same output, and calling it twice doesn't change anything outside it.

A hint, because the sneaky effect is the real lesson here: reading `next_id` is a side effect too, not just writing it. A function that reads a changing global gives *different outputs on different calls even with the same argument* -- call `register_player("krishna")` twice and you get different ids, purely because the outside world changed between calls. That violates the "same input, same output" promise just as much as printing does. So a hidden *read* of mutable state is as impure as an obvious *write*. Work out how the pure version gets an id without reading a global.

**Here is my answer:**
1. `register_player` is reading `next_id` which is a global variable and outside the function, so it comes under the *read* effect. Ideally, `next_id` should come as an argument. We are also mutating the `players` global variable which should come under the *act* effect. We are also mutating the `next_id`, which should come under the *act* effect. We are also computing the `next_id`, so it should also come under *compute* as well. We are printing to the console, it should come under the *act* effect.

2. Here is my version:
```python
def compute_next_id(next_id):
    return next_id + 1

def create_player(name, player_id):
    return {"id": player_id, "name": name, "score": 0}

def register_player(players, name, next_id):
    player = create_player(name, next_id)
    new_next_id = compute_next_id(next_id)
    return (player, new_next_id)
```
**Checkout:** `python-playground/functional-core/exercises/01_exercise.py`

# Exercise 2 -- effects as values
Problem statement. You're building the notification step for a bank account after a withdrawal. Here's the tangled version:
```python
def withdraw(balance, amount):
    new_balance = balance - amount
    if new_balance < 0:
        print("Withdrawal denied: insufficient funds")
        return balance
    if new_balance < 100:
        print("Warning: low balance")
    if amount > 10000:
        print("Large withdrawal logged for compliance")
    print(f"Withdrew {amount}. New balance: {new_balance}")
    return new_balance
```
This function tangles the *decisions* (when to deny, when to warn, when to log for compliance) with the *doing* (printing, returning a balance). The decisions are business rules and belong in a pure core; right now you couldn't test "does a 15000 withdrawal trigger a compliance log?" without capturing console output.

Your task, in order. Think before writing.
1. Before any code, list the distinct effects this function might emit, and note which are conditional. There's a subtlety: one of the branches (the denial) is different in kind from the others — it doesn't just add a message, it changes what the function does with the balance. Spot which one, and think about whether "the resulting balance" is itself something the plan needs to carry, or whether it's separate from the effects.
2. Write a pure plan_withdraw(balance, amount) that returns a plan. You get to decide the plan's shape, but it has to express two things: the sequence of effect-instructions (deny / warn / compliance-log / success-message, as applicable), and what the resulting balance should be. Think about whether one flat list of tuples can hold both, or whether you want the plan to be, say, a pair of (new_balance, list_of_instructions). Let the question "where does the balance live in my plan?" drive the design — that's the real lesson of this exercise. The function must not print. It only decides and returns.
3. Write assertions for three scenarios, checking the contents of the plan (not its length): a normal withdrawal, a denied one (insufficient funds), and a large one that both leaves a low balance and trips the compliance log. For the denied case, assert that the balance in the plan is unchanged and that no success message is present.

A hint, since this one adds a wrinkle we haven't hit: so far our plans carried only *effects*. This time the plan also has to carry a plain result (the new balance) that isn't an effect at all -- it's just data the caller needs. That's why task 1 asks you to separate "the balance" from "the messages." A plan can be more than a list of effects; it can be a result *plus* the effects that should accompany it. Working out that structure is the point.

**Here are my answers:**
1. 