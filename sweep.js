var board, global_size, global_mines, mines_placed = false, revealedTiles = 0;

window.onload = function () {
  var size, mines, minBoardSize = 5, maxBoardSize = 30, minMines = 10;
  size = getNumericInput("Enter the size of the board [" + minBoardSize
    + "-" + maxBoardSize + "] ", minBoardSize, maxBoardSize);
  maxMines = size * size - 9
  global_size = size;
  mines = getNumericInput("Enter the amount of mines [" + minMines + "-" + maxMines + "] ", minMines, maxMines);
  global_mines = mines;
  createBoard(size, mines);
}
function getNumericInput(message, minimum, maximum) {
  var input, failedText = "";
  while(true) {
    input = prompt(failedText + message);
    if(isNaN(input)) {
      failedText = "Please enter a number. ";
    }
    else if (input < minimum) {
      failedText = "Please enter at least " + minimum + ". ";
    }
    else if (input > maximum) {
      failedText = "Please enter at most " + maximum + ". ";
    }
    else {
      return input;
    }
  }
}

function createBoard(size, mines) {
  //Create HTML component of board
  var file = "";
  file += "<table>";
  for(var i = 0; i < size; i++)
  {
    file += "<tr>";
    for(var j = 0; j < size; j++)
    {
      file += "<td><img id = \""+i+ "_" + j+"\" src = \"images\\notpressed.png\" onclick = \"buttonClicked(" + i + "," + j + ")\" oncontextmenu = \"rightClicked(" + i + "," + j + ")\"> </img></td>";
    }
    file += "</tr>";
  }
  file += "</table>";
  document.getElementById("board").innerHTML = file;

  //Create contents of board Array
  addTilesToBoard(size);
}

function createTile() {
  var tile = new Object();
  tile.isBomb = false;
  tile.value = 0;
  tile.revealed = false;
  tile.cannotBeBomb = false;
  tile.flagged = false;
  return tile;
}

function addTilesToBoard(size) {
  board = new Array(size);
  //Fixed bug: using shorthand for doesn't work here, it only loops once for some reason
  for(var i = 0; i < size; i++) {
    board[i] = new Array(size);
    for(var j = 0; j < size; j++) {
      board[i][j] = createTile();
      //alert(i + " " + j);
    }
  }
}

function addMinesToBoard(size, mines) {
  var x, y;
  for(var i = 0; i < mines; i++)
  {
    x = Math.floor((Math.random() * size));
    y = Math.floor((Math.random() * size));
    if(board[x][y].isBomb || board[x][y].cannotBeBomb)
      i--;
    else {
      board[x][y].isBomb = true;
      callOnAllPositionsAround(x, y, size, function(x_other, y_other) {
        board[x_other][y_other].value += 1;
      });
      // for(var x_ajacent = x - 1; x_ajacent <= x + 1; x_ajacent++) {
      //   for(var y_ajacent = y - 1; y_ajacent <= y + 1; y_ajacent++) {
      //     if(x_ajacent < 0 || x_ajacent >= size || y_ajacent < 0 || y_ajacent >= size)
      //       continue;
      //     else if (x_ajacent == x && y_ajacent == y)
      //       continue;
      //     else {
      //         board[x_ajacent][y_ajacent].value += 1;
      //       }
      //   }
      // }
    }
  }
}

function buttonClicked(i, j) {
  click_tile(i, j);
  if(revealedTiles == global_size * global_size - global_mines) {
    alert("You win!");
    showAllTiles();
  }
}

function click_tile(i, j) {
  if(mines_placed == false)
  {
      board[i][j].cannotBeBomb = true;
      callOnAllPositionsAround(i, j, global_size, function(x, y) {
        board[x][y].cannotBeBomb = true;
      });
      addMinesToBoard(global_size, global_mines);
      mines_placed = true;
  }
  if(board[i][j].revealed == true)
    return;
  revealedTiles++;
  //alert("Mine at " + i + " " + j + " has value " + board[i][j].value + " and isBomb = " + board[i][j].isBomb);
  if(board[i][j].isBomb)
  {
    //User clicked on a bomb, so reveal the board
    showAllTiles();
    //Give a special texture to the bomb they clicked on
    document.getElementById(i + "_" + j).setAttribute("src","images\\bombClicked.png");
  }
  else {
    revealTile(i,j);
    if(board[i][j].value == 0)
      callOnAllPositionsAround(i, j, global_size, click_tile)
  }
}

function victory() {
  showAllTiles();
  alert("You won!");
}

function showAllTiles() {
  for(var keyi in board) {
    for(var keyj in board[keyi]) {
      revealTile(keyi, keyj);
    }
  }
}

function revealTile(i, j) {
  if(board[i][j].isBomb) {
    document.getElementById(i + "_" + j).setAttribute("src","images\\bomb.png");
  }
  else {
    document.getElementById(i + "_" + j).setAttribute("src","images\\" + board[i][j].value + ".png");
  }
  board[i][j].revealed = true;
}

function callOnAllPositionsAround(x, y, size, callback) {
  for(var x_ajacent = x - 1; x_ajacent <= x + 1; x_ajacent++) {
    for(var y_ajacent = y - 1; y_ajacent <= y + 1; y_ajacent++) {
      if(x_ajacent < 0 || x_ajacent >= size || y_ajacent < 0 || y_ajacent >= size)
        continue;
      else if (x_ajacent == x && y_ajacent == y)
        continue;
      else {
          callback(x_ajacent, y_ajacent);
        }
    }
  }
}

function rightClicked(i, j) {
  if(board[i][j].revealed) {

  }
  else if (board[i][j].flagged == true) {
    document.getElementById(i + "_" + j).setAttribute("src","images\\notpressed.png");
    board[i][j].flagged = false;
  }
  else if (board[i][j].flagged == false){
    document.getElementById(i + "_" + j).setAttribute("src","images\\flag.png");
    board[i][j].flagged = true;
  }
}

document.oncontextmenu = function() {return false;}
