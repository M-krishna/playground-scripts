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