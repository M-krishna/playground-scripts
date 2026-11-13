// Initialize canvas
const canvas = document.getElementById("grid");
const resetBtn = document.getElementById("reset");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// We want each cell to be 20x20 pixels
const CELL_SIZE = 15;

// Calculate no. of rows and columns that can accomodate a 20x20 pixel
const rows = Math.floor((canvas.height / CELL_SIZE));
const cols = Math.floor((canvas.width / CELL_SIZE));

// Draw the grid on the canvas
// using ctx.strokeRect(x, y, width, height)
for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
        // calculate the x and y coordinates to draw the cell
        const x = col * CELL_SIZE;
        const y = row * CELL_SIZE;
        ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
    }
}

function createGrid() {
    return new Array(rows).fill(null).map(() => {
        return new Array(cols).fill(0);
    });
}

let grid = createGrid();

// Draw the latest state of the grid inside the canvas
function drawGrid() {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            const cell = grid[row][col];

            // make the active cell red
            if (cell === 1) {
                ctx.fillStyle = "red";
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            }

            if (cell === 0) {
                ctx.fillStyle = "white";
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            }

            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
        }
    }
}

// Add event listener for mouse click
canvas.addEventListener("click", (event) => {
    // convert coordinates (x, y) to (row, col)
    const col = Math.floor(event.offsetX / CELL_SIZE);
    const row = Math.floor(event.offsetY / CELL_SIZE);

    // make the cell active
    if (grid[row][col] == 0) {
        grid[row][col] = 1;
    } 

    // re-render the grid everytime when we click
    drawGrid();
});

canvas.addEventListener("pointermove", (event) => {
    // start the tracking only when the cursor is pressed
    if (event.buttons === 1) {
        const col = Math.floor(event.offsetX / CELL_SIZE);
        const row = Math.floor(event.offsetY / CELL_SIZE);

        if (grid[row][col] === 0) {
            grid[row][col] = 1;
        } 

        drawGrid();
    }
});

resetBtn.addEventListener("click", (event) => {
    grid = createGrid();
    drawGrid();
});