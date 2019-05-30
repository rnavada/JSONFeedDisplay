/*
 * Q!.
 * 
 */
let keyLeft = 37;
let keyRight = 39;
let jsonResponse = {};
let defaultSelection = 4;
let date = "2019-05-28";
let prefix = "http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=";
let postfix = "&sportId=1"
let maxItems = 16;
let selectedImageIndex = 14;
let currentSelection = {};

function scaleDown (box) {
  let game = document.getElementById("game" + box + 'Image');
  
  game.style.boxShadow = "";
  game.style.transform = "scale(1, 1)";
  game.style.borderColor = "";
}

function scaleUp (box) {
  let game = document.getElementById("game" + box + 'Image');
  
  game.style.boxShadow = ".3rem .3rem .3rem whitesmoke";
  game.style.transform = "scale(1.2, 1.6)";
  game.style.borderColor = "white";
} 


function textUnselect (oldSelection) {
  let gameDescriptionBox = document.getElementById("game" + (oldSelection) + 'Description');
  let teams = jsonResponse.games[oldSelection-1].teams;
  if (teams && teams.home && teams.home.team && teams.home.team.name) {
    gameDescriptionBox.innerHTML = "";
    gameDescriptionBox.style.color = "";
  }
}

function textSelect (newSelection) {
  console.log('textSelect - ', newSelection);

  let game = jsonResponse.games[newSelection - 1];

  if (jsonResponse && jsonResponse.games && jsonResponse.games[newSelection - 1]) {
    let gameDescriptionBox = document.getElementById("game" + (newSelection) + 'Description');
    let teams = jsonResponse.games[newSelection-1].teams;
    if (teams && teams.home && teams.home.team && teams.home.team.name) {
      console.log('teams - ',  teams);
      let team = teams.home.team.name + ' ' + teams.home.score + ", " + teams.away.team.name + ' '+ teams.away.score;  
      let winner = game.decisions.winner.fullName;
      let loser = game.decisions.loser.fullName;
      winner = 'winner: ' + winner;
      loser = 'Loser: ' + loser;
      gameDescriptionBox.style.fontSize = "15px";
      gameDescriptionBox.style.color = "orange";
      gameDescriptionBox.style.marginTop = "60px";
      gameDescriptionBox.style.marginLeft = "1px";
      gameDescriptionBox.style.position = "absolute";
      gameDescriptionBox.style.lineheight = "0px";
      gameDescriptionBox.innerHTML = team + "<br />" + winner + "<br />" + loser + "<br />";
    }
  }
}

function init () {
  
  let game;
  
  maxItems = jsonResponse.totalItems;
  currentSelection.box = defaultSelection;

  for(let i = 0; i < maxItems; i++) {
    let url;
    let gameImageBox;
    let gameHeaderBox;
    let editorial;
    let venue;
    
    gameHeaderBox = document.getElementById('game' + (i+1) + 'Header');
    venue = jsonResponse.games[i].venue;
    if (venue && venue.name) {
      console.log('venue - ',  venue.name);
      gameHeaderBox.innerHTML = venue.name;
      gameHeaderBox.style.fontSize = "large";
      gameHeaderBox.style.color = "orange";
      gameHeaderBox.style.marginBottom = "50px";
    }

    if (jsonResponse.games && jsonResponse.games[i] && jsonResponse.games[i].content && jsonResponse.games[i].content.editorial) {
      editorial = jsonResponse.games[i].content.editorial;
    }

    if (editorial) {
      gameImageBox = document.getElementById('game' + (i+1) + 'Image');
      let url = 'url(' + editorial.recap.mlb.photo.cuts[selectedImageIndex].src + ')';
      gameImageBox.style.backgroundImage = url;
      gameImageBox.style.height = '55%';
    } 
  }

  scaleUp(defaultSelection);
  textSelect(defaultSelection);

}

function onKeydown (e) {

  console.log('onKeydown - ', e.keyCode, e);

  if (e.keyCode !== keyLeft && e.keyCode !== keyRight) {
    return;
  }

  let oldSelection = currentSelection.box;
  let newSelection = currentSelection.box;

  if((oldSelection == 1 && e.keyCode === keyLeft) || ((oldSelection == maxItems && e.keyCode === keyRight))) 
    return;
  
  if (e.keyCode === keyLeft) {
    newSelection--;
  }
  if (e.keyCode === keyRight) {
    newSelection++;
  }

  scaleDown(oldSelection);
  scaleUp(newSelection);
  textUnselect(oldSelection);
  textSelect(newSelection);
  currentSelection.box = newSelection;
}


function main() {

  document.addEventListener('keydown', onKeydown);

  let url =  prefix + date + postfix;
  fetch(url)
  .then(response => response.json())
  .then((json) => {
    if (json && json.dates && json.dates[0]) {
      console.log('response ', json.dates[0]);
      console.log('Items ', json.dates[0].totalItems);
      jsonResponse = json.dates[0];
      
      init();
    } else {
      console.log('No data in response');
    }
  })
  .catch(error => console.error('Error:', error));
}

main();

