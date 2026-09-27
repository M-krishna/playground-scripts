#!/usr/bin/env python3

def find_user(name):
    users = {"krishna": {"id": 1, "name": "krishna"}}
    return users.get(name)  # a user dict, or None

def find_account(user):
    accounts = {1: {"balance": 500}}
    return accounts.get(user["id"]) # an account dict or None

def get_balance(account):
    return account["balance"]   # a number

def then(value, next_step):
    if value is None:
        return None
    return next_step(value)

if __name__ == "__main__":
    name = "krishna"
    balance = then(then(then(name, find_user), find_account), get_balance)
    assert balance == 500

    name = "nobody"
    balance = then(then(then(name, find_user), find_account), get_balance)
    assert balance is None
