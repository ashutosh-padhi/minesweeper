var bombs = [];
var model = [];
var bombList = [];
var gameOver = false;

function initializeModel(){
  for (var row=0; row<18;row++){
    var eachRow = [];
    for (var col=0; col<10; col++){
      eachRow[col] = 0;
    }
    model.push(eachRow);
  }
}

function generateBombs(){
  var maxBombLimit = 26;
  var counter = 0;
  while (counter < maxBombLimit){
    var loc = Math.floor(Math.random()*180);
    if (isThr(loc)) continue;
    else{
      bombs.push(loc);
      counter++;
    }
  }
}
function isThr(num){
  return bombs.indexOf(num)!=-1?true:false;
}

function putBombs(){
  for(var bomb of bombs){
    var row = Math.floor(bomb/10);
    var col = bomb%10;
    bombList.push(hashLoc([row,col]));
    generateCount([row,col]);
    model[row][col] = 'b';
  }
}
// point = [row, col]
function generateCount(point){
  for (var dir of findAllPossibleNeighbours(point)){
    var newLoc = gotoloc(dir,point);
    if (model[newLoc[0]][newLoc[1]]=='b') continue;
    else model[newLoc[0]][newLoc[1]]++;
  }
}
function gotoloc(dir,point){
  var row = point[0];
  var col = point[1];
  switch(dir){
    case 'l': return [row, col-1];
    case 'r': return [row, col+1];
    case 't': return [row-1, col];
    case 'b': return [row+1, col];
    case 'lt': return [row-1, col-1];
    case 'rt': return [row-1, col+1];
    case 'lb': return [row+1, col-1];
    case 'rb': return [row+1, col+1];
  }
}
var list = [];
function findAllPossibleNeighbours(point){
  list = [];
  var rowMax = 17;
  var colMax = 9;
  var row = point[0];
  var col = point[1];
  if (row>0)
    list.push('t');
  if (row<rowMax)
    list.push('b');
  if (col>0)
    list.push('l');
  if (col<colMax)
    list.push('r');
  if (isThrDir('l')&&isThrDir('t'))
    list.push('lt');
  if (isThrDir('r')&&isThrDir('t'))
    list.push('rt');
  if (isThrDir('l')&&isThrDir('b'))
    list.push('lb');
  if (isThrDir('r')&&isThrDir('b'))
    list.push('rb');
  return list;
}
function isThrDir(dir){
  return list.indexOf(dir)!=-1?true:false;
}
var zeroList = [];
var hashList = [];
function selectZeros(point){
  for (var dir of findAllPossibleNeighbours(point)){
    var newLoc = gotoloc(dir,point);
    if (notThere(newLoc)){
      if (model[newLoc[0]][newLoc[1]]==0){
          zeroList.push(newLoc);
          hashList.push(hashLoc(newLoc));
          search(newLoc,dir);
      }else if (model[newLoc[0]][newLoc[1]]>0 && model[newLoc[0]][newLoc[1]]<9){
          zeroList.push(newLoc);
          hashList.push(hashLoc(newLoc));
      }
    }
  }
}
function search(point, dir){
  for (var dir of findAllPossibleNeighbours(point)){
    var newLoc = gotoloc(dir,point);
    if (notThere(newLoc)){
      if (model[newLoc[0]][newLoc[1]]==0){
          zeroList.push(newLoc);
          hashList.push(hashLoc(newLoc));
          search(newLoc,dir);
      }else if (model[newLoc[0]][newLoc[1]]>0 && model[newLoc[0]][newLoc[1]]<9){
          zeroList.push(newLoc);
          hashList.push(hashLoc(newLoc));
      }
    }
  }
}
function hashLoc(point){
  return point[0]*10+point[1];
}
function notThere(point){
  return hashList.indexOf(hashLoc(point))==-1?true:false;
}
function filter(dirList,dir){
  var newDirList = [];
  switch(dir){
    case 't':
      if (dirList.indexOf('t')!=-1) newDirList.push('t');
      break;
    case 'l':
      if (dirList.indexOf('l')!=-1) newDirList.push('l');
      break;
    case 'b':
      if (dirList.indexOf('b')!=-1) newDirList.push('b');
      break;
    case 'r':
      if (dirList.indexOf('r')!=-1) newDirList.push('r');
      break;
    case 'lt':
      if (dirList.indexOf('l')!=-1) newDirList.push('l');
      if (dirList.indexOf('t')!=-1) newDirList.push('t');
      if (dirList.indexOf('lt')!=-1) newDirList.push('lt');
      break;
    case 'lb':
      if (dirList.indexOf('l')!=-1) newDirList.push('l');
      if (dirList.indexOf('b')!=-1) newDirList.push('b');
      if (dirList.indexOf('lb')!=-1) newDirList.push('lb');
      break;
    case 'rt':
      if (dirList.indexOf('r')!=-1) newDirList.push('r');
      if (dirList.indexOf('t')!=-1) newDirList.push('t');
      if (dirList.indexOf('rt')!=-1) newDirList.push('rt');
      break;
    case 'rb':
      if (dirList.indexOf('r')!=-1) newDirList.push('r');
      if (dirList.indexOf('b')!=-1) newDirList.push('b');
      if (dirList.indexOf('rb')!=-1) newDirList.push('rb');
      break;
  }
  return newDirList;
}
var bombCount=26;
var mark = false;
var foundBombList = [];
var tds = document.getElementsByTagName("td");
for (var counter=0; counter<tds.length; counter++){
  tds[counter].onclick = handler;
}
function handler(evt){
  id = evt.target.id;
  var point = getPointFromId(id);
  var element = document.getElementById('R'+point[0]+'C'+point[1]);
  if (!gameOver){
    if (!mark){
      if (model[point[0]][point[1]]=='b'){
        if (foundBombList.indexOf(hashLoc(point))==-1){
          document.getElementById('status').classList.remove('hide');
          document.getElementById('status').innerHTML = 'Game Over';
          gameOver = true;
          deMystify();
        }
      }
      else if (model[point[0]][point[1]]>0 && model[point[0]][point[1]]<9){
        element.classList.remove('hidden');
        element.classList.add('disclosed');
        element.innerHTML = model[point[0]][point[1]];
      }else if (model[point[0]][point[1]]==0){
        zeroList = [];
        selectZeros(point);
        for (var point of zeroList){
          if (model[point[0]][point[1]]>0 && model[point[0]][point[1]]<9)
            document.getElementById('R'+point[0]+'C'+point[1]).innerHTML = model[point[0]][point[1]];
          document.getElementById('R'+point[0]+'C'+point[1]).classList.remove('hidden');
          document.getElementById('R'+point[0]+'C'+point[1]).classList.add('disclosed');
        }
      }
    }else if (mark){
      var pointIndex = foundBombList.indexOf(hashLoc(point));
      var isWon = false;
      if (pointIndex==-1){
        foundBombList.push(hashLoc(point));
        bombCount--;
        document.getElementById('bomb-count').innerHTML = bombCount;
        document.getElementById('R'+point[0]+'C'+point[1]).classList.add('flag');
      }else{
        bombCount++;
        document.getElementById('bomb-count').innerHTML = bombCount;
        document.getElementById('R'+point[0]+'C'+point[1]).classList.remove('flag');
        foundBombList.splice(pointIndex,1);
      }
      if (bombCount==0){
        isWon = true;
        console.log(bombList);
        for (var eachBomb of foundBombList){
          if (bombList.indexOf(eachBomb)==-1){
            isWon = false;
            console.log(eachBomb);
          } 
        }
      }
      if (isWon){
        gameOver = true;
        document.getElementById('status').classList.remove('hide');
        document.getElementById('status').innerHTML = 'Won';
      }
    }
  }
}
function getPointFromId(id){
  var pattern = /[0-9]+/g
  var result = id.match(pattern);
  return [parseInt(result[0]), parseInt(result[1])];
}
function deMystify(){
  for (var row=0; row<18;row++){
    for (var col=0; col<10; col++){
      var content = model[row][col];
      var element = document.getElementById('R'+row+'C'+col);
      element.classList.remove('hidden');
      element.classList.add('disclosed');
      if (content==0) continue
      else if (content>0 && content<9)
        element.innerHTML=content;
      else if (content=='b'){
        if (foundBombList.indexOf(hashLoc([row,col]))==-1)
          element.classList.add('bomb');
      }else console.log('cell content: '+content);
    }
  }
}
function initializeStage(){
  for (var row=0; row<18;row++){
    for (var col=0; col<10; col++){
      document.getElementById('R'+row+'C'+col).className = 'hidden';
      document.getElementById('R'+row+'C'+col).innerHTML = '';
    }
  }
  document.getElementById('game-board').className = 'cursor-pointer';
  document.getElementById('bomb-count').innerHTML = bombCount;
  document.getElementById('status').innerHTML = '';
  document.getElementById('status').classList.add('hide');
  document.getElementById('time').innerHTML = '00:00:00'
}
function markBomb(){
  mark = true;
  document.getElementById('game-board').className = 'cursor-flag';
}
function mine(){
  mark = false;
  document.getElementById('game-board').className = 'cursor-pointer';
}
function bootStart(){
  bombCount=26;
  mark = false;
  foundBombList = [];
  zeroList = [];
  hashList = [];
  list = [];
  bombs = [];
  model = [];
  bombList = [];
  gameOver = false;
  sec = 0;
  min = 0;
  hour = 0;
  initializeModel();
  generateBombs();
  putBombs();
  initializeStage();
}
var sec = 0;
var min = 0;
var hour = 0;
function timeHandler(){
  sec++;
  if (sec==59){
    sec=0;
    min++;
  }
  if (min==59){
    min=0;
    hour++;
  }
  document.getElementById('time').innerHTML = timeAdjust(hour)+':'+timeAdjust(min)+':'+timeAdjust(sec);
}
function timeAdjust(num){
  if(num>=0 && num<=9)
    return '0'+num;
  else return num;
}
setInterval(timeHandler,1000);
bootStart();

// $(document).ready(function() {
//     $('td').click(function (event) { 
//       alert("hello"+this.id);
//     });
// });