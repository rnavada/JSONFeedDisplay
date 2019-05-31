
let mlb  = (function (){

  'use strict';
  let defaultSelection = 4;
  let maxItems = 16;
  let selectedImageIndex = 14; //Index of the Photo from editorial object
  let prefix = "http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=";
  let postfix = "&sportId=1"
  let keyLeft = 37;
  let keyRight = 39;
  let jsonResponse = {};
  let currentSelection = {};
  let i = 1;
  let gamesContainerLeftPos = 0;


  function scaleDown (box) {
    let game = document.getElementById("game" + box + 'Image');
    
    game.style.boxShadow = "";
    game.style.transform = "scale(1, 1)";
    game.style.borderColor = "";
  }

  function scaleUp (box) {
    let game = document.getElementById("game" + box + 'Image');

    game.style.boxShadow = ".3rem .3rem .3rem whitesmoke";
    game.style.transitionDuration = "3s";
    game.style.transform = "scale(1.2, 1.6)";
  } 


  function deleteText (oldSelection) {
    let gameDescriptionBox = document.getElementById("game" + (oldSelection) + 'Description');
    let teams = jsonResponse.games[oldSelection-1].teams;
    if (teams && teams.home && teams.home.team && teams.home.team.name) {
      gameDescriptionBox.innerHTML = "";
      gameDescriptionBox.style.color = "";
    }
  }

  function insertText (newSelection) {
    console.log('insertText - ', newSelection);

    let game; 
    if (jsonResponse && jsonResponse.games && jsonResponse.games[newSelection - 1]) {
      game = jsonResponse.games[newSelection - 1];
      //console.log('game - ', game);
    }

    if (game) {
      let gameDescriptionBox = document.getElementById("game" + (newSelection) + 'Description');
      let teams = game.teams;
      
      if (teams && teams.home && teams.away && teams.home.team && teams.away.team && teams.home.team.name && teams.away.team.name &&
        (typeof teams.home.score === 'number') && (typeof teams.away.score === 'number')) {
        //console.log('teams - ',  teams);
        let team = teams.home.team.name + ' ' + teams.home.score + ", " + teams.away.team.name + ' '+ teams.away.score;  
        let winner;
        let loser;

        if (game.decisions && game.decisions.winner && game.decisions.winner.fullName) {
          winner = game.decisions.winner.fullName;
        }

        if (game.decisions && game.decisions.loser && game.decisions.loser.fullName) {
          loser = game.decisions.loser.fullName;
        }

        if (winner && loser) {
          winner = 'Winner: ' + winner;
          loser = 'Loser: ' + loser;
          gameDescriptionBox.style.fontSize = "15px";
          gameDescriptionBox.style.color = "orange";
          gameDescriptionBox.style.marginTop = "60px";
          gameDescriptionBox.style.marginLeft = "1px";
          gameDescriptionBox.style.position = "absolute";
          gameDescriptionBox.style.lineheight = "0px";
          gameDescriptionBox.style.transitionDuration = "3s";
          gameDescriptionBox.innerHTML = team + "<br />" + winner + "<br />" + loser + "<br />";
        }
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
        if (editorial.recap && editorial.recap.mlb && editorial.recap.mlb.photo && editorial.recap.mlb.photo.cuts &&
          editorial.recap.mlb.photo.cuts[selectedImageIndex] && editorial.recap.mlb.photo.cuts[selectedImageIndex].src) {
          gameImageBox = document.getElementById('game' + (i+1) + 'Image');
          let url = 'url(' + editorial.recap.mlb.photo.cuts[selectedImageIndex].src + ')';
          gameImageBox.style.backgroundImage = url;
          gameImageBox.style.height = '55%';
        }
      } 
    }
    console.log('about to insert text ');
    scaleUp(defaultSelection);
    insertText(defaultSelection);
    document.addEventListener('keydown', onKeydown);

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
    
    let gamesContainer = document.getElementById("flex-container");
    if (e.keyCode === keyLeft) {
      newSelection--;
      let newLeft = (220 * i);
      console.log('newSelection ' + newSelection + ' i ' + i);
      var id = setInterval(() => {
        if (gamesContainerLeftPos >= newLeft) {
          console.log('gamesContainerLeftPos ', gamesContainerLeftPos);
          clearInterval(id);
        } else {
          gamesContainerLeftPos = gamesContainerLeftPos + 1; 
          gamesContainer.style.left = gamesContainerLeftPos + 'px'; 
          
        }
      }, 3);
      i++;
    }

    if (e.keyCode === keyRight) {
      newSelection++;
      let newLeft = (220 * i);
      console.log('newSelection ' + newSelection + ' i ' + i);
      let id = setInterval(() => {
        if (gamesContainerLeftPos <= newLeft) {
          console.log('gamesContainerLeftPos ', gamesContainerLeftPos);
          clearInterval(id);

        } else {
          gamesContainerLeftPos = gamesContainerLeftPos - 1; 
          gamesContainer.style.left = gamesContainerLeftPos + 'px'; 
        }
      }, 3);
      i--;
    }
    scaleDown(oldSelection);
    scaleUp(newSelection);
    deleteText(oldSelection);
    insertText(newSelection);
    currentSelection.box = newSelection;
  }

  return {
    displayResults: function (date) {
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
  }
})();

 
mlb.displayResults(getUrlVars().date);

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
    vars[key] = value;
  });
  return vars;
}