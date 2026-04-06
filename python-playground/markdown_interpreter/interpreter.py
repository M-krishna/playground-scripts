#!/usr/bin/env python3

from __future__ import annotations

########## BLOCK LEVEL NODES FOR AST ##############

########## END OF BLOCK LEVEL NODES FOR AST ##############


########## START OF INLINE LEVEL NODES FOR AST ###########
########## END OF INLINE LEVEL NODES FOR AST #############

def parse_blocks(line: str):
    if line.startswith('#'):
        print('heading')
    elif line.strip() == '':
        print('empty line')
    else:
        print('paragraph')

if __name__ == "__main__":
    markdown = """
# heading 1

Hey hello, **how are you?**

## heading 2
*I mean* **it's alright like**

### heading 3
    """

    lines = markdown.strip().split('\n')

    for line in lines:
        parse_blocks(line)