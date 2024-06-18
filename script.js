/**
 * Creates a n x n tic-tac-toe gameboard
 * 
 * @param {int} n - width and height of the gameboard
 * @returns {Object} - gameboard object
 */
function createGameboard(n) {

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

    return { setMarkAt, getMarkFrom, display};
};

