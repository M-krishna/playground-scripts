#!/usr/bin/env python3

players = {}
next_id = 1

def problem_statement():

    # Not a pure function (it is tangled with core function and shell function)
    def register_player(name):
        global next_id
        player = {"id": next_id, "name": name, "score": 0}
        players[name] = player
        next_id = next_id + 1
        print(f"Welcome {name}! You are player #{player['id']}")
        return player
    
    register_player("krishna")


# Only the core function, not effects included
def pure_function():

    def compute_next_id(next_id):
        return next_id + 1
    
    def create_player(name, player_id):
        return {"id": player_id, "name": name, "score": 0}
    
    def register_player_core(name, next_id):
        player = create_player(name, next_id)
        new_next_id = compute_next_id(next_id)
        return (player, new_next_id)
    
    p1, n1 = register_player_core("krishna", 1)
    assert p1 == {"id": 1, "name": "krishna", "score": 0}
    assert n1 == 2

    p2, n2 = register_player_core("krishna", 1)
    assert p2 == p1
    assert n2 == n1

def pure_function_plus_effects_included():

    def compute_next_id(next_id):
        return next_id + 1
    
    def create_player(name, player_id):
        return {"id": player_id, "name": name, "score": 0}

    def register_player_core(name, next_id):
        player = create_player(name, next_id)
        new_next_id = compute_next_id(next_id)
        return (player, new_next_id)
    
    def register_player(name):
        global next_id
        player, new_next_id = register_player_core(name, next_id)
        players[name] = player
        next_id = new_next_id
        print(f"Welcome {name}! You are player #{player['id']}")
        return player
    
    p1 = register_player("krishna")
    assert p1 == {"id": 1, "name": "krishna", "score": 0}
    assert next_id == 2

    p2 = register_player("Cheeks")
    assert p2 == {"id": 2, "name": "krishna", "score": 0}
    assert next_id == 3

if __name__ == "__main__":
    # problem_statement()
    # pure_function()
    pure_function_plus_effects_included()