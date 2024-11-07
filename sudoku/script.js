const board = Array.from({ length: 9 }, () => Array(9).fill(0)); 
let solving = false; 

function createGrid() {
    const gridElement = document.getElementById('sudoku-grid');
    gridElement.innerHTML = ''; 

    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.setAttribute('contenteditable', 'true');
            cell.setAttribute('data-row', row);
            cell.setAttribute('data-col', col);
            cell.addEventListener('input', (e) => {
                const value = e.target.textContent;
                if (value.match(/^[1-9]$/)) {
                    board[row][col] = parseInt(value);
                    e.target.style.color = getRandomColor(); 
                } else {
                    board[row][col] = 0; 
                    e.target.style.color = 'black'; 
                }
            });
            gridElement.appendChild(cell);
        }
    }
}


function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function findEmpty(board) {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                return [i, j];
            }
        }
    }
    return null;
}

function valid(board, num, pos) {
    const [row, col] = pos;

    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) {
            return false;
        }
    }

    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (board[boxRow + i][boxCol + j] === num) {
                return false;
            }
        }
    }

    return true;
}

async function solve(board) {
    const find = findEmpty(board);
    if (!find) return true; 
    const [row, col] = find;

    for (let i = 1; i <= 9; i++) {
        if (valid(board, i, [row, col])) {
            board[row][col] = i;
            updateCell(row, col, i); 

         
            await new Promise(resolve => setTimeout(resolve, 10)); 

            const isSolved = await solve(board);
            if (isSolved) return true;

            
            board[row][col] = 0;
            updateCell(row, col, 0); 
        }
    }
    return false;
}

function updateCell(row, col, value) {
    const cell = document.querySelector(`.cell[data-row='${row}'][data-col='${col}']`);
    if (value !== 0) {
        cell.textContent = value;
        cell.style.color = getRandomColor(); 
        cell.style.backgroundColor = '#a5d6a7'; 
        cell.setAttribute('contenteditable', 'false'); 
    } else {
        cell.textContent = ''; 
        cell.style.backgroundColor = ''; 
        cell.style.color = 'black'; 
    }
}

document.getElementById('solve-button').addEventListener('click', () => {
    const editableCells = document.querySelectorAll('.cell[contenteditable="true"]');
    editableCells.forEach(cell => {
        const row = cell.getAttribute('data-row');
        const col = cell.getAttribute('data-col');
        const value = parseInt(cell.textContent) || 0;
        board[row][col] = value;
    });

    if (!solving) {
        solving = true; 
        solve(board).then(() => {
            solving = false; 
            alert('Solution process completed!');
        });
    }
});

createGrid();
