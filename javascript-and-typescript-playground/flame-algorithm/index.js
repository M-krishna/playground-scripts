/**
 * Flame Algorithm
 */

const canvas = document.getElementById("fire");
const ctx = canvas.getContext("2d");

ctx.fillStyle = "red";
ctx.fillRect(10, 10, 50, 50);

const ROWS = 45;
const COLS = 40;
const CELL_SIZE = 17;

canvas.width = ROWS * CELL_SIZE;
canvas.height = COLS * CELL_SIZE;


const palette = [
    { heat: 0,   color: [0, 0, 0] },       // Black
    { heat: 85,  color: [255, 0, 0] },     // Red
    { heat: 170, color: [255, 255, 0] },   // Yellow
    { heat: 255, color: [255, 255, 255] } // White
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
        for (col = 0; col < grid[row].length; col++) {
            if (row == grid.length -1) {
                newGrid[row][col] = 255;
            }
        }
    }

    return newGrid;
}

// Update the grid with new fire values
function updateFire(grid) {
    let nextGrid = structuredClone(grid);

    const startFrom = ROWS - 2;

    for (let row = startFrom; row >= 0; row--) {
        for (let col = 0; col < grid[row].length; col++) {
            const bottomLeft = (col !== 0) ? grid[row + 1][col - 1] : 0;
            const bottom = grid[row + 1][col];
            const bottomRight = (col !== grid[row].length - 1) ? grid[row + 1][col + 1] : 0;

            const average = Math.floor((bottomLeft + bottom + bottomRight) / 3);
            const cooling = Math.floor(Math.random() * 6);
            const newHeat = Math.max(0, average - cooling);

            nextGrid[row][col] = newHeat;
        }
    }

    return nextGrid;
}

/**
 * 
 * @param {number} start - The starting value of a color 
 * @param {number} end  - The ending value of a color
 * @param {number} t - Linear interpolation value
 */
function interpolate(start, end, t) {
    return start + (t * (end - start)); 
}

function getColor(currentHeat) {
    for (let i = 0; i < palette.length - 1; i++) {
        const startHeat = palette[i].heat;
        const endHeat = palette[i + 1].heat;

        if (startHeat <= currentHeat && currentHeat <= endHeat) {
            const startColor = palette[i].color;
            const endColor = palette[i + 1].color;

            const t = (currentHeat - startHeat) / (endHeat - startHeat);

            const red = Math.round(interpolate(startColor[0], endColor[0], t));
            const green = Math.round(interpolate(startColor[1], endColor[1], t));
            const blue = Math.round(interpolate(startColor[2], endColor[2], t));

            return [red, green, blue];
        }
    }
}

function createGrid(rows, cols) {
    return new Array(rows).fill(null).map(() => {
        return new Array(cols).fill(0);
    });
}

function drawFrame(grid) {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const heat = grid[row][col];
            const rgb = getColor(heat);

            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;

            ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
            ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
        }
    }
}

let grid = initializeFire(createGrid(ROWS, COLS));

function animate() {
    grid = updateFire(grid);

    drawFrame(grid);
    requestAnimationFrame(animate);
}

function main() {
    animate(); 
}

main();