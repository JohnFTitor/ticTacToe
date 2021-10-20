//Defined private scope for game functionality
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

        const setGameBoard = (setter) => {
            gameboard = setter.map((row) => {
                return [...row];
            })
        }

        const resetGameBoard = () => {
            gameboard = [["", "", ""],
            ["", "", ""],
            ["", "", ""]];
        }

        //Checks if the items alined are equal and not empty.    
        const _checkLine = (gameboard, row = [0, 1, 2], column = [0, 1, 2]) => {
            if (gameboard[row[0]][column[0]] === gameboard[row[1]][column[1]] && gameboard[row[1]][column[1]] === gameboard[row[2]][column[2]] && gameboard[row[0]][column[0]] !== "") {
                return [true, gameboard[row[0]][column[0]]];
            }
            return [false, null];
        }

        //Checks the state of the board and returns the winner movement or tie if there isn't
        const checkBoard = (count, gameboard) => {
            let result = [false, null];
            if (count >= 5) {
                for (let row = 0; row < gameboard.length; row++) {
                    let rowArray = [row, row, row];
                    result = _checkLine(gameboard,rowArray);
                    if (result[0]) {
                        return result;
                    }
                }
                for (let column = 0; column < gameboard.length; column++) {
                    let rowArray = [0, 1, 2];
                    let columnArray = [column, column, column];
                    result = _checkLine(gameboard,rowArray, columnArray);
                    if (result[0]) {
                        return result;
                    }
                }
                result = _checkLine(gameboard);
                if (result[0]) {
                    return result;
                }
                result = _checkLine(gameboard, [2, 1, 0], [0, 1, 2]);
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
            set: setGameBoard,
            reset: resetGameBoard,
            check: checkBoard
        }

    })();

    function Box(selector, row, column) {
        return {
            selector: selector,
            row: row,
            column: column
        }
    }

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
                //sets the img src for the box elements
                box.selector.firstElementChild.src = gameboardArray[box.row][box.column];
                if (gameboardArray[box.row][box.column] !== ""){
                    box.selector.firstElementChild.style.display = "block";
                    box.selector.removeEventListener('click', box.newMark);
                } else {
                    box.selector.firstElementChild.style.display = "none";
                }
            })
        }

        return {
            render: render
        }

    })()

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
            BoardDisplay.render();
        }

        return {
            play: play,
            getName: getName,
            getMovement: getMovement
        }
    }

    //Event listener for regular two players game
    function markPlayer(box, player1, player2) {
        if (count % 2 === 0) {
            player1.play(box.row, box.column);
        } else {
            player2.play(box.row, box.column);
        }
        count++;
        checkGame(player1, player2);
    }

    //Event listener for Player vs AI game
    function markAI(box,player1,player2){
        player1.play(box.row, box.column);
        count++;
        if(!checkGame(player1,player2)){
            setTimeout(function(){
                playAI(player1,player2);
                count++;
                checkGame(player1,player2);
            }, 300)
        }
    }

    function playAI(player1,player2){
        //First creates a list of possible movements for AI player, for then call the minimax algorithm
        //This space here can be considered a maximization, the only difference is that the objective is
        //to return the bestBoard possible.
        let firstChildren = createChildren(Gameboard.get(), player2.getMovement());
        let bestBoard = [];
        let maxValue = -Infinity;
        firstChildren.forEach( (child) => {
            let minimaxed = minimax(child, 5, false, player1, player2);
            if(minimaxed > maxValue){
                maxValue = minimaxed;
                bestBoard = child.map( (row) => {
                    return [...row];
                })
            }
        })
        Gameboard.set(bestBoard);
        BoardDisplay.render();
    }

    function minimax(node, depth, maximizingPlayer, player1, player2){
        //First checks if there's a winning state
        let result = Gameboard.check(5, node);
        let ended = true;
        if (!result[0]){
            //Checks if the current state is an end game state (All boxes are full)
            for(let row = 0; row < node.length; row++){
                for(let column = 0; column < node.length; column++){
                    if (node[row][column] == ""){
                        row = node.length;
                        ended = false;
                        break;
                    }    
                }
            }
        }
        if (depth === 0 || ended){
            if  (player2.getMovement() === result[1]) {
                return +10;
            } else if (player1.getMovement() === result[1]) {
                return -10;
            } 
            return 0;            
        } 
        if (maximizingPlayer){
            let value = -Infinity;
            let children =  createChildren(node, player2.getMovement());
            children.forEach( (child) => {
                value = Math.max(value, minimax(child, depth - 1, false, player1, player2));    
            })
            return value;
        } else {
            let value = Infinity;
            let children = createChildren(node, player1.getMovement());
            children.forEach( (child) => {
                value = Math.min(value, minimax(child, depth - 1, true, player1, player2));
            })
            return value;
        }
    }

    //Function to create possible movements based on the parent board.
    function createChildren(node, playerMovement){
        let childList = [];
        for(let row = 0; row < node.length; row++){
            for(let column = 0; column < node.length; column++){
                if (node[row][column] == ""){
                    let nodeChild = node.map((row) => {
                        return [...row];
                    })
                    nodeChild[row][column] = playerMovement;
                    childList.push(nodeChild);
                }    
            }
        }
        return childList;
    }


    function checkGame(player1, player2) {
        let result = Gameboard.check(count, Gameboard.get());
        if (result[0]) {
            let winner = (() => {
                if (player1.getMovement() === result[1]) {
                    return player1.getName();
                } else if (player2.getMovement() === result[1]) {
                    return player2.getName();
                }
                return result[1];
            })();
            if (winner === "Tie"){
                message.textContent = `Ashamedly, this seems to be a Tie. What about another round?`;
            } else {
                message.textContent = `Congratulations, ${winner}! You won this round`;
            }
            boxes.forEach((box) => {
                box.selector.removeEventListener('click', box.newMark);
            })
            return true;
        }
    }

    const start = (p1, p2, p1Movement, p2Movement) => {

        count = 0;
        Gameboard.reset();
        BoardDisplay.render();
        message.textContent = "";

        const player1 = Player(p1, p1Movement);
        const player2 = Player(p2, p2Movement);

        //Assigns event listeners based on the selection of the player
        if(toggleAI.textContent === "Player"){
            boxes.forEach((box) => {
                let newMark = markPlayer.bind(box.selector, box, player1, player2);
                //I used an object attribute to save the reference to the event listener, so bind could be used.
                box.newMark = newMark;
                box.selector.addEventListener('click', newMark);
            })
        }else {
            boxes.forEach((box) => {
                let newMark = markAI.bind(box.selector, box, player1, player2);
                box.newMark = newMark;
                box.selector.addEventListener('click', newMark);
            })
        }
    }

    const reset = () => {
        boxes.forEach((box) => {
            box.selector.removeEventListener('click', box.newMark);
        })
    }

    return {
        start: start,
        reset: reset
    }

})()

//Menu and initial config
function checkvalues(){
    player1selection = player1container.querySelector(":checked");
    player2selection = player2container.querySelector(":checked");
    if (player1selection === null || player2selection === null || player1name.value === "" || player2name.value === ""){
        alert("Can't start Game.Verify you filled the name input and selected a weapon");
        return false;
    }
    return true;
}

function start() {
    if (checkvalues()){
        menu.style.display = "none";
        gameScreen.style.display = "flex";
        Game.start(player1name.value, player2name.value, player1selection.value, player2selection.value);
    }
}

function reset(){
    Game.reset();
    start();
}

function finish(){
    Game.reset();
    menu.style.display = "flex";
    gameScreen.style.display = "none";
}

const startGame = document.querySelector("#startButton");
const menu = document.querySelector("#menu");
const gameScreen = document.querySelector("#game");
const player1name = document.querySelector("#name1");
const player2name = document.querySelector("#name2");
const restartGame = document.querySelector("#restartButton");
const finishGame = document.querySelector("#finishButton");

startGame.addEventListener('click', start);
restartGame.addEventListener('click', reset);
finishGame.addEventListener('click', finish);

//Disable other player options in the Menu

const player1container = document.querySelector("#player1Weapon");
const player2container = document.querySelector("#player2Weapon");
let player1selection = player1container.querySelector(":checked");
let player2selection = player2container.querySelector(":checked");
const player2Options = document.querySelectorAll("input[name='selectionPlayer2']");
let disabledOption = "";

function disableOptions(){
    let selection  = player1container.querySelector(":checked");
    if (disabledOption){
        disabledOption.disabled = false;
    }
    player2Options.forEach( (option) => {
        if (option.value === selection.value){
            option.disabled = true;
            option.checked = false;
            disabledOption = option;
        }
    })
}

disableOptions();
player1container.addEventListener('change', disableOptions);

//AI implementation

const player2Form = document.querySelector("#player2");
const toggleAI = document.querySelector("#toggleAI");

//Disable default form behaviour
player2Form.addEventListener('submit', (event) => {
    event.preventDefault();
})

toggleAI.addEventListener('click', () => {
    if(toggleAI.textContent === "Player"){
        toggleAI.textContent = "AI";
    } else {
        toggleAI.textContent = "Player";
    }
})