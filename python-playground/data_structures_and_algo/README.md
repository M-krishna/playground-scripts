# Data structures and Algorithms
Trying out data structures and algorithms occasionally.

## Quick Sort

## 1. Problem statement
You have a list:
```
[7, 2, 9, 1, 5]
```
What does "sorting" really mean?
> Rearranging so that for every element, everything before it is smaller, and everything after it is larger.

That's it.

### 2. A Key Observation
Instead of trying to sort the whole list at once, ask:
> Can I place **just one element** in its *final correct position?*

Pick any number. Say `5`.

Now split the list into:
* numbers **less than 5**
* numbers **greater than 5**

```
[2, 1] 5 [7, 9]
```

Now look carefully:
* `5` is already in its **final sorted position**
* it will *never move again*

That's the core idea of Quick sort.

### 3. Reduce the problem (recursive insight)
Now you have two smaller problems:
```
Left: [2, 1]
Right: [7, 9]
```
Each of these is the *same problem* as before.

So you repeat:
* pick a pivot
* Split into smaller/larger
* Lock the pivot in place

### 4. The Mental Model
Think of Quick Sort like this:
> "Pick a leader. Everyone smaller goes left, everyone bigger goes right. The leader is now fixed. Repeat for both sides."

That's it.