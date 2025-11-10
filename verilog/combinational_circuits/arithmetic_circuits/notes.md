# Arithmetic Circuits
Now use those logic gates to perform arithmetic operations.

* Half Adder
* Full Adder
* Half Subtractor
* Full Subtractor

* **Goal:** Build each and test using truth tables
* **Do:** Combine multiple 1-bit full adders to make a 4-bit or 8-bit adder (ripple-carry)

## What is a Half Adder?
A Half Adder is a simple combinational logic circuit that performs the **addition of two single-bit binary** numbers (A and B)

**Inputs:**
* A
* B

**Outputs:**
* **Sum(S):** gives the result bit of addition
* **Carry(C):** gives the carry generated from addition

### Truth Table
| A | B | Sum | Carry |
|---|---|-----|-------|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 0 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 1 |

If we look at the truth table, we can see that the **Sum** column resembles the **XOR** gate output and the **Carry** column resembles the **AND** gate output.

## What is a Full Adder?
A **Full Adder** is a combinational circuit that adds **three one-bit binary numbers: two input bits (A and B) and a carry-in (cin) from a previous addition.

**Inputs:**
* A
* B
* Cin (carry input)

**Outputs:**
* Sum(S) - final sum bit
* Carry(Cout) - final carry bit

### Truth Table
| A | B | Cin | Sum | Cout |
|---|---|-----|-----|------|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 0 |
| 0 | 1 | 0 | 1 | 0 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 1 |
| 1 | 1 | 0 | 0 | 1 |
| 1 | 1 | 1 | 1 | 1 |

**NOTE:** Here the input (Cin) represents the state. So each row is just showing a representation of what happens when Cin is 0 or 1. In a real multi-bit adder, Cin connects to the carry output of the adder handling the previous bit.

If we take a look at the truth table, the **Sum** column (first 4 rows) resembles the output of the **Half Adder**. The last 4 rows of the **Sum** column is the inverse of it.

The first 4 rows of **Cout** column resembles the output of an **AND** gate. And the last 4 columns of **Cout** resembles the output of the **OR** gate.

### Full-Adder can be constructed using 2 Half-Adder and 1 OR gate

**Step 1: Inputs**
* A
* B
* Cin (carry-in)

**Step 2: First Half Adder**
* Adds A and B
* Outputs:
    * Sum1 = A xor B
    * Carry1 = A and B

**Step 3: Second Half Adder**
* Adds the Sum1 (from step 2) with Cin
* Outputs:
    * Sum = Sum1 xor Cin = A xor B xor Cin
    * Carry2 = Sum1 and Cin = (A xor B) and Cin

**Step 4: Final Carry**
* Combine both carries:
    * Cout = Carry1 or Carry2 = (A and B) or ((A xor B) and Cin)

## What is a Half Subtractor?
A Half Subtractor is a combinational/arithmetic logical circuit that performs the subtraction of two single-bit binary numbers, A and B.

It calculates: **Difference = A - B**

and outputs:
* **Difference(D)** - the result of the subtraction
* **Borrow(B_out)** - indicates if a 1 needs to be borrowed from the next higher bit

### Inputs and Outputs
| Signal | Meaning |
|--------|---------|
| A | Minuend (the number to be subtracted from) |
| B | Subtrahend (the number being subtracted) |
| D | Difference output |
| B_out | Borrow output |

### Truth Table
| A | B | Difference (D) | Borrow (B_out) |
|---|---|----------------|----------------|
| 0 | 0 | 0 | 0 |
| 0 | 1 | 1 | 1 |
| 1 | 0 | 1 | 0 |
| 1 | 1 | 0 | 0 |

### Logic Equations
From the truth table:
* Difference = `A xor B`
* Borrow = `(~A) and B`

## What is Full Subtractor?
A Full Subtractor is a combinational logic circuit that performs subtraction on **three one-bit binary numbers**:
* the **minuend(A)**
* the **subtrahend(B)**
* the **borrow-in(Bin)** - the borrow from the previous(less significant) subtraction.

It gives two outputs:
* **Difference(D)** - the result of **A - B - Bin**
* **Borrow-out(Bout)** - the borrow output to the next stage

### Truth Table
| A | B | Bin | D | Bout |
|---|---|-----|---|------|
| 0 | 0 | 0 | 0 | 0 |
| 0 | 0 | 1 | 1 | 1 |
| 0 | 1 | 0 | 1 | 1 |
| 0 | 1 | 1 | 0 | 1 |
| 1 | 0 | 0 | 1 | 0 |
| 1 | 0 | 1 | 0 | 0 |
| 1 | 1 | 0 | 0 | 0 |
| 1 | 1 | 1 | 1 | 1 |

### Logic Equations
From the truth table:
* We have to use 2 Half subtractor
* One OR gate

Just like how we build Full Adder.

### Circuit Explanation
1. Step 1: First Half Subtractor
    * Subtracts B from A
        * -> produces **Difference1** and **Borrow1**

2. Step 2: Second Half Subtractor
    * Subtracts **Bin** from **Difference1**
        * -> produces **Difference** and **Borrow2**

3. Combine Borrows
    * `Bout = Borrow1 + Borrow2`