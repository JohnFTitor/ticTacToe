const Game = (function() {
    const GameBoard = (function () {
    
        let gameboard = [["", "", ""],
                         ["", "", ""],
                         ["", "", ""]];
    
        const add = (movement,row,column) => {
            gameboard[row][column] = movement;
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
            const row = prompt('which row are you gonna choose? ' + playerName, '0');
            const column = prompt('which column r u gonna choose?' + playerName, '0');
            GameBoard.add(playerMovement, row, column);
            console.log(`${playerName} has made its move`);
            GameBoard.display();
        }
    
        return {
            play: play
        }
    }

    const start = () => {
        const p1 = prompt('State your name, Player');
        const p1Movement = prompt('Which symbol are you gonna use?');
        const p2 = prompt('State your name, Player 2');
        const p2Movement = prompt('Same question. Which symbol are you gonna use?');
        
        const player1 = Player(p1,p1Movement);
        const player2 = Player(p2,p2Movement);

        for (let i = 0; i < 4; i++) {
            player1.play();
            player2.play();
        }
    }
    
    return {
        start: start
    }
    
})()
