/*
 * Q!.
 * 
 */
let keyLeft = 37;
let keyRight = 39;
let jsonResponse = {};
let defaultSelection = 4;
let date = "2019-05-08";
let prefix = "http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=";
let postfix = "&sportId=1"
let maxItems = 16;
let selectedImageIndex = 14;
let currentSelection = {};

function scaleDown (box) {
  let game = document.getElementById("game" + box);
  game.style.backgroundColor = "grey";
  game.style.boxShadow = "";
  game.style.transform = "scale(1, 1)";
  game.style.borderColor = "";
}

function scaleUp (box) {
  let game = document.getElementById("game" + box);
  game.style.backgroundColor = "#0f82db";
  game.style.boxShadow = ".3rem .3rem .3rem whitesmoke";
  game.style.transform = "scale(1.2, 1.7)";
  game.style.borderColor = "white";
} 


function textUnselect (oldSelection) {
  console.log('textUnselect - ', oldSelection);

  let game = document.getElementById("game" + oldSelection + "Headline");
  game.style.backgroundColor = "";
  game.style.color = "";
  game.innerHTML = "";

  let description = document.getElementById("game" + oldSelection + "Description");
  description.style.color = "";
  description.innerHTML = "";
  
}

function textSelect (newSelection) {
  if (jsonResponse && jsonResponse.games && jsonResponse.games[newSelection - 1]) {
    let venue = jsonResponse.games[newSelection - 1].venue;
    if (venue && venue.name) {
      console.log('venue - ',  venue.name);
      let headline = document.getElementById("game" + newSelection + "Headline");
      headline.style.color = "orange";
      headline.innerHTML = venue.name;
    }

    let teams = jsonResponse.games[newSelection - 1].teams;
    if (teams && teams.home && teams.home.team && teams.home.team.name) {
      console.log('team - ',  teams.home.team.name);
      console.log('team - ',  teams.away.team.name);


      let description = document.getElementById("game" + newSelection + "Description");
      description.style.color = "orange";
      description.innerHTML = teams.home.team.name + " Vs " + teams.away.team.name;
    }
  }  
}

function setImages () {
  console.log('setImages');

  let game;
  let url;

  for(let i = 0; i < maxItems; i++) {
    game = document.getElementById("game" + (i+1));
    let editorial;
    if (jsonResponse.games && jsonResponse.games[i] && jsonResponse.games[i].content && jsonResponse.games[i].content.editorial) {
      editorial = jsonResponse.games[i].content.editorial;
    }

    if (editorial) {
      if (editorial.recap && editorial.recap.mlb && editorial.recap.mlb.photo && 
        editorial.recap.mlb.photo.cuts && editorial.recap.mlb.photo.cuts[selectedImageIndex] && editorial.recap.mlb.photo.cuts[selectedImageIndex].src) {
        url = "url(" + editorial.recap.mlb.photo.cuts[selectedImageIndex].src + ")";
        console.log('backgroundImage str - ', url);
        game.style.backgroundImage = url;
      }
    }
  }  
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
      currentSelection.box = defaultSelection;
      setImages();
      scaleUp(currentSelection.box);
      textSelect(currentSelection.box);
    } else {
      console.log('No data in response');
    }
  })
  .catch(error => console.error('Error:', error));
}

main();

