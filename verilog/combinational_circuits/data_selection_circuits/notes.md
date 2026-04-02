# Data Selection Circuits
* Multiplexers
* Demultiplexers

## What is a Multiplexer?
A Multiplexer (MUX) is a combinational circuit that **selects one input from multiple inputs** and routes it to a single output line.

You can think of it as a **digit selector** or a **data router**

### 2:1 Multiplexer Overview
A 2:1 MUX has:
* 2 data inputs: `I0`, `I1`
* 1 select input: `S`
* 1 output: `Y`

It works like this:
* When `S = 0`, the output `Y` is `I0`
* When `S = 1`, the output `Y` is `I1`

### Truth Table
| Select (S) | I0 | I1 | Output(Y) |
|------------|----|----|-----------|
| 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 0 |
| 0 | 1 | 0 | 1 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 0 | 0 |
| 1 | 0 | 1 | 1 |
| 1 | 1 | 0 | 0 |
| 1 | 1 | 1 | 1 |

### Logic Expression
From the MUX behavior: `Y = ((~S) . I0) + (S . I1)`