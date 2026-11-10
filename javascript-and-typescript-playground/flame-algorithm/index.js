/**
 * Flame Algorithm
 */

// Create a 5x5 grid using 2D array
let originalGrid = [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
];

function printGrid(grid) {
    let row;

    for (row = 0; row < grid.length; row++) {
        console.log(grid[row].join(" "));
        if (row !== 4) {
            console.log("- - - - -")
        }
    }
}

// We need to introduce heat and the fire originates from the bottom
// so we need to initialize the last row with, say 255.
function initializeFire(grid) {
    let row; let col;
    let newGrid = structuredClone(grid);

    for (row = 0; row < grid.length; row++) {
        for (col = 0; col < grid.length; col++) {
            if (row == grid.length -1) {
                newGrid[row][col] = 255;
            }
        }
    }

    return newGrid;
}

// Update the grid with new fire values
function updateFire(grid) {
    let row; let col;
    let nextGrid = structuredClone(grid);

    for (row = 3; row >= 0; row--) {
        for (col = 0; col < grid.length; col++) {
            const bottomLeft = (col !== 0) ? grid[row + 1][col - 1] : 0;
            const bottom = grid[row + 1][col];
            const bottomRight = (col !== grid.length - 1) ? grid[row + 1][col + 1] : 0;
            const average = Math.floor((bottomLeft + bottom + bottomRight) / 3);
            const cooling = Math.floor(Math.random() * 6);
            const newHeat = Math.max(0, average - cooling);

            nextGrid[row][col] = newHeat;
        }
    }

    return nextGrid;
}

function main() {
    let grid = initializeFire(originalGrid);

    const generations = 10;

    for (let i = 0; i < generations; i++) {
        grid = updateFire(grid);
        console.log(`Generation: ${i + 1}`);
        printGrid(grid);
    }
}

main();