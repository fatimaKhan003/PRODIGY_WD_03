document.addEventListener("DOMContentLoaded", function() {
    const homeScreen = document.getElementById('home-screen');
    const nameEntryScreen = document.getElementById('name-entry-screen');
    const gameScreen = document.getElementById('game-screen');
    const winnerScreen = document.getElementById('winner-screen');
    const modeSelection = document.getElementById('mode-selection');
    const playWithFriendButton = document.getElementById('play-with-friend');
    const playOnlineButton = document.getElementById('play-online');
    const friendNameEntry = document.getElementById('friend-name-entry');
    const onlineNameEntry = document.getElementById('online-name-entry');
    const player1NameInput = document.getElementById('player1-name');
    const player2NameInput = document.getElementById('player2-name');
    const playerNameInput = document.getElementById('player-name');
    const startGameButton = document.getElementById('start-game');
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const restartButton = document.getElementById('restart-button');
    const homeButton = document.getElementById('home-button');
    const exitButton = document.getElementById('exit-button');
    const restartButtonWinner = document.getElementById('restart-button-winner');
    const homeButtonWinner = document.getElementById('home-button-winner');
    const exitButtonWinner = document.getElementById('exit-button-winner');
    const winnerMessage = document.getElementById('winner-message');
    const scoreboard = document.getElementById('scoreboard');

    let player1Name = '';
    let player2Name = '';
    let currentPlayer = 'X';
    let gameBoard = Array(9).fill(null);
    let gameMode = '';
    let scores = {
        player1: 0,
        player2: 0,
        draws: 0,
        onlinePlayer: 0,
        computer: 0
    };
    playWithFriendButton.addEventListener('click', () => {
        gameMode = 'friend';
        homeScreen.style.display = 'none';
        nameEntryScreen.style.display = 'block';
        document.getElementById('name-entry-title').textContent = 'Enter Player Names';
        friendNameEntry.style.display = 'block';
        onlineNameEntry.style.display = 'none';
    });
    
    playOnlineButton.addEventListener('click', () => {
        gameMode = 'online';
        homeScreen.style.display = 'none';
        nameEntryScreen.style.display = 'block';
        document.getElementById('name-entry-title').textContent = 'Enter Player Name';
        friendNameEntry.style.display = 'none';
        onlineNameEntry.style.display = 'block';
    });
    

    startGameButton.addEventListener('click', () => {
        if (gameMode === 'friend') {
            player1Name = player1NameInput.value || 'Player 1';
            player2Name = player2NameInput.value || 'Player 2';
        } else if (gameMode === 'online') {
            player1Name = playerNameInput.value || 'Player';
            player2Name = 'Computer';
        }
        nameEntryScreen.style.display = 'none';
        gameScreen.style.display = 'block';
        updateMessage();
    });

    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    restartButton.addEventListener('click', restartGame);
    restartButtonWinner.addEventListener('click', restartGame);

    homeButton.addEventListener('click', () => {
        location.reload();
    });

    homeButtonWinner.addEventListener('click', () => {
        location.reload();
    });

    exitButton.addEventListener('click', () => {
        if (confirm("Do you want to exit the game?")) {
            window.close();
        }
    });

    exitButtonWinner.addEventListener('click', () => {
        if (confirm("Do you want to exit the game?")) {
            window.close();
        }
    });

    function handleCellClick(event) {
        const cell = event.target;
        const cellIndex = Array.from(cells).indexOf(cell);

        if (gameBoard[cellIndex] || checkWinner(gameBoard)) {
            return;
        }

        gameBoard[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        if (checkWinner(gameBoard)) {
            endGame(false);
        } else if (gameBoard.every(cell => cell)) {
            endGame(true);
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            updateMessage();
            if (gameMode === 'online' && currentPlayer === 'O') {
                setTimeout(computerMove, 500); // Delay for realism
            }
        }
    }

    function computerMove() {
        const bestMove = getBestMove(gameBoard, 'O');
        gameBoard[bestMove] = 'O';
        cells[bestMove].textContent = 'O';
        if (checkWinner(gameBoard)) {
            endGame(false);
        } else if (gameBoard.every(cell => cell)) {
            endGame(true);
        } else {
            currentPlayer = 'X';
            updateMessage();
        }
    }

    function getBestMove(board, player) {
        const opponent = player === 'O' ? 'X' : 'O';
        let bestScore = -Infinity;
        let move = -1;

        for (let i = 0; i < board.length; i++) {
            if (!board[i]) {
                board[i] = player;
                const score = minimax(board, 0, false, player, opponent);
                board[i] = null;
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }

        return move;
    }

    function minimax(board, depth, isMaximizing, player, opponent) {
        const winner = checkWinner(board);
        if (winner === player) return 10 - depth;
        if (winner === opponent) return depth - 10;
        if (board.every(cell => cell)) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = player;
                    const score = minimax(board, depth + 1, false, player, opponent);
                    board[i] = null;
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < board.length; i++) {
                if (!board[i]) {
                    board[i] = opponent;
                    const score = minimax(board, depth + 1, true, player, opponent);
                    board[i] = null;
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function updateMessage() {
        message.textContent = `${currentPlayer === 'X' ? player1Name : player2Name}'s turn (${currentPlayer})`;
    }

    function checkWinner(board) {
        const winningCombinations = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
    
        return null;
    }

    function endGame(draw) {
        if (draw) {
            
            winnerMessage.textContent = 'Oh no! It\'s a Draw! Better luck next time.';
            scores.draws += 1;
        } else {
            let winner = '';
            if (gameMode === 'friend') {
                winner = currentPlayer === 'X' ? player1Name : player2Name;
                if (currentPlayer === 'X') {
                    scores.player1 += 1;
                } else {
                    scores.player2 += 1;
                }
            } else if (gameMode === 'online') {
                winner = currentPlayer === 'X' ? player1Name : 'Computer';
                if (winner === 'Computer') {
                    scores.computer += 1;
                } else {
                    scores.onlinePlayer += 1;
                }
            }
            message.textContent = `${winner} wins!`;
            winnerMessage.textContent = `${winner} wins!`;
        }
        updateScoreboard();
        displayWinnerScreen();
    }
    
    
    
    
    function restartGame() {
        gameBoard.fill(null);
        cells.forEach(cell => cell.textContent = '');
        currentPlayer = 'X';
        message.textContent = `${player1Name}'s turn (X)`;
        gameScreen.style.display = 'block';
        winnerScreen.style.display = 'none';
        updateScoreboard(); // Updating scoreboard after restarting the game
    }

    function displayWinnerScreen() {
        winnerScreen.style.display = 'block';
        gameScreen.style.display = 'none';
        updateScoreboard(); // Added this line to update the scoreboard everytime the game ends
    }
    
    function updateScoreboard() {
        scoreboard.style.display = 'block';
        if (gameMode === 'friend') {
            document.getElementById('scoreboard-friends').style.display = 'block';
            document.getElementById('player1-name-display').textContent = player1Name;
            document.getElementById('player2-name-display').textContent = player2Name;
            document.getElementById('player1-score').textContent = scores.player1;
            document.getElementById('player2-score').textContent = scores.player2;
            document.getElementById('draw-score-friends').textContent = scores.draws;
        } else if (gameMode === 'online') {
            document.getElementById('scoreboard-online').style.display = 'block';
            document.getElementById('online-player-name-display').textContent = player1Name;
            document.getElementById('online-player-score').textContent = scores.onlinePlayer;
            document.getElementById('computer-score').textContent = scores.computer;
            document.getElementById('draw-score-online').textContent = scores.draws;
        }
    }
    


});