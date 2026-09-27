#!/usr/bin/env python3

saved_cart = []

def add_item_to_cart(cart, name, price):
    item = {"name": name, "price": price}
    return cart + [item]

def compute_cart_total(cart):
    return sum([item["price"] for item in cart])

def checkout(cart, name, price):
    global saved_cart
    current_cart = saved_cart
    new_cart = add_item_to_cart(current_cart, name, price)
    total = compute_cart_total(new_cart)
    saved_cart = new_cart
    print(f"Added {name}. Cart total is ${total}")

def plan_checkout(cart):
    plan = []
    plan.append(("save", cart))
    total = compute_cart_total(cart)
    if total > 100:
        plan.append(("print", "Free shipping for you"))
    if len(cart) == 0:  # a cart could still contain items which is priced at 0 because of some discount
        plan.append(("warn", "Cart is empty"))
    return plan

if __name__ == "__main__":
    empty_cart = []
    empty_plan = plan_checkout(empty_cart)

    assert len(empty_plan) == 2
    assert ("warn", "Cart is empty") in empty_plan
    assert ("save", []) in empty_plan

    c1 = add_item_to_cart(empty_cart, "Soap", 100)
    plan = plan_checkout(c1)

    assert len(plan) == 1
    assert ("save", c1) in plan

    c2 = add_item_to_cart(c1, "Rice", 80)
    plan1 = plan_checkout(c2)

    assert len(plan1) == 2
    assert ("save", c2) in plan1
    assert ("print", "Free shipping for you") in plan1