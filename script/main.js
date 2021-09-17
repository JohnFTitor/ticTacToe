const Game = (function() {
    let count;

    const Gameboard = (function () {
    
        let gameboard = [["", "", ""],
                         ["", "", ""],
                         ["", "", ""]];
    
        const add = (movement,row,column) => {
            gameboard[row][column] = movement;
        }
    
        const getGameBoard = () => {
            let gameboardCopy = gameboard.map( (row) => {
                return [...row];
            })
            return gameboardCopy;
        }

        const resetGameBoard = () => {
            gameboard = [["", "", ""],
                         ["", "", ""],
                         ["", "", ""]];
        }
    
        return {
            add: add,
            get: getGameBoard,
            reset: resetGameBoard
        }
    
    })();

    const boxes = (() => {
        const gameboard = Array.from(document.querySelectorAll('.box'));
        const boxes = [];
        
        let row = 0;
        let column = 0;
        gameboard.forEach ( (box) => {
            if (column === 3){
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
            boxes.forEach ( (box) => {
                box.selector.firstElementChild.textContent = gameboardArray[box.row][box.column];
            }) 
        }

        return {
            render: render
        }

    })()

    function Box (selector, row, column) {
        return {
            selector: selector,
            row: row,
            column: column
        }
    }
    
    function Player(name, movement){
        let playerName = name;
        let playerMovement = movement;
    
        const play = (row, column) => {
            Gameboard.add(playerMovement, row, column);
            console.log(`${playerName} has made its move`);
            BoardDisplay.render();
        }
    
        return {
            play: play
        }
    }

    function mark(box, player1, player2){
        if (count%2 === 0){
            player1.play(box.row, box.column);
        } else {
            player2.play(box.row, box.column);
        }
        count++;
        this.removeEventListener('click', box.newMark);
    }  
    
    const start = () => {

        Gameboard.reset();
        BoardDisplay.render();
        count = 0;

        const p1 = "Mike";
        const p1Movement = "X";
        const p2 = "Rick";
        const p2Movement = "O";
        
        const player1 = Player(p1,p1Movement);
        const player2 = Player(p2,p2Movement);
    
        boxes.forEach( (box) => {
            newMark = mark.bind(box.selector, box, player1, player2);
            box.newMark = newMark;
            box.selector.addEventListener('click', newMark);
        })
        
    }
    
    start();

    return {
        start: start
    }
    
})()

