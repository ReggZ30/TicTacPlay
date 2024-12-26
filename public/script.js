let currentBoard = Array(9).fill('');
let gameActive = true;
const playerSymbol = localStorage.getItem('playerSymbol') || 'X';
const aiSymbol = playerSymbol === 'X' ? 'O' : 'X';
const difficulty = localStorage.getItem('difficulty') || 'easy';

// Debug logs
console.log('Game initialized with:', {
    playerSymbol,
    aiSymbol,
    difficulty
});

document.querySelectorAll('.cell').forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

function handleCellClick(e) {
    const index = parseInt(e.target.dataset.index);
    
    if (currentBoard[index] === '' && gameActive) {
        console.log('Player clicked cell:', index);
        makeMove(index, playerSymbol);
        
        if (!checkGameEnd() && !isBoardFull()) {
            console.log('AI is thinking...');
            setTimeout(aiMove, 500); 
        }
    }
}

function aiMove() {
    if (!gameActive) return;
    
    const availableMoves = currentBoard.map((cell, index) => 
        cell === '' ? index : null).filter(val => val !== null);
        
    if (availableMoves.length === 0) return;
    
    const nextMove = getAIMove(availableMoves);
    console.log('AI selected move:', nextMove);
    makeMove(nextMove, aiSymbol);
}

function getAIMove(availableMoves) {
    if (difficulty === 'easy') {
        return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    } else if (difficulty === 'medium') {
        if (Math.random() < 0.5) {
            return getBestMove();
        } else {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
    } else {
        return getBestMove();
    }
}

function getBestMove() {
    let bestScore = -Infinity;
    let bestMove;
    
    for (let i = 0; i < 9; i++) {
        if (currentBoard[i] === '') {
            currentBoard[i] = aiSymbol;
            let score = minimax(currentBoard, 0, false);
            currentBoard[i] = '';
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    
    return bestMove;
}

function minimax(board, depth, isMaximizing) {
    // Check terminal states first
    const result = checkWinner(board);
    
    if (result === aiSymbol) return 10 - depth;
    if (result === playerSymbol) return depth - 10;
    if (isBoardFull(board)) return 0;
    
    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = aiSymbol;
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = playerSymbol;
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner(board = currentBoard) {
    const winCombos = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (let combo of winCombos) {
        if (board[combo[0]] &&
            board[combo[0]] === board[combo[1]] &&
            board[combo[0]] === board[combo[2]]) {
            return board[combo[0]]; // Return the winning symbol
        }
    }
    
    return null; // No winner
}

function checkGameEnd() {
    const winner = checkWinner();
    if (winner) {
        gameActive = false;
        setTimeout(() => {
            showNotification(`${winner} Menang!`);
        }, 100);
        return true;
    }

    if (isBoardFull()) {
        gameActive = false;
        setTimeout(() => {
            showNotification("Permainan Seri!");
        }, 100);
        return true;
    }

    return false;
}

function makeMove(index, symbol) {
    if (index !== undefined && gameActive && currentBoard[index] === '') {
        console.log('Making move:', { index, symbol });
        currentBoard[index] = symbol;
        const cell = document.querySelector(`[data-index="${index}"]`);
        if (cell) {
            cell.textContent = symbol;
            cell.classList.add(symbol.toLowerCase());
        }
        saveGameState();
        checkGameEnd();
    }
}

function isBoardFull(board = currentBoard) {
    return board.every(cell => cell !== '');
}

function resetGame() {
    console.log('Resetting game...');
    currentBoard = Array(9).fill('');
    gameActive = true;
    
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o');
    });
    
    closeNotification();
    
    // AI starts if X is AI
    if (aiSymbol === 'X') {
        setTimeout(aiMove, 300);
    }
}

function showNotification(message) {
    const overlay = document.getElementById('notification-overlay');
    const notificationText = document.getElementById('notification-text');
    if (overlay && notificationText) {
        notificationText.textContent = message;
        overlay.classList.remove('hidden');
    }
}

function closeNotification() {
    const overlay = document.getElementById('notification-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

function saveGameState() {
    localStorage.setItem('ticTacToeBoard', JSON.stringify(currentBoard));
    localStorage.setItem('gameActive', gameActive);
}

function loadGameState() {
    const savedBoard = localStorage.getItem('ticTacToeBoard');
    if (savedBoard) {
        currentBoard = JSON.parse(savedBoard);
    }
    const savedGameActive = localStorage.getItem('gameActive');
    if (savedGameActive !== null) {
        gameActive = savedGameActive === 'true';
    }
    renderBoard();
}

function renderBoard() {
    document.querySelectorAll('.cell').forEach((cell, index) => {
        const symbol = currentBoard[index];
        cell.textContent = symbol;
        cell.classList.remove('x', 'o');
        if (symbol) {
            cell.classList.add(symbol.toLowerCase());
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('Page loaded');
    loadGameState();

    if (aiSymbol === 'X' && gameActive) {
        setTimeout(aiMove, 300);
    }
});