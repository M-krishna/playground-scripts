### 1. Representing fire as a 2D heat grid
Instead of drawing fire directly, we simulate it using a two-dimentional grid of numbers.

Each cell represents a small region of the fire, and its value represents the heat intensity at the location.

## Heat values
For our implementation, we'll use values in the range 0-255:
* 0 represents no heat (cold).
* 255 represents maximum heat.
* values between 0 and 255 represent different heat intensities.

## Grid representation
We will represent the fire using a 2D array:
```javascript
const grid = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [255, 255, 255, 255, 255],
];
```
In this example:
* Each inner array represents a row.
* Each number represents the heat at a particular cell.
* The bottom row is initialised to 255, representing the fire's heat source.
* The remaining cells start at 0.

## Why does the heat source start at the bottom?
Fire originates from its heat source, which we model at the bottom of the grid.

Heat propagates upwards from this source. As it propogates, its intense is reduced by a cooling mechanism.

The bottom row acts as a continuous source of maximum heat.

## Accessing cells
We use `grid[row][column]` to access a cell.
```javascript
grid[4][2];     // 255
```
JavaScript arrays are zero-indexed, so the first row and first column have index 0.

## Coordinate convention
We use:
* y (row) to identify the vertical position.
* x (column) to identify the horizontal position.

Therefore, a cell can be accessed as:
```javascript
grid[y][x];
```
**Key idea:** The grid represents the state of the fire. At this stage, it contains only heat values, not colours or pixels.

**Question:** Why do you think we initialize the *bottom row* with maximum heat instead of initialising the entire grid with 255.

**Answer:** That's because heat starts from bottom. As it goes up, it becomes weak.

# 2. Heat propagation
Now let's think about how heat travels. Imagine this small grid:
```
0   0   0   0   0
0   0   0   0   0
0   0   0   0   0
0   0  255  0   0
0   0  255  0   0
```
Look at the cell directly above the bottom heat source.

**Question:** If heat propagates upwards, which cell should influence the heat value of that cell?

**Answer:** Bottom left, bottom, bottom-right cells.

To calculate the heat of a cell, we look at its three neighbouring cells in the row below it:
1. Bottom-left
2. Bottom
3. Bottom-right

## Neighbour positions
For a cell at `grid[row][col]`, the neighbouring cells are:
```javascript
grid[row + 1][col - 1];     // Bottom-left
grid[row + 1][col];         // Bottom
grid[row + 1][col + 1];     // Bottom-right
```
The values from these neighbours influence the heat of the current cell.

**Key idea:** Each cell gets its heat from the three cells immediately below it. This allows heat to propagate upwards through the grid.

Consider a cell at the leftmost column. Its bottom-left neighbour doesn't exist because it would be outside the grid.

**Question:** What should happen when one of the three neighbouring cells is outside the grid?

**Answer:** We should take it as 0. The value of that specific neighbour should be 0 (meaning, we don't consider it).

This is called **boundary-handling** -- deciding how to handle cells that fall outside the grid.

**One subtle detail:** in our current implementation, even if a neighbour is outside the grid, we still divide the sum by 3, because we're averaging three neighbour positions, treating missing positions as zero. For example, suppose the three neighbour values are: `0, 100, 200`. The average is:
```
(0 + 100 + 200) / 3 = 100
```

## Boundary handling
At the edges of the grid, some neighbouring positions may fall outside the grid. We treat these missing neighbours as having a heat value of 0. For example, if a cell is at the leftmost column, its bottom-left neighbour is outside the grid and contributes 0.

## Averaging neighbours
We calculate the average of the three neighbour values:
```
average = (left + bottom + right) / 3
```
Even when a neighbour is outside the grid, we use 0 for that position and keep the divisor as 3. Example:
```
(0 + 100 + 200) / 3 = 100
```
**Key idea:** Each cell gets its heat value from the three cells immediately below it. Missing neighbours contribute zero heat.

# 3. Cooling
Now we have a way to propagate heat upward. But if we only average neighbouring values, heat would spread without the gradual loss of intensity that gives fire its appearance.

We introduce a cooling factor. Think of it this way:
* Neighbour average: 150
* Cooling: 4
* Resulting heat: 146

**Question:** If we want the fire to look irregular and natural rather than perfectly uniform, should the cooling value be constant for every cell, or should it vary randomly? why?

**Answer:** No it should not be constant. The cooling value must be random otherwise our fire would look more or less in the same shape.

## Controlled Randomness
Heat loses intensity as it propagates upward. We simulate this using a cooling value.

## Why introduce cooling?
Without cooling, heat would propagate without gradually losing intesity. Cooling reduces the heat value calculated from the neighbouring cells.

## Why should cooling be random?
If every cell loses exactly the same amount of heat, the fire tends to look uniform and predictable. Instead, we introduce randomness so that different cells cool at different rates.

This creates irregular heat patterns and makes the fire look more natural.

## Cooling range
For our implementation, we generate a random integer between 0 and 5, inclusive.
```javascript
const cooling = Math.floor(Math.random() * 6);
```
Understanding the expression:
* `Math.random()` generates a floating-point number greater than or equal to 0 and less than 1.
* Multiplying by 6 produces a number 0 (inclusive) to 6 (exclusive).
* `Math.floor()` rounds it down to an integer. 

Possible values: 0, 1, 2, 3, 4, 5.

## Heat calculation
We combine neighbour averaging and cooling:
```javascript
const newHeat = Math.max(0, average - cooling); 
```
We use `Math.max(0, ...)` to ensure heat never becomes negative.

**Key idea:** Random cooling introduces variation into the simulation, producing the irregular appearance of fire.

**Question:** Suppose the average heat from the neighbours is `2`, and the random cooling value is `5`. The calculation gives `-3`. Why do we allow `Math.max(0, ...)` here instead of allowing the heat to become negative.

**Answer:** There is no point in letting the heat become negative. Since we know that 0 means no heat at all, there is no point in going below 0. It doesn't make any sense.

## Clamping heat values
Clamping means restricting a value to a permitted range. We use `Math.max(0, ...)` to ensure heat never becomes negative. For example:
```
max(0, 2 - 5) = 0
```
A heat value of 0 represents no heat. Negative heat has no meaning in our simulation.

**Key idea:** Random cooling introduces variation into the simulation, while clamping ensures heat stays within its valid range.

# 4. Updating the grid (generations)
Before we discuss the next concept, think about this:

We calculate the new heat for every cell in the grid.

Suppose we update the first cell and immediately write its new value into the original grid. Then we move to the next cell.

**Question:** What potential problem could this create when the next cell reads its neighbouring values?

**Answer:** We can't right away update the cell because the next cell calculation will read the newly written value instead of the old value that was part of the original grid. This makes the heat calculation wrong and our flame might look super weird and small.

For example:
1. We calculate cell A and update it.
2. We move to cell B.
3. Cell B reads cell A as one of its neighbours.
4. But cell A now contain its *new* heat value, not its heat value from the previous generation.

That means we're mixing two different generations of heat values in a single update.

## Double buffering
The solution is to maintain two grids:
* **Current grid**: Contains the existing generation. We only read from it.
* **Next grid**: Receives the calculated heat values for the next generation. We only write to it.

Once every cell has been calculated, the next grid becomes the current grid. This technique is called **double buffering**.

### JavaScript considerations
Assigning one array variable to another does not create a copy:
```javascript
let currentGrid = grid;
```
Both variables reference the same array. We need a separate grid, for example by using:
```javascript
const nextGrid = structuredClone(grid);
```
This creates an independent copy of the nested arrays.

## One important distinction
I mentioned that the flame might become small. That can happen, but the deeper issue is **order-dependent updates**. Double buffering makes the simulation deterministic with respect to traversal order, assuming the same random cooling values.

# 5. Generations and simulation loop
Let's understand one more concept before moving into colour mapping. A **generation** represents one complete update of the heat grid. For example:
* Generation 0: Initial heat distribution
* Generation 1: Every cell has been updated once.
* Generation 2: Every cell has been updated twice.
* Generation 3: Every cell has been updated three times.

Each generation moves the heat simulation one step forward.

**Question:** If we want the fire to keep burning and evolving, why do we need to repeatedly call `updateFire()` instead of calling it just once?

**Answer:** Because `updateFire()` function is the one which keeps updating the individual cells. Without updating the heat values, the fire won't evolve and keep burning. It just stays at the same value.

# 6. Mapping heat values to colours
So far, our grid contains numbers represent heat intensity. But we eventually want to display those numbers as coloured pixels. We need a way to translate: **Heat value -> RGB colour**. First lets understand RGB.

## Concept 1 - RGB colour representation
A colour on a computer screen is represented using three components:
* **R**: Red intensity
* **G**: Green intensity
* **B**: Blue intensity

Each component has a value between `0` and `255`. For example:
| Colour | RGB |
|--------|-----|
| Black | (0, 0, 0) |
| Red | (255, 0, 0) |
| Green | (0, 255, 0) |
| Blue | (0, 0, 255) |
| Yellow | (255, 255, 0) |
| White | (255, 255, 255) |

Think of RGB as three independent light sources. Changing their intensities produces different colours.

Let's reason about this. We want to transition from red to yellow.
* Red = (255, 0, 0)
* Yellow = (255, 255, 0)

What happens to each of the three RGB components during this transition? Specifically:
1. Does red increase, decrease, or stay constant?
2. Does green increase, decrease, or stay constant?
3. Does blue increase, decrease, or stay constant?

**Answer:**
* When transitioning from red to yellow, R stays constant, G increases, and B stays constant.

**Key idea:** A colour transition can be created by gradually changing the individual RGB components.

## Concept 2 - Why do we need interpolation?
Imagine we have two endpoints:
* Starting colour: Red (255, 0, 0)
* Ending colour: Yellow (255, 255, 0)

We know the green component must move from `0` to `255`. But how do we calculate the green value for an intermediate heat value? We need a mathematical technique called **linear interpolation**, commonly shortened to *lerp*. Before introducing the formula, let's work through a small example.

Suppose the heat range is `100` to `200`.
* Heat `100` should produce red.
* Head `200` should produce yellow.
* Heat `150` is exactly halfway between them.

**Question:** If heat `150` is halfway between red and yellow, what should its RGB colour be?

To find the answer, we have to use a mathematical concept called **Linear interpolation**.

## Linear Interpolation (Lerp)
Linear interpolation is a technique used to calculate an intermediate value between two known endpoints. We use it to calculate intermediate RGB values during a colour transition.

### Step 1: Calculate the interpolation factor
```
t = (currentHeat - startHeat) / (endHeat - startHeat)
```
The interpolation factor `t` represents how far we've progressed from the starting heat value to the ending heat value.
* t = 0: At the starting point.
* t = 0.5: Halfway between the endpoints.
* t = 1: At the ending point.

### Step 2: Apply the interpolation factor to a colour component
```
color = startcolor + t(endColor - startColor)
```
This calculates the intermediate color component using the same progress factor.

**Example: Red to Yellow** 
Heat range:
* Starting heat: 100
* Ending heat: 200
* Current heat: 150

Starting color: (255, 0, 0)
Ending color: (255, 255, 0)

First calculate the interpolation factor:
```
t = (150 - 100) / (200 - 100)
t = 50 / 100
t = 0.5
```
Next, calculate the green component:
```
G = 0 + 0.5(255 - 0)
G = 0 + 0.5(255)
G = 127.5
```
Red and blue remain unchanged. Result: `RGB(255, 127.5, 0)`. Rounded to integer values: `RGB(255, 128, 0)` 

**Key idea:** First calculate the progress through the heat range. Then use that same progress to calculate the intermediate colour component.

**Next exercise:** Let's test whether the idea has clicked. Suppose:
* Starting heat = 100
* Ending heat = 200
* Current heat = 175
* Green transitions from 0 to 255

What is:
1. The interpolation factor `t`?
2. The resulting green component?

**Solution:**
```
t = (175 - 100) / (200 - 100)
t = 75 / 100
t = 0.75

G = 0 + 0.75(255 - 0)
G = 0 + 0.75(255)
G = 191.25

Therefore, RGB(255, 191, 0)
```

### One more concept: Interpolating all RGB components
So far, we've only interpolated the green component because red and blue remain constant during our red-to-yellow transition. But imagine transitioning from black to white:
* Black: `(0, 0, 0)`
* White: `(255, 255, 255)`

All three components must change.

**Question:** If we're halfway through this transition (`t = 0.5`), what would the resulting RGB colour be? Try calculating R, G, and B independently.

**Solution:**
```
t = 0.5

R = 0 + 0.5(255 - 0)
R = 0 + 0.5(255)
R = 127.5

G = 0 + 0.5(255 - 0)
G = 0 + 0.5(255)
G = 127.5

B = 0 + 0.5(255 - 0)
B = 0 + 0.5(255)
B = 127.5

(R, G, B) = (128, 128, 128)
```

### Next exercise
We're transitioning from black `(0, 0, 0)` to white `(255, 255, 255)`. What would the RGB colour be when `t = 0.25`?
```
t = 0.25

R = 0 + 0.25(255 - 0)
R = 63.75

G = 0 + 0.25(255 - 0)
G = 63.75

B = 0 + 0.25(255 - 0)
B = 63.75

(R, G, B) = (64, 64, 64)
```