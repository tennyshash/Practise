const SHAPES = [
    [
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0],
        [0,1,0,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [1,1,0]
    ],
    [
        [0,1,0],
        [0,1,0],
        [0,1,1]
    ],
    [
        [1,1,0],
        [0,1,1],
        [0,0,0]
    ],
    [
        [0,1,1],
        [1,1,0],
        [0,0,0]
    ],
    [
        [1,1,1],
        [0,1,0],
        [0,1,0]
    ],
    [
        [1,1],
        [1,1],
    ]
]
const COLORS = [
    "#fff",
    "#9b5fe0",
    "#16a4d8",
    "#60dbe8",
    "#8bd346",
    "#efdf48",
    "#f9a52c",
    "#d64e12"
]

const ROWS = 20;
const COLS = 10;

let canvas = document.querySelector("#tetris");
let ScoreBoard= document.querySelector("h2");
let ctx = canvas.getContext("2d");
ctx.scale(30,30);


let pieceObj= null;
let grid= GenerateGrid();
let Score =0;
//console.log(pieceObj);

function generateRandomPiece(){
    let ran = Math.floor(Math.random()*7);
    //console.log(SHAPES[ran]);
    let piece = SHAPES[ran];
    let ColorIndex= ran+1;
    let x=4;
    let y=0;
    return { piece, x, y, ColorIndex};
}
setInterval(NewGamesState,500);
function NewGamesState(){ // to give interval  to piece
    checkGrid();    // checking last row filled
    if(pieceObj==null){
        pieceObj= generateRandomPiece();
        renderPiece();
    }
    MoveDown();
}
function checkGrid(){
    let count=0;
    for(let i=0;i<grid.length;i++){
        let allFilled= true; // checking last row filled
        for(let j=0;j<grid[i].length;j++){
            if(grid[i][j]==0){
                allFilled=false;
            }
        }
        if(allFilled){
            grid.splice(i,1);                       //  deletin filled row
            grid.unshift([0,0,0,0,0,0,0,0,0,0]);    // adding new row
            count++; // for score
        }
    }
    if( count ==1 ){
        Score+=10;
    }else if( count ==2){
        Score+=30;
    }else if( count ==3){
        Score+=50;
    }else if( count >3){
        Score+=100;
    }
    ScoreBoard.innerHTML = "Score " + Score; // update the score
}
function renderPiece(){
    let piece = pieceObj.piece;
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++)
        if(piece[i][j]==1){
            ctx.fillStyle = COLORS[pieceObj.ColorIndex];
            ctx.fillRect(pieceObj.x+j,pieceObj.y+i,1,1);
        }
    }
}
function MoveDown(){
    if(!Collision(pieceObj.x,pieceObj.y+1))
        pieceObj.y+=1;
    else{    // when we collide with bottom  now that piecec is nuseless so to fill the grid with the piece color 
            //  here we filling of color is donne in render grid and here we are storing the color inn  grid.
        let piece=pieceObj.piece; //
        for( let i=0;i<piece.length;i++){
            for(let j=0;j<piece[i].length;j++){
                if(piece[i][j]==1){
                    let p=pieceObj.x+j;
                    let q=pieceObj.y+i;
                    grid[q][p]=pieceObj.ColorIndex;
                }
                }
        }
        if(pieceObj.y==0){  // when grid gets filled up 
            alert(`Game Over \nYour Score-${Score}`);   // game over // search for beck tick.
            grid=GenerateGrid();  //  new game
            Score =0;
        }
        pieceObj=null;
    }
    //renderPiece();
    RenderGrid();
}
function MoveLeft(){
    if(!Collision(pieceObj.x-1,pieceObj.y))
        pieceObj.x-=1;
    RenderGrid();
}
function MoveRight(){
    if(!Collision(pieceObj.x+1,pieceObj.y))
        pieceObj.x+=1;
    RenderGrid();
}
function rotate(){
    let rotateedPiece=[];
    let piece=pieceObj.piece;
    for(let i=0;i<piece.length;i++){
        rotateedPiece.push([]);
        for(let j=0;j<piece[i].length;j++){
            rotateedPiece[i].push(0);
        }
    }
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            rotateedPiece[i][j]=piece[j][i];
        }
    }
    for(let i=0;i<rotateedPiece.length;i++){
        rotateedPiece[i]=rotateedPiece[i].reverse();
    }
    if(!Collision(pieceObj.x,pieceObj.y,rotateedPiece)) // checking collison for rotated piece..
        pieceObj.piece=rotateedPiece;
    RenderGrid();
}
function Collision(x,y,rotateedPiece){ // to keep the piece  inside the box  or to check collision
    let piece=rotateedPiece || pieceObj.piece;
    for(let i=0;i<piece.length;i++){
        for(let j=0;j<piece[i].length;j++){
            if(piece[i][j]==1){
                let p=x+j;
                let q=y+i;
                if( p>=0 && p<COLS && q>=0 && q<ROWS){
                    if(grid[q][p]>0)    return true; // collision between object.
                }else return true; // there is a collosion
            }
        }
    }return false;
}
function GenerateGrid(){ // representation of the cancas as grid is repressentation of data in array form
    let grid = [];
    for( let i=0;i<ROWS;i++){
        grid.push([]);
        for(let j=0;j<COLS;j++){
            grid[i].push(0);
        }
    }
    return grid;
}
function RenderGrid(){
    for(let i=0;i<grid.length;i++){
        for(let j=0;j<grid[i].length;j++){
            ctx.fillStyle = COLORS[grid[i][j]];
            ctx.fillRect(j,i,1,1);
        }
    }
    renderPiece();
}
document.addEventListener("keydown", function(e){ // keyboard input
    //console.log(e);
    let key =e.code;
    if(key=="ArrowDown"){
        MoveDown();
    }
    else if(key=="ArrowLeft"){
        MoveLeft();
    }else if(key=="ArrowRight"){
        MoveRight();
    }else if(key=="ArrowUp"){
        rotate();
    }
})