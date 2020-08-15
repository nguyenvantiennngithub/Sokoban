const WALL = '#';
const TARGET = '.';
const PERSON = '@';
const BOX = '$';
const BOX_ON_TARGET = '*';
const PERSON_ON_TARGET = '+';
const PATH = ' ';
const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;
var games = [0];
var currentGameNo = 0;
var currentGame;
var targets = [];
var boxes = [];
var boxesOnTarget = [];
var personRow;
var personColumn;
var temp = false;
var reload
var currentIndex = 0;
var pastGame;
var count = 0;
function loadRandomGame(){
    currentGame = loadGames();
    console.log(currentGame);
    document.querySelector(".programer").innerHTML = "programer: " + currentGame.programer;

    pastGame = currentGame;
    render(currentGame);
    document.getElementById('donee').style.display = 'none'
}

function reloadGame(){
    console.log("------------------------------")
    console.log("|pastGame|", pastGame)
    console.log("|currentGame|", currentGame);
    console.log("------------------------------")
    
    render(pastGame);
}

function render(currentGame){ 
  
    
    console.log("currentGame", currentGame)
    var makeUp = '<table>'
    
    var columns = currentGame.maxWidth;
    var rows = currentGame.height;
    var width = Math.floor((window.innerWidth - 100)/columns)
    while(width * rows > window.innerHeight - 200){
        width -= 20;
    }
    for (var row = 0; row < rows; row++){
        makeUp += createRow(width, columns, row, currentGame)
    }

    makeUp += '</table>'
    document.getElementById("app").innerHTML = makeUp
    if(winer(currentGame)){
        console.log("WINNER");
        return;
    }
}

function count(){

}

function loadGames(){
    var rawData = boards[0].split(';')
    var len = rawData.length;
    var gameNo = Math.floor(Math.random()*len-1);
    // while(currentIndex + 1 < len){
        var data = rawData[gameNo].split("\n").filter(function(element){
            return element !== ''
        })
        
        data.shift();
        console.log("data", data);
        // console.log("rawData", rawData)
        //  console.log("data",data)
        var max = 0;
        data.forEach(function(element){
            if (element.length > max){
                max = element.length
            }  

        })
        targets = 0;
        boxes = 0;
        boxesOnTarget = 0;
        for (var row = 0; row < data.length; row++){
            for(var column = 0; column < max; column++){
                if (data[row][column] === TARGET || data[row][column] === PERSON_ON_TARGET){
                    targets++;
                    // console.log("targets", targets[currentIndex])
                }else if (data[row][column] === BOX_ON_TARGET){
                    boxesOnTarget++;
                    boxes++;
                    targets++;
                }else if (data[row][column] === BOX){
                    boxes++;
                }else if (data[row][column] === PERSON){
                    personColumn = column;
                    personRow = row;
                }
            }
        }
        // console.log("targets", targets[currentIndex])
        // console.log("boxes", boxes[currentIndex])
        // console.log("boxesOnTarget", boxesOnTarget[currentIndex])

        
        var game = {
            author: 'Code la ghien',
            programer: 'Văn Tiếnnn',
            level: rawData[gameNo+1].split("\n")[0],
            height: data.length,
            maxWidth: max,
            targets: targets,
            boxes: boxes,
            boxesOnTarget: boxesOnTarget,
            personRow: personRow,
            personColumn: personColumn,
            data: data
        };

        // games.push(game)
        // console.log(game)
        
        // currentIndex++;
        
    // }
    return game;
}

function createRow(width, columns, row, currentGame){
    var makeUp = `<tr style= "width: ${width}px; height: ${width}px">`;
    var hitWall = false;
    for ( var column = 0; column < columns; column++){
        makeUp += '<td>';    
        switch(currentGame.data[row][column]){
            case WALL:
                hitWall = true
                makeUp += `<img src="./Img/wall.png" style= "width: ${width}px; height: ${width}px">`;
                break;
            case PERSON:
                makeUp += `<img src="./Img/person.png" width="${width}" height="${width}" />`;
                break;
            case PERSON_ON_TARGET:
                makeUp += `<img src="./Img/person.png" width="${width}" height="${width}" />`;
                break;
            case TARGET:
                makeUp += `<img src="./Img/target.png" width="${width}" height="${width}" />`;
                break;
            case BOX:
                makeUp += `<img src="./Img/box0.png" width="${width}" height="${width}" />`;
                break;
            case BOX_ON_TARGET:
                makeUp += `<img src="./Img/box1.png" width="${width}" height="${width}" />`;
                break;
            case PATH:
                if (hitWall)
                    makeUp += `<img src="./Img/path.png" width="${width}" height="${width}" />`;
                else
                    makeUp += `<img src="./Img/blank.png" width="${width}" height="${width}" />`;
                break;
            default:
                makeUp += `<img src="./Img/wall.png" width="${width}" height="${width}" />`;
                break;
        }
        
        makeUp += '</td>';
    }
    makeUp += '</tr>'
    return makeUp;
}

document.onkeydown = function(e){
    console.log(e.keyCode);
    switch(e.keyCode){
        case 87:{
            console.log("UP");
            doMove(UP);
            break;
        }
        case 68:{
            console.log("right");
            doMove(RIGHT);
            break;
        }
        case 83:{
            console.log("down");
            doMove(DOWN);
            break;
        }
        case 65:{
            console.log("left");
            doMove(LEFT);
            break;
        }
    }
}

function doMove(direction){

    var x0 = currentGame.personColumn
    var y0 = currentGame.personRow
    var x1 = 0;
    var y1 = 0;
    switch(direction){
        case UP:{
            y1--;
            break;
        }
        case RIGHT:{
            x1++;
            break;
        }
        case DOWN:{
            y1++;
            break;
        }
        case LEFT:{
            x1--;                                                                                                                                                                          
        }
        
    }
    // currentGame.data[y0+y1][x0+x1] = PERSON
    // currentGame.data[x0][y0] = TARGET
    // currentGame.personRow = y0 + y1
    // currentGame.personColumn = x0 + x1
    
    if (
        currentGame.data[y0+y1][x0+x1] === PATH ||
        currentGame.data[y0+y1][x0+x1] === TARGET 
    ){
        currentGame.data[y0] =
            currentGame.data[y0].substr(0, x0) +
            (currentGame.data[y0][x0] === PERSON_ON_TARGET ? TARGET : PATH) +
            currentGame.data[y0].substr(x0+1);
        
        currentGame.data[y0+y1] = 
            currentGame.data[y0+y1].substr(0, x0+x1) +
            (currentGame.data[y0+y1][x0+x1] === TARGET ? PERSON_ON_TARGET : PERSON) + 
            currentGame.data[y0+y1].substr(x0+x1+1)
        
        currentGame.personColumn = x0 + x1;
        currentGame.personRow = y0 + y1
    }
    else if (currentGame.data[y0+y1][x0+x1] === BOX ||
        currentGame.data[y0+y1][x0+x1] === BOX_ON_TARGET
    ){
        if (currentGame.data[y0+y1+y1][x0+x1+x1] === TARGET ||
            currentGame.data[y0+y1+y1][x0+x1+x1] === PATH
            ){
                if (
                    currentGame.data[y0+y1+y1][x0+x1+x1] === TARGET &&
                    currentGame.data[y0+y1][x0+x1] !== BOX_ON_TARGET
                    ){
                    currentGame.boxesOnTarget++;
                }
                if (
                    currentGame.data[y0+y1][x0+x1] === BOX_ON_TARGET &&
                    currentGame.data[y0+y1+y1][x0+x1+x1] === PATH
                ){
                    currentGame.boxesOnTarget--;
                }
                currentGame.data[y0] =
                    currentGame.data[y0].substr(0,x0) +
                    (currentGame.data[y0][x0] === PERSON_ON_TARGET ? TARGET : PATH) +
                    currentGame.data[y0].substr(x0+1);
                
                currentGame.data[y0+y1] = 
                    currentGame.data[y0+y1].substr(0,x0+x1) +
                    (currentGame.data[y0+y1][x0+x1] === BOX_ON_TARGET ? PERSON_ON_TARGET : PERSON) +
                    currentGame.data[y0+y1].substr(x0+x1+1);

                currentGame.data[y0+y1+y1] =
                    currentGame.data[y0+y1+y1].substr(0,x0+x1+x1) +
                    (currentGame.data[y0+y1+y1][x0+x1+x1] === TARGET ? BOX_ON_TARGET : BOX) +
                    currentGame.data[y0+y1+y1].substr(x0+x1+x1+1);
                currentGame.personColumn = x0 + x1;
                currentGame.personRow = y0 + y1
            }
    }

    return render(currentGame)
}

function winer(currentGame){
    if (currentGame.boxesOnTarget === currentGame.targets){
        document.getElementById("donee").style.display = 'flex'
        return true;
    }
    return false
}