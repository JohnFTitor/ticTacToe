const Game = (function () {
    let count;
    const message = document.querySelector('#winner');

    const Gameboard = (function () {

        let gameboard = [["", "", ""],
        ["", "", ""],
        ["", "", ""]];

        const add = (movement, row, column) => {
            gameboard[row][column] = movement;
        }

        const getGameBoard = () => {
            let gameboardCopy = gameboard.map((row) => {
                return [...row];
            })
            return gameboardCopy;
        }

        const resetGameBoard = () => {
            gameboard = [["", "", ""],
            ["", "", ""],
            ["", "", ""]];
        }

        const _checkLine = (row = [0, 1, 2], column = [0, 1, 2]) => {
            if (gameboard[row[0]][column[0]] === gameboard[row[1]][column[1]] && gameboard[row[1]][column[1]] === gameboard[row[2]][column[2]] && gameboard[row[0]][column[0]] !== "") {
                return [true, gameboard[row[0]][column[0]]];
            }
            return [false, null];
        }

        const checkBoard = () => {
            let result = [false, null];
            if (count >= 5) {
                for (let row = 0; row < gameboard.length; row++) {
                    let rowArray = [row, row, row];
                    result = _checkLine(rowArray);
                    if (result[0]) {
                        return result;
                    }
                }
                for (let column = 0; column < gameboard.length; column++) {
                    let rowArray = [0, 1, 2];
                    let columnArray = [column, column, column];
                    result = _checkLine(rowArray, columnArray);
                    if (result[0]) {
                        return result;
                    }
                }
                result = _checkLine();
                if (result[0]) {
                    return result;
                }
                result = _checkLine([2, 1, 0], [0, 1, 2]);
                if (result[0]) {
                    return result;
                }

                if (count === 9 && !(result[0])) {
                    return [true, "Tie"];
                }
            }
            return result;
        }

        return {
            add: add,
            get: getGameBoard,
            reset: resetGameBoard,
            check: checkBoard
        }

    })();

    const boxes = (() => {
        const gameboard = Array.from(document.querySelectorAll('.box'));
        const boxes = [];

        let row = 0;
        let column = 0;
        gameboard.forEach((box) => {
            if (column === 3) {
                column = 0;
                row++;
            }
            boxes.push(Box(box, row, column));
            column++;
        })

        return boxes;

    })()

    const BoardDisplay = (function () {

        const render = () => {
            let gameboardArray = Gameboard.get();
            boxes.forEach((box) => {
                box.selector.firstElementChild.textContent = gameboardArray[box.row][box.column];
            })
        }

        return {
            render: render
        }

    })()

    function Box(selector, row, column) {
        return {
            selector: selector,
            row: row,
            column: column
        }
    }

    function Player(name, movement) {
        let playerName = name;
        let playerMovement = movement;

        const getName = () => {
            return playerName;
        }

        const getMovement = () => {
            return playerMovement;
        }

        const play = (row, column) => {
            Gameboard.add(playerMovement, row, column);
            console.log(`${playerName} has made its move`);
            BoardDisplay.render();
        }

        return {
            play: play,
            getName: getName,
            getMovement: getMovement
        }
    }

    function mark(box, player1, player2) {
        if (count % 2 === 0) {
            player1.play(box.row, box.column);
        } else {
            player2.play(box.row, box.column);
        }
        count++;
        this.removeEventListener('click', box.newMark);
        checkGame(player1, player2);
    }

    function checkGame(player1, player2) {
        let result = Gameboard.check();
        if (result[0]) {
            let winner = (() => {
                if (player1.getMovement() === result[1]) {
                    return player1.getName();
                } else if (player2.getMovement() === result[1]) {
                    return player2.getName();
                }
                return result[1];
            })();
            message.textContent = "The winner is: " + winner;
            boxes.forEach((box) => {
                box.selector.removeEventListener('click', box.newMark);
            })
        }
    }

    const start = () => {

        count = 0;
        Gameboard.reset();
        BoardDisplay.render();

        const p1 = "Mike";
        const p1Movement = "X";
        const p2 = "Rick";
        const p2Movement = "O";

        const player1 = Player(p1, p1Movement);
        const player2 = Player(p2, p2Movement);

        boxes.forEach((box) => {
            newMark = mark.bind(box.selector, box, player1, player2);
            box.newMark = newMark;
            box.selector.addEventListener('click', newMark);
        })
    }

    return {
        start: start
    }

})()

function start() {
    menu.style.display = "none";
    gameScreen.style.display = "flex";
    Game.start();
}

const startGame = document.querySelector("#startButton");
const menu = document.querySelector("#menu");
const gameScreen = document.querySelector("#game");

startGame.addEventListener('click', start);

//Disable other player options 

const player1selection = document.querySelector("#player1Weapon");
const player2selection = document.querySelector("#player2Weapon");
let player2Options = document.querySelectorAll("input[name='selectionPlayer2']");
let disabledOption = "";

function disableOptions(){
    let selection  = player1selection.querySelector(":checked");
    if (disabledOption){
        disabledOption.disabled = false;
    }
    player2Options.forEach( (option) => {
        if (option.value === selection.value){
            option.disabled = true;
            option.checked = false;
            disabledOption = option;
            console.log("I disabled: " + disabledOption.value);
        }
    })
}

disableOptions();
player1selection.addEventListener('change', disableOptions);