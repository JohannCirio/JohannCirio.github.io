const Player = (character, number) => {
    const symbol = character;
    const id = number;
    return {symbol, id}
}


const board = (() => {
    const tilesArray = [[null, null, null],[null, null, null],[null, null, null]];
    const fill = () => {
        for (let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                table.rows[i].cells[j].textContent = tilesArray[i][j];
            }
        }
    }
    const changeTileValue = (cellPosition, value) => {
        tilesArray[cellPosition[0]][cellPosition[1]] = value;
        table.rows[cellPosition[0]].cells[cellPosition[1]].textContent = value;
    }

    const getCellValue = (cellPosition) => {
        const row = cellPosition[0];
        const column = cellPosition[1];
        return tilesArray[row][column];
    }

    const getRow = (rowIndex) => {
        return tilesArray[rowIndex];
    }
    const getColumn = (columnIndex) => {
        return [
            tilesArray[0][columnIndex],
            tilesArray[1][columnIndex],
            tilesArray[2][columnIndex]
        ];
    }

    const getDiagonal = (diagonalIndex) => {
        return diagonalIndex === 0 ? [tilesArray[0][0],tilesArray[1][1],tilesArray[2][2]] :
                                     [tilesArray[0][2],tilesArray[1][1],tilesArray[2][0]];
    }

    const reset = () => {
        for (let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                tilesArray[i][j] = null;
            }
        }
    }
    return {
        fill,
        changeTileValue,
        reset,
        getCellValue,
        getRow,
        getColumn,
        getDiagonal
    };
})();

const game = (() => {

    const player1 = Player("O", 1);
    const player2 = Player('X', 2);
    let turn = 0;
    let finishedGame = false;

    const newGame = () => {
        board.reset();
        board.fill();
        finishedGame = false;
        turn = 0;
        currentPlayer = player1;
        playerTurn(currentPlayer);
    }

    const playerTurn =  () => {
        turn++;
        if (turn === 9) {
            draw();
            return;
        }

        console.log(turn);
        displayControl.setDisplayContent(`Player ${currentPlayer.id} (${currentPlayer.symbol}) turn!`);
    }

    const checkPlayValidity = (cellPosition) => {
        console.log(board.getCellValue(cellPosition))
        return board.getCellValue(cellPosition) == null;
    }

    const changeCurrentPlayer = () => {
        currentPlayer === player1 ? currentPlayer = player2 : currentPlayer = player1;
    }

    const allEqual = (arr) => {
        return arr.every( v => v === arr[0] );
    }

    const isNull = (element) => { return element === null; }

    const checkWinningConditions = () => {
        for(let i = 0; i < 3; i++) {
            let row = board.getRow(i);
            if(!row.some(isNull) && allEqual(row)){
                return true;
            }
        }
        for(let i = 0; i < 3; i++) {
            let column = board.getColumn(i);
            if(!column.some(isNull) && allEqual(column)){
                return true;
            }
        }
        for(let i = 0; i < 2; i++) {
            let diagonal = board.getDiagonal(i);
            if(!diagonal.some(isNull) && allEqual(diagonal)){
                return true;
            }
        }
    }

    const winner = () => {
        displayControl.setDisplayContent(`Player ${currentPlayer.id} won! Congratulations!`);
        finishedGame = true;
    }

    const draw = () => {
        displayControl.setDisplayContent(`Draw!`);
        finishedGame = true;
    }


    const gameOver = () => {
        return finishedGame;
    }

    let currentPlayer = player1;

    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    return {
        newGame,
        getCurrentPlayer,
        checkPlayValidity,
        playerTurn,
        changeCurrentPlayer,
        checkWinningConditions,
        gameOver,
        winner,
        draw
    }
})();

const displayControl = (() => {
    let textContent = null;
    const setDisplayContent = (value) => {
        textContent = value;
        textDisplay.textContent = textContent;
    }
    return {
        setDisplayContent
    }
})();



const resetButton = document.querySelector("#reset-button");
const table = document.querySelector('table');
const textDisplay = document.querySelector("#info-display");

table.addEventListener("click", (event) => {
    let cellPosition = [event.target.parentNode.rowIndex, event.target.cellIndex];
    if (game.gameOver()) { return }
    if (game.checkPlayValidity(cellPosition)){
        board.changeTileValue(cellPosition, game.getCurrentPlayer().symbol);
        if (game.checkWinningConditions()){
            game.winner();
            return;
        }
        game.changeCurrentPlayer();
        game.playerTurn();
    }

})

resetButton.addEventListener('click', () => {
    game.newGame();
})


