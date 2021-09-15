const Game = (function() {
    const GameBoard = (function () {
    
        let gameboard = [["", "", ""],
                         ["", "", ""],
                         ["", "", ""]];
    
        const add = (movement,row,column) => {
            if (row <= 2 && column <=2) {
                gameboard[row][column] = movement;
            }
        }
    
        const displayArray = () => {
            console.log(gameboard);
        }
    
        return {
            add: add,
            display: displayArray
        }
    
    })();
    
    function Player(name, movement){
        let playerName = name;
        let playerMovement = movement;
    
        const play = () => {
            const row = prompt('which row are you gonna choose? ', '0');
            const column = prompt('which column r u gonna choose?', '0');
            GameBoard.add(playerMovement, row, column);
            console.log(`${playerName} has made its move`);
            GameBoard.display();
        }
    
        return {
            play: play
        }
    }

    const start = () => {
        let player1 = prompt('State your name, Player');
        let player1Movement = prompt('Which symbol are you gonna use?');
    }
    
    return {
        start: start
    }
})()
