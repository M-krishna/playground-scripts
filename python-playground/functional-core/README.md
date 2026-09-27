# Functional core: From Side Effects to Monads
Go in the following order:
1. Side effects
2. Function core shell
3. Effects as values
4. Chaining monads

## Side Effects
**Recap:** A side effect is anything a function does that reaches outside itself, either changing something out there or depending on something out there. Same inputs, giving same outputs, or a function leaving a mark on the world, means effects are present. 

Here is a small function that runs a shopping cart:
```python
cart = []

def add_item(name, price):
    cart.append({"name": name, "price": price})
    print(f"{name} added")
    return len(cart)
```
Your task, in order:
1. Before writing anything, list every distinct thing this function does that counts as a side effect, and for each, say in a few words why it qualifies. There is more than one; I'll let you find how many.
2. Then write a pure version of "add an item to the cart." Don't look back at my earlier discount example. The interesting part is working out what the pure version's inputs and output have to be, once it's not allowed to touch the global cart or print. Let that question drive the design.
3. Write one sentence defining "side effect" in your own words.

**My answers:**
1. appending to a global cart variable is a side effect because its going outside the function. Printing to the console is another side effect because its doing something outside of the function.
2. Here is the pure version:
```python
def add_item_to_cart(cart):
    item = {"name": "Soap", "price": "100"}
    new_cart = cart
    new_cart.append(item)
    return new_cart
```
3. If we take a function for example, a side effect is something a function does outside its own world. For example, writing to console, mutating a global state and so on. A side effect free function is a pure function, for which passing the same input gives us the same output, no matter how many times we run it.

**Response from Claude (Opus 4.8):**
There are a couple of bugs in the code. Let me show you the problem by running your code in my head:
```python
original = []
add_item_to_cart(original)
print(original) # what prints here?
```
You'd expect original to still be `[]`, because a pure function shouldn't touch its caller's data. But it prints `[{"name": "Soap", "price": "100"}]`. The original list is *changed*. Your function still has a side effect: it mutates the input.

The cultprit is this line:
```python
new_cart = cart
```
You intended this to make a copy. It doesn't. In Python, that line just gives the *same* list a second name. `new_cart` and `cart` are two labels pointing at one object in memory, so `new_cart.append(...)` appends to the caller's list. The rename created no new list at all.

To actually get a fresh list, you copy the contents:
```python
new_cart = cart + [item]
```
`cart + [item]` builds a brand-new list containing the old items plus the new one, and leaves the original untouched. (`list(cart)` followed by an append also works, but the `+` form says "old plus new" in one readable line.)

There's a second smaller thing. You hardcoded the item inside the function:
```python
item = {"name": "Soap", "price": "100"}
```
That means the function can only ever add soap. A pure function's output should be determined entirely by its inputs, so the item needs to *arrive* as an argument too, just like the cart did. Right now soap is smuggled in from outside the parameter list. (Also, `"100"` is a string; a price probably wants to be a number, `100`.)

Here's the shape its reaching for:
```python
def add_item_to_cart(cart, name, price):
    item = {"name": name, "price": price}
    return cart + [item]
```
Now prove to yourself it's pure. This is the part that etches it in, so actually run it:
```python
c0 = []
c1 = add_item_to_cart(c0, "Soap", 100)
c2 = add_item_to_cart(c1, "Rice", 80)

assert c0 == []     # original never changes
assert len(c1) == 1
assert len(c2) == 2
print(c0, c1, c2)
```

## Function Core, Imperative Shell
Okay, here is the problem statement and the task. The code first:
```python
saved_cart = []

def checkout(name, price):
    global saved_cart
    saved_cart = saved_cart + [{"name": name, "price": price}]
    total = sum(item["price"] for item in saved_cart)
    print(f"Added {name}. Cart total is {total}")
    return total
```
Your task, in order:
1. Before writing, identify the three jobs happening in `checkout` and label each one as *read*, *compute*, or *act*. There are a few statements; group them.
2. Now split it. You already have `add_item_to_cart` as one piece of the core. Write a second pure core function that computes the total from a cart. Then write a `checkout` shell function that does only three things in sequence: read the stored cart, call your pure functions to compute the new cart and total, then act (write the stored cart back and print). The rule to hold yourself to: the shell contains no arithmetic and no business logic of its own; it only moves data between the world and the core. If you catch yourself doing a calculation inside the shell, that calculation belongs in a core function instead.
3. Write one sentence, in your own words, describing what distinguishes a shell function from a core function.

**A hint:** the stored cart (`saved_cart`) is global state. Your shell will need to read it into a local variable, pass that to the pure core, get a new cart back, and then write new cart back to the global. Notice that the *reading* and *writing* of the global are effects and live in the shell; the *making of the new cart* is pure and lives in the core. That separation is exactly what you're practising.

**Here are my answers:**
1. `saved_cart` is writing to the global database, so it comes under *act*. We are also reading `saved_cart` inside our function, so it comes under *read* as well. Computing `total` comes under *compute* obviosuly. Printing comes under *act* because its writing something to standard output.
2. I was struggling to write the code, and asked claude to help me. Here is what it gave:
```python
saved_cart = []

def add_item_to_cart(cart, name, price):
    item = {"name": name, "price": price}
    return cart + [item]

def compute_cart_total(cart):
    return sum([item["price"] for item in cart])

def checkout(name, price):
    global saved_cart
    current_cart = saved_cart
    new_cart = add_item_to_cart(current_cart, name, price)
    total = compute_cart_total(new_cart)
    saved_cart = new_cart
    print(f"Added {name}. Cart total is ${total}.")
```

The core functions here are `add_item_to_cart` and `compute_cart_total` because it only contains the business logic and no effects. We don't need a database to test things because it only contains pure logic and no effects.

The shell function here is the `checkout` function because it reads the input (cart input), computes the total (delegates the computation to the pure function), and finally writes to the database (`saved_cart`) and writes to the standard output as well. As you can see, it doesn't have any `+` or a `sum`.

### The template Claude gave for Functional core, Imperative shell

Problem: our cart logic is pure, but a real cart still has to be
saved and still has to tell the user what happened. Those are
effects. Where do they go?

[the tangled checkout, everything mixed together]

Idea: [your own words — read/compute/act, shell has no logic,
core has no effects]

[the split version: add_item_to_cart, compute_cart_total, checkout,
with read/compute/act comments]

[the output when you run the checkout calls]

The core needed nothing to test. The shell needed the global.
That asymmetry is the reason for the split.

Next: the shell still runs its effects in a fixed hardcoded order.
What if deciding which effects to run is itself part of the logic?

**Checkout:** `python_playground/functional-core/03_effects_as_values.py`

## Chaining Monad