const Game = (function() {
    const GameBoard = (function () {
    
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
    
        return {
            add: add,
            get: getGameBoard
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
            let gameboardArray = GameBoard.get();
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
            GameBoard.add(playerMovement, row, column);
            console.log(`${playerName} has made its move`);
            BoardDisplay.render();
        }
    
        return {
            play: play
        }
    }

    
    let count;

    function mark(row, column, player1, player2){
        if (count%2 === 0){
            player1.play(row, column);
        } else {
            player2.play(row, column);
        }
        count++;
    }  
    
    const start = () => {
        const p1 = prompt('State your name, Player');
        const p1Movement = prompt('Which symbol are you gonna use?');
        const p2 = prompt('State your name, Player 2');
        const p2Movement = prompt('Same question. Which symbol are you gonna use?');
        
        const player1 = Player(p1,p1Movement);
        const player2 = Player(p2,p2Movement);
        
        count = 0;
        
        boxes.forEach( (box) => {
            box.selector.addEventListener('click', mark.bind(box.selector, box.row, box.column, player1, player2));
        })
        
    }
    

    return {
        start: start
    }
    
})()

