#!/usr/bin/env python3

def my_original_version():

    def add_item_to_cart(cart):
        item = {"name": "Soap", "price": "100"}
        new_cart = cart
        new_cart.append(item)
        return new_cart
    
    cart = []
    add_item_to_cart(cart)
    print(cart)

def proper_version():
    
    def add_item_to_cart(cart, name, price):
        item = {"name": name, "price": price}
        return cart + [item]
    
    c0 = []
    c1 = add_item_to_cart(c0, "Soap", 100)
    c2 = add_item_to_cart(c1, "Rice", 80)

    assert c0 == []
    assert len(c1) == 1
    assert len(c2) == 2
    print(c0, c1, c2)


if __name__ == "__main__":
    my_original_version()
    proper_version()