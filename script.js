/**
 * Creates a n x n tic-tac-toe gameBoard
 * 
 * @param {int} n - width and height of the gameBoard
 * @returns {GameBoard} - GameBoard object
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
 * Creates the game controller for tic-tac-toe on a n x n gameboard
 * 
 * @param {int} n - size of the game board 
 * @returns {GameController} - game controller
 */
function createGameController(n) {

    const gameBoard = createGameBoard(n);

    /**
     * Represents the state of the game
     */
    const gameState = { state: GAME_STATES.ONGOING, winSet: null, };

    let playerOneActive = false;
    let round = 0;

    // sums of player marks that determine whether a row, column, or any of the diagonals
    // are marked solely by a single player, which can be used to find the winner.
    let rowSums = Array(n).fill(0);
    let colSums = Array(n).fill(0);
    let mainDiagonalSum = 0;
    let crossDiagonalSum = 0;

    /**
     * Plays a round of the game
     * 
     * @param {int} row - row index of board
     * @param {int} col - column index of board
     * @returns {GameState} - the current state of the game
     */
    const playRound = (row, col) => {
        // if game has already ended in a win or a draw, return the final game state
        if (gameState.state === GAME_STATES.WIN || gameState.state === GAME_STATES.DRAW) {
            return gameState;
        }

        // switch between players
        playerOneActive = !playerOneActive;
        round++;

        try {

            gameBoard.setMarkAt(row, col, playerOneActive);

        } catch (error) {

            console.error(error);

            playerOneActive = !playerOneActive;

            return gameState;
        }

        incrementSums(row, col);

        if (round === n * n) {
            gameState.state = GAME_STATES.DRAW;
        }

        if (round >= n * 2 - 1) {
            const winSet = getWinSet(row, col);

            if (winSet) {
                gameState.state = GAME_STATES.WIN;
                gameState.winSet = winSet;
            }
        }

        gameBoard.display();
        console.log({ rowSum: rowSums[row], colSum: colSums[col], mainDiagonalSum, crossDiagonalSum });

        return gameState;
    }

    /**
     * Increments the internal sum variables based on the 
     * position of the new mark and the active player
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
     * Determines if a player has won by returning set of (row, column) indices pairs 
     * that represents a linear section of the board. 
     * 
     * @param {int} row 
     * @param {int} col 
     * @returns {Array} - If no player has won, null is returned.
     */
    const getWinSet = (row, col) => {

        const winSum = playerOneActive ? n : -n;
        const winSet = [];

        if (rowSums[row] === winSum) {
            for (let i = 0; i < n; i++) {
                winSet.push([row, i]);
            }
        }

        else if (colSums[col] === winSum) {
            for (let i = 0; i < n; i++) {
                winSet.push([i, col]);
            }
        }

        else if (row === col && mainDiagonalSum === winSum) {
            for (let i = 0; i < n; i++) {
                winSet.push([i, i]);
            }
        }

        else if (row === n - col - 1 && crossDiagonalSum === winSum) {
            for (let i = 0; i < n; i++) {
                winSet.push([i, n - i - 1]);
            }
        }

        else {
            return null;
        }

        return winSet;
    }

    return { playRound };
}