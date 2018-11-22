

var canvas = document.getElementById('Maze');
var ctx = canvas.getContext('2d');

var SIZE = 25;

var maze = [];
var visited = [];
var deletedLater = [];
var nodes = [];
var correctPath = [];
var cX;
var cY;
var oX;
var oY;
var originalStartX;
var originalStartY;
var endX;
var endY;
var correctX;
var correctY;
var count = 1;
var playerX;
var playerY;
var timeCount = 0;
var botInterval;
var plyaerInterval;
var finalX;
var finalY;


function addToArray(a,b, arr){
    arr.push({a:a, b:b});
}

function MazeOutline(size){
    for (i = 0; i < size; i++) {
        maze[i] = [];
        for (j = 0; j < size; j++){
            if(i%2 == 1 && j%2 == 1){
                maze[i][j] = 0;
                addToArray(i,j,nodes);
            }else{
                maze[i][j] = 1;
            }
        }
    }
    startingPLace = Math.floor(Math.random() * nodes.length);
    cX = nodes[startingPLace].a;
    cY = nodes[startingPLace].b;
    originalStartX = cX;
    originalStartY = cY;
    playerX = cX;
    playerY = cY;
    maze[originalStartX][originalStartY] = 2;
    addToArray(cX, cY, nodes);
    addToArray(cX, cY, visited);
    addToArray(cX, cY, deletedLater);
}

function MazeWall(x, y, blockSize) {
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillRect(x, y, blockSize, blockSize);
}

function MazePath(x, y, blockSize) {
    ctx.fillStyle = "rgb(255, 255, 255)";
    ctx.fillRect(x, y, blockSize, blockSize);
}

function MazeStart(x, y, blockSize) {
    ctx.fillStyle = "rgb(0, 255, 0)";
    ctx.fillRect(x, y, blockSize, blockSize);
}

function MazeEnd(x, y, blockSize) {
    ctx.fillStyle = "rgb(255, 0, 0)";
    ctx.fillRect(x, y, blockSize, blockSize);
}

function MazeCorrectPath(x, y, blockSize) {
    ctx.fillStyle = "rgb(0, 0, 255)";
    ctx.fillRect(x, y, blockSize, blockSize);
}

function reDraw(size){
    for(y = 0; y < size; y++){
        for(x = 0; x < size; x++){
            if(maze[x][y] == 1){
                MazeWall(x*10, y*10, 10);
            }
            else if(maze[x][y] == 2){
                MazeStart(x*10, y*10, 10);
            }
            else if(maze[x][y] == 3){
                MazeEnd(x*10, y*10, 10)
            }
            else if(maze[x][y] == 4){
                MazeCorrectPath(x*10, y*10, 10);
            }
            else{
                MazePath(x*10, y*10, 10);
            }
        }
    }
}

function clearCanvas(size){
    for(y = 0; y < size; y++){
        for(x = 0; x < size; x++){
            if(maze[x][y] == 1){
                ctx.clearRect(x*10, y*10, SIZE, SIZE);
            }
            else if(maze[x][y] == 2){
                ctx.clearRect(x*10, y*10, SIZE, SIZE);
            }
            else if(maze[x][y] == 3){
                ctx.clearRect(x*10, y*10, SIZE, SIZE);
            }
            else if(maze[x][y] == 4){
                ctx.clearRect(x*10, y*10, SIZE, SIZE);
            }
            else{
                ctx.clearRect(x*10, y*10, SIZE, SIZE);
            }
        }
    }
}

function CheckVisited(x, y){
    for(f = 0; f < visited.length; f++){
        if (visited[f].b == y  && visited[f].a == x) {
              return false;  
        }
    }
    return true;
}

function MazeMaker(size){
    MazeOutline(size);
    var possibleMoves = [];
    var counter = 0;


    while(deletedLater.length > 0){
        oX = cX;
        oY = cY;
        possibleMoves = [];
        
        if(CheckVisited(cX, cY-2) && cY-2 > 0 ){
            addToArray(cX,cY-2,possibleMoves);
        }
        if(CheckVisited(cX+2, cY) && cX+2 < size - 1 ){
            addToArray(cX+2,cY,possibleMoves);
        }
        if(CheckVisited(cX, cY+2) && cY+2 < size - 1){
            addToArray(cX,cY+2,possibleMoves);
        }
        if(CheckVisited(cX-2, cY) && cX-2 > 0 ){
            addToArray(cX-2,cY,possibleMoves);
        }

        if(possibleMoves.length > 0){
            var nextMove = Math.floor((Math.random() * possibleMoves.length));
            cX = possibleMoves[nextMove].a;
            cY = possibleMoves[nextMove].b;
            addToArray(cX,cY,visited);
            addToArray(cX,cY,deletedLater);

            var dX = cX - oX;
            var dY = cY - oY;

            oX = oX + (dX / 2);
            oY = oY + (dY / 2);

            maze[oX][oY] = 0;
            counter = 0;

        } else {
            if(counter == 0 && correctPath < deletedLater){
                correctPath = deletedLater.slice();
                counter++;
            }
            deletedLater.pop();
            if(deletedLater.length > 0){
                cX = deletedLater[deletedLater.length-1].a;
                cY = deletedLater[deletedLater.length-1].b;

            }else{

            }

        }
    }
    endX = correctPath[correctPath.length-1].a;
    endY = correctPath[correctPath.length-1].b;

    maze[endX][endY] = 3;
}

function CreateCorrectPath(){
    if(count < correctPath.length){
        if(count > 1){
            oX = correctX;
            oY = correctY;
        }

        correctX = correctPath[count].a;
        correctY = correctPath[count].b;
        
        var dX = correctX - oX;
        var dY = correctY - oY;

        finalX = oX + (dX / 2);
        finalY = oY + (dY / 2);

        maze[finalX][finalY] = 4;
        MazeCorrectPath(finalX*10, finalY*10, 10)

        maze[correctX][correctY] = 4;
        MazeCorrectPath(correctX*10, correctY*10, 10);

        count++;
        BotWinCondition();
    }
}

function moveUp(){
    clearCanvas(SIZE);
    if(maze[playerX-1][playerY] == 0 || maze[playerX-1][playerY] == 3){
        if(maze[playerX][playerY] != 2){
            maze[playerX][playerY] = 0;
        }
        playerX -= 1;
        maze[playerX][playerY] = 4;
        MazeCorrectPath(playerX*10, playerY*10, 10);
    }
    reDraw(SIZE);
}

function moveDown(){
    clearCanvas(SIZE);
    if(maze[playerX+1][playerY] == 0 || maze[playerX+1][playerY] == 3){
        if(maze[playerX][playerY] != 2){
            maze[playerX][playerY] = 0;
        }
        playerX += 1;
        maze[playerX][playerY] = 4;
        MazeCorrectPath(playerX*10, playerY*10, 10);
    }
    reDraw(SIZE);
}

function moveLeft(){
    clearCanvas(SIZE);
    if(maze[playerX][playerY-1] == 0 || maze[playerX][playerY-1] == 3){
        if(maze[playerX][playerY] != 2){
            maze[playerX][playerY] = 0;
        }
        playerY -= 1;
        maze[playerX][playerY] = 4;
        MazeCorrectPath(playerX*10, playerY*10, 10);
    }
    reDraw(SIZE);
}

function moveRight(){
    clearCanvas(SIZE);
    if(maze[playerX][playerY+1] == 0 || maze[playerX][playerY+1] == 3){
        if(maze[playerX][playerY] != 2){
            maze[playerX][playerY] = 0;
        }
        playerY += 1;
        maze[playerX][playerY] = 4;
        MazeCorrectPath(playerX*10, playerY*10, 10);
    }
    reDraw(SIZE);
}

var KEYCODE_LEFT = 37;
var KEYCODE_UP = 38;

var KEYCODE_RIGHT = 39;
var KEYCODE_DOWN = 40;

function handleKeyDown(evt) {
    if(!evt){ var evt = window.event; }  //browser compatibility
    switch(evt.keyCode) {
        case KEYCODE_LEFT:  
            moveUp(); 
            break;
        case KEYCODE_RIGHT:    
            moveDown(); 
            break;
        case KEYCODE_UP:    
            moveLeft(); 
            break;
        case KEYCODE_DOWN:  
            moveRight(); 
            break;
    }
}

document.onkeydown = handleKeyDown

function Timer(){
    if(timeCount < 60 && maze[playerX][playerY] != maze[correctPath[correctPath.length-1].a][correctPath[correctPath.length-1].b]){
        console.log(timeCount);
        document.getElementById("timer").innerHTML = timeCount + " secs";
        timeCount++;
    }else if(maze[playerX][playerY] == maze[correctPath[correctPath.length-1].a][correctPath[correctPath.length-1].b]){
        clearInterval(playerInterval);
        PlayerGameWin();
        console.log("You won in " + timeCount + " seconds.  Good Job!");
    }
    else{
        clearInterval(playerInterval);
        PlayerLoseGame();
        console.log("Game Over");
    }
}

function BotWinCondition(){
    if(maze[correctX][correctY] == maze[correctPath[correctPath.length-1].a][correctPath[correctPath.length-1].b]){
        clearInterval(botInterval);
        BotGameWin();
    }
}

function BotGameWin(){
    if(window.confirm("The Bot completed the maze. \n Click OK to get to the goods!")){
        window.location.replace("https://www.youtube.com/watch?v=Ew1AM8ZYDNU");
    }
}

function PlayerGameWin(){
    if(window.confirm("Nice job, you completed the maze on time! \n Click ok to get to the goods!")){
        window.location.replace("https://www.youtube.com/watch?v=K2oxNp8yquE");
    }
}

function PlayerLoseGame(){
    if(window.confirm("Oh no, you didn't complete the maze in time, bummer. \n Well, I will still reward you for your efforts.")){
        window.location.replace("https://www.youtube.com/watch?v=czLYl4fM8yk");
    }
}

function BotGame(){
    botInterval = setInterval(CreateCorrectPath, 50);
    MazeMaker(SIZE);
    reDraw(SIZE);
}

function PlayerGame(){
    playerInterval = setInterval(Timer, 1000);
    MazeMaker(SIZE);
    reDraw(SIZE);
}
    


