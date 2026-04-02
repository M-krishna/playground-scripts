# Problem statement
Build a markdown parser that takes a raw Markdown string as input and produces an AST (Abstract Syntax Tree), which can then be walked to render HTML (or any other output format)

The parser should handle:
1. **Block Parsing** - Scan lines to identify block-level structure
2. **Inline Parsing** - Within each block's text content, scan characters to identify inline formatting.
3. **AST construction** - Represent the document as a tree of nodes
4. **Rendering** - Walk the AST to produce output (HTML, plain text, etc)

## How the Block Parser Works (Line-by-Line FSM)
The block parser is best modeled as a **Finite State Machine**. Each line causes a state transition.

## How the Inline Parser Works (Char-by-Char)
Once you have a paragraph or heading's raw text, you run a character-level scanner on it -- much like a traditional lexer.

## A Practical Approach to Build This
A good incremental order to implement things:
1. **Start with the AST node types** - define your data structure first (`HeadingNode`, `ParagraphNode`, `BoldNode`, etc)
2. **Build the block parser** - handle headings, paragraphs, and blank lines first; add lists, blockquotes, and code blocks incrementally
3. **Build the inline parser** - start with bold/italic, then add links, inline code, etc.
4. **Build a simple HTML renderer** - walk the AST and emit tags; this validates your AST design


### AST Nodes
Claude gave an example where the nodes `Bold` and `Italic` takes in array of `Text`. For example, the nodes Claude gave looks like:
```
Bold([Text("world")])
Text(" and " )
Italic([Text("you)])
```

Here you can see, the `Bold` and `Italic` nodes takes in an array instead of just `Text` node. I asked why nodes are like that, and below is the explanation it gave.

**Explanation:**

The reason `Bold` and `Italic` take an array of children instead of just a single string is because of **nesting**.

**The Problem with `Bold(string)`***

Consider this markdown:
```
**Hello _world_ again**
```

If `Bold` only held a plain string, you'd have no way to represent this. The content inside the bold isn't just text - it's a **mix of text and another inline node**:
```
Bold([
    Text("Hello ),
    Italic([Text("world")]),
    Text(" again")
])
```
This is the core reason: **inline elements can contain other inline elements**

**Another Example - Links**

```
[Click **here** to visit](https://example.com)
```
The link's label isn't just a string, it contains bold text:
```
Link(
    href: "https://example.com",
    children: [
        Text("Click "),
        Bold([Text("here")]),
        Text(" to visit")
    ]
)
```
If `Link` only stored a plain string label, you'd lose the bold formatting inside it.

### The General Rule
> Any node that **wraps content** (rather than *being* content) should hold an array of children, because you can never know in advance what's inside it. 

The only nodes that don't need children are **leaf nodes** - nodes that *are* the content themselves, with nothing further to parse inside them. For example:
* `Text("hello")` - just a string, nothing nested inside
* `CodeSpan("x + y")` - raw code, intentionally unparsed
* `Image(src, alt)` - terminal node, no children

Everything else - `Bold`, `Italic`, `Link`, `Blockquote`, `ListItem`, `Document` - holds an array of children, because their contents can be arbitrarily rich.

### So Your AST is Uniformly Recursive
This is exactly the same principle as in compiler ASTs. A node like `IfStatement` in a language AST holds a `body` array of child statements, not a single fixed child. Same idea here - the tree is **recursively structures all the way down**, and `Text` is the base case where the recursion stops. 