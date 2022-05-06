const prompt = require('prompt-sync')({sigint: true});
const term = require('terminal-kit').terminal;

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field{
    constructor (field){
        this.field = field;
    }

    print (){
        this.field.forEach(element => {
            console.log(element.join(''));
        });
    }

    playGame(){

        // Variables necesary for this method.
        let hardMode = prompt(term.bgWhite.brightCyan("Enable hard mode?(Adds a hole every 3 turns (Y/N). "));
        let turnCount = 0;
        this.print();
        let move = prompt(term.brightCyan("Make a move, use the WASD keys. (You're the *). "));
        let positionX;
        let positionY;
        let gameStatus = true;
        let placeNewHole;
        // Find starting position
        for(let i = 0; i < this.field.length; i++){
            let returnIndex = this.field[i].indexOf(pathCharacter);
            if(returnIndex != -1){
                positionY = i;
                positionX = returnIndex;
                break;
            }   
        }

        // Update position
        function upDateMove(move){
            switch (move.toUpperCase()) {
                case 'W':
                    positionY--
                    break;
                case 'S':
                    positionY++
                    break;
                case 'D':
                    positionX++
                    break;
                case 'A':
                    positionX--
                    break;
            }
        }
  
        while(gameStatus == true){

            // Place a hole in a random spot of the map if hard mode is enable.
            if(hardMode.toUpperCase() == 'Y'){
                turnCount++;
                if(turnCount % 3 == 0){
                    placeNewHole = false
                    while(placeNewHole == false){
                        let randomIndexX = Math.floor(Math.random()*this.field[0].length);
                        let randomIndexY = Math.floor(Math.random()*this.field.length);
                        if(this.field[randomIndexY][randomIndexX] == fieldCharacter){
                            this.field[randomIndexY][randomIndexX] = hole;
                            placeNewHole = true
                        }
                    }
                }
            }

            // Check if you the shoud continue or is over.
            upDateMove(move);
            if (positionY < 0 || positionY > this.field.length -1 || positionX < 0 || positionX > this.field[positionY].length){
                console.log('Game Over, you fell out of the field.');
                break;
            } else if(this.field[positionY][positionX] == pathCharacter){
                this.print();
                move = prompt(term.brightCyan('Make a move, use the WASD keys. ')); 
            } else if(this.field[positionY][positionX] == fieldCharacter){
                this.field[positionY][positionX] = pathCharacter;
                this.print();
                move = prompt(term.brightCyan('Make a move, use the WASD keys. '));  
            } else if(this.field[positionY][positionX] == hole){
                console.log('Game Over, you fell in a hole.');
                break;
            } else if(this.field[positionY][positionX] == hat){
                console.log('You won you found the hat!!!')
                break;
            } 
        }
    }

    // input heigth, width and the percentage of the field that will be cover with holes and genarete a random field.
    static generateField(heigth, width, percentage){
        let field = [];
        for(let i = 0; i < heigth; i++){
            field[i] = [];
            for(let j = 0; j < width; j++){
                field[i][j] = fieldCharacter;
            }
        }

        // Place holes on the field.
        const numOfHoles = Math.floor((heigth*width)*percentage);
        let holesPlaced = 0;
        while(holesPlaced != numOfHoles){
            let randomIndexX = Math.floor(Math.random()*width);
            let randomIndexY = Math.floor(Math.random()*heigth);
            if(field[randomIndexY][randomIndexX] == fieldCharacter){
                field[randomIndexY][randomIndexX] = hole;
                holesPlaced++;
            }
        }

        // Place player and hat.
        let hatPlaced = false;
        let playerPlaced = false;

        while(hatPlaced == false){
            let randomIndexX = Math.floor(Math.random()*width);
            let randomIndexY = Math.floor(Math.random()*heigth);
            if(field[randomIndexY][randomIndexX] == fieldCharacter){
                field[randomIndexY][randomIndexX] = hat;
                hatPlaced = true;
            }
        }

        while(playerPlaced == false){
            let randomIndexX = Math.floor(Math.random()*width);
            let randomIndexY = Math.floor(Math.random()*heigth);
            if(field[randomIndexY][randomIndexX] == fieldCharacter){
                field[randomIndexY][randomIndexX] = pathCharacter;
                playerPlaced = true;
            }
        }
        return field;    
    }    
}

const fieldOne = new Field(Field.generateField(10,20,0.3));
fieldOne.playGame();