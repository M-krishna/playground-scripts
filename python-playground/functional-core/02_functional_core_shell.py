#!/usr/bin/env python3

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
    print(f"Added {name}. Cart total is {total}.")


if __name__ == "__main__":
    checkout("Soap", 100)
    assert len(saved_cart) == 1
    checkout("Rice", 80)
    assert len(saved_cart) == 2