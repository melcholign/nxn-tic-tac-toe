/**
 * Creates a n x n tic-tac-toe GameBoard
 * 
 * @param {int} n - width and height of the GameBoard
 * @returns {Object} - GameBoard object
 */
function createGameBoard(n) {

    const board = [];

    for (let i = 0; i < n; ++i) {

        board[i] = [];

        for (let j = 0; j < n; ++j) {

            board[i].push(-1);
        }
    }

    /**
     * Display the board one row at a time
     */
    const display = () => {

        for (let i = 0; i < n; ++i) {

            console.log(board[i]);
        }
    }

    /**
     * Sets mark at board location of the board
     * 
     * @param {int} row - board's row index
     * @param {int} col - board's column index
     * @param {Boolean} forPlayerOne - differentiator between the two mark types
     * 
     * @throws an error if the board is already marked at the specified location
     */
    const setMarkAt = (row, col, forPlayerOne) => {

        if (board[row][col] != -1) {

            throw Error(`Board is already marked as ${board[row][col]} at (${row}, ${col}).`);
        }

        board[row][col] = forPlayerOne ? 1 : 0;
    }

    /**
     * Returns the mark at board location
     * 
     * @param {int} row - board's row index 
     * @param {int} col - board's column index
     * @returns {int} - 0 or 1 represents marked state, -1 represents unmarked state.
     */
    const getMarkFrom = (row, col) => board[row, col];

    return { setMarkAt, getMarkFrom, display };
};

const GAME_STATES = {
    WIN: 0,
    DRAW: 1,
    ONGOING: 2,
}

/**
 * Creates the GameController for tic-tac-toe on a n x n GameBoard
 * 
 * @param {int} n - size of GameBoard 
 * @returns {Object} - GameController Object
 */
function createGameController(n) {

    const gameBoard = createGameBoard(n);

    // contains the sum of each n-celled linear section that is used in the win condition
    let rowSums = Array(n).fill(0);
    let colSums = Array(n).fill(0);
    let mainDiagonalSum = 0;
    let crossDiagonalSum = 0;

    let currentGameState = { state: GAME_STATES.ONGOING, winningSet: null };

    let playerOneActive = false;

    let round = 0;

    /**
     * Plays a round of the game
     * 
     * @param {int} row - row index of board
     * @param {int} col - column index of board
     * @returns {Object} - the current state of the game
     */
    const playRound = (row, col) => {
        // if game has already ended in a win or a draw, return the final game state
        if (currentGameState.state === GAME_STATES.WIN || currentGameState.state === GAME_STATES.DRAW) {
            return cloneGameState();
        }

        // switch between players
        playerOneActive = !playerOneActive;
        round++;

        try {

            gameBoard.setMarkAt(row, col, playerOneActive);

        } catch (error) {

            console.error(error);

            playerOneActive = !playerOneActive;

            return cloneGameState();
        }

        incrementSums(row, col);

        if (round === n * n) {
            currentGameState.state = GAME_STATES.DRAW;
        }

        if (round >= n * 2 - 1) {
            const winningSet = calculateWinningSet(row, col);

            if (winningSet) {

                state = GAME_STATES.WIN;
                currentGameState.winningSet = winningSet;
            }
        }

        gameBoard.display();

        return cloneGameState();
    }

    /**
     * Increments sum of the linear section based on the value of most recent
     * coinciding mark of the active player
     * 
     * @param {int} row 
     * @param {int} col 
     */
    const incrementSums = (row, col) => {
        const increment = playerOneActive ? 1 : -1;

        rowSums[row] += increment;
        colSums[col] += increment;
        mainDiagonalSum += (row === col) ? increment : 0;
        crossDiagonalSum += (row === n - col - 1) ? increment : 0;

    }

    /**
     * Clones the current game state for use by external code.
     * @returns {Object} - cloned game state
     */
    const cloneGameState = () => {

        const clone = { state: currentGameState.state, winningSet: null };

        if (currentGameState.winningSet) {
            const winningSet = [];

            for (let i = 0; i < n; i++) {
                const [row, col] = currentGameState.winningSet[i];
                winningSet.push([row, col]);
            }

            clone.winningSet = winningSet;
        }

        return clone;
    }

    /**
     * Determines if a player has won by returning set of (row, column) indices pairs 
     * that represents a linear section of the board. 
     * 
     * @param {int} row 
     * @param {int} col 
     * @returns {Array} - If no player has won, null is returned.
     */
    const calculateWinningSet = (row, col) => {

        const winningSum = playerOneActive ? n : -n;
        const winningSet = [];

        if (rowSums[row] === winningSum) {
            for (let i = 0; i < n; i++) {
                winningSet.push([row, i]);
            }
        }

        else if (colSums[col] === winningSum) {
            for (let i = 0; i < n; i++) {
                winningSet.push([i, col]);
            }
        }

        else if (row === col && mainDiagonalSum === winningSum) {
            for (let i = 0; i < n; i++) {
                winningSet.push([i, i]);
            }
        }

        else if (row === n - col - 1 && crossDiagonalSum === winningSum) {
            for (let i = 0; i < n; i++) {
                winningSet.push([i, n - i - 1]);
            }
        }

        else {
            return null;
        }

        return winningSet;
    }

    return { playRound };
}