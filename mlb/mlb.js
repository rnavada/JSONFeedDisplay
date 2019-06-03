

/** @module mlb */

let mlb  = (function (){

  'use strict';

  const KEY_LEFT = 37;
  const KEY_RIGHT = 39;
  const KEY_ENTER = 13;
  const KEY_ESCAPE = 27;

  const INITIAL_SCALED_GAME = 4
  const GAME_BOX_WIDTH = 240;
  const TEXT_TRANSITION_DURATION_SECONDS = 4;
  const IMAGE_SCALE_DURATION_SECONDS = 3;
  const GAMES_CONTAINER_TRANSITION_DURATION_SECONDS = 3;
  const IMAGE_SCALE_X = 1.2;
  const IMAGE_SCALE_Y = 1.6;
  const GAME_IMAGE_BOX_HEIGHT_PERCENT = 55;
  const EDITORIAL_IMAGE_INDEX = 14; 

  /* Description Text Values */
  const GAME_DESCRIPTION_BOX_FONT_SIZE = 15;
  const GAME_DESCRIPTION_BOX_COLOR = "orange";
  const GAME_DESCRIPTION_MARGIN_TOP = 60;
  const GAME_DESCRIPTION_MARGIN_LEFT = 1;
  const GAME_DESCRIPTION_POSITION = "absolute";
  const GAME_DESCRIPTION_LINE_HEIGHT = 0;

  /* Header Text Values */
  const GAME_HEADER_BOX_FONT_SIZE = "large";
  const GAME_HEADER_BOX_COLOR = "orange";
  const GAME_HEADER_BOX_MARGIN_BOTTOM = 50;

  let _prefix = "http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),score,decisions&date=";
  let _postfix = "&sportId=1"

  let _jsonResponse = {};
  let _selectedGame;
  let _gamesContainerLeftPos = 0;

  function _scaleDown (box) {
    let game = document.getElementById("game" + box + 'Image');
    
    game.style.boxShadow = "";
    game.style.transform = "scale(1, 1)";
    game.style.borderColor = "";
  }

  function _scaleUp (box) {
    let game = document.getElementById("game" + box + 'Image');

    game.style.boxShadow = ".3rem .3rem .3rem whitesmoke";
    game.style.transitionDuration = IMAGE_SCALE_DURATION_SECONDS + 's';
    game.style.transform = 'scale(' + IMAGE_SCALE_X + ',' +  IMAGE_SCALE_Y + ')';
  } 


  function _deleteText (oldSelection) {
    let gameDescriptionBox = document.getElementById("game" + (oldSelection) + 'Description');
    let teams = _jsonResponse.games[oldSelection-1].teams;
    if (teams && teams.home && teams.home.team && teams.home.team.name) {
      gameDescriptionBox.innerHTML = "";
      gameDescriptionBox.style.color = "";
    }
  }

  function _insertText (newSelection) {
    let game; 

    if (_jsonResponse && _jsonResponse.games && _jsonResponse.games[newSelection - 1]) {
      game = _jsonResponse.games[newSelection - 1];
    }
    if(!game)
      return;  

    let gameDescriptionBox = document.getElementById("game" + (newSelection) + 'Description');
    let teams = game.teams;
    
    if (teams && teams.home && teams.away && teams.home.team && teams.away.team && teams.home.team.name && teams.away.team.name &&
      (typeof teams.home.score === 'number') && (typeof teams.away.score === 'number')) {
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
        gameDescriptionBox.style.fontSize = GAME_DESCRIPTION_BOX_FONT_SIZE + 'px';
        gameDescriptionBox.style.color = GAME_DESCRIPTION_BOX_COLOR;
        gameDescriptionBox.style.marginTop = GAME_DESCRIPTION_MARGIN_TOP + 'px';
        gameDescriptionBox.style.marginLeft = GAME_DESCRIPTION_MARGIN_LEFT + 'px';
        gameDescriptionBox.style.position = GAME_DESCRIPTION_POSITION;
        gameDescriptionBox.style.lineheight = GAME_DESCRIPTION_LINE_HEIGHT + 'px';
        gameDescriptionBox.style.transitionDuration = TEXT_TRANSITION_DURATION_SECONDS + "s";
        gameDescriptionBox.innerHTML = team + "<br />" + winner + "<br />" + loser + "<br />";
      }
    }
  }

  function displayFullGameInfo () {

    let game = _jsonResponse.games[_selectedGame - 1];

    console.log('game - ');
    let gamePk = game.gamePk;

    let url = 'https://statsapi.mlb.com/api/v1.1/game/' + gamePk + '/feed/live';
    
    fetch(url)
    .then(response => response.json())
    .then((json) => {
      if (json) {
        console.log('response ', json);

        let overlay = document.getElementById("myNav");
        overlay.style.display = "block";
        overlay.style.marginLeft = '400px';
        overlay.style.marginTop = '100px';
        overlay.style.width = '1200px';
        overlay.style.height = '800px';


        let titleBox = document.getElementById('overlayheader');
        titleBox.style.justifyContent = 'center';

        
        let awayRuns = json.liveData.linescore.teams.away.runs;
        let homeRuns = json.liveData.linescore.teams.home.runs;

        let title = json.gameData.teams.home.teamName + ' ' + homeRuns + ', ' ; 
        title = title + json.gameData.teams.away.teamName + ' ' + awayRuns;

        title = title + "<br />" + json.gameData.datetime.originalDate;
        titleBox.innerHTML = title;

        let innings = json.liveData.linescore.innings;
        let gridContainer = document.getElementById('grid-container-innings');;
        gridContainer.style.display = "flex";
        gridContainer.style.flexdirection = 'row';


        gridContainer = document.getElementById('grid-container-away');;
        gridContainer.style.display = "flex";
        gridContainer.style.flexdirection = 'row';

        gridContainer = document.getElementById('grid-container-home');;
        gridContainer.style.display = "flex";
        gridContainer.style.flexdirection = 'row';


        let index = 1;
        let scoreBox;
        scoreBox = document.getElementById('innings-grid-0');
        scoreBox.style.width = '150px'
        scoreBox.style.backgroundColor = '#2196F3';
        scoreBox.style.borderColor = '#2196F3';
        scoreBox = document.getElementById('away-grid-' + 0);;
        scoreBox.innerHTML = json.gameData.teams.away.teamName + '';
        scoreBox.style.width = '150px'
        scoreBox = document.getElementById('home-grid-' + 0);
        scoreBox.innerHTML = json.gameData.teams.home.teamName + '';
        scoreBox.style.width = '150px'

        innings.forEach((inning) => {
          console.log('inning - ' + index + ' ' + inning.away.runs + ' ' + inning.home.runs);
          scoreBox = document.getElementById('away-grid-' + index);;
          scoreBox.innerHTML = inning.away.runs + '';
          scoreBox = document.getElementById('home-grid-' + index);
          if (typeof inning.home.runs == 'undefined') {
            scoreBox.innerHTML ='x';
          } else {
            scoreBox.innerHTML = inning.home.runs + '';
          }
          index++; 
        });
      } else {
        console.log('No data in game details response');
      }
    })
    .catch(error => console.error('Error:', error));

  }

  function _onKeydown (e) {
    console.log('onKeydown - ', e.keyCode, e);

    if (e.keyCode !== KEY_LEFT && e.keyCode !== KEY_RIGHT && e.keyCode !== KEY_ENTER && e.keyCode !== KEY_ESCAPE) {
      return;
    }

    let oldSelection = _selectedGame;
    let newSelection = _selectedGame;

    if (e.keyCode === KEY_ENTER) {
      displayFullGameInfo();
      return;
    }

    if (e.keyCode === KEY_ESCAPE) {
      document.getElementById("myNav").style.display = "none";
      return;
    }


    if ((oldSelection == 1 && e.keyCode === KEY_LEFT) || ((oldSelection == _jsonResponse.totalItems && e.keyCode === KEY_RIGHT))) 
      return;
    
    let gamesContainer = document.getElementById("flex-container");
    if (e.keyCode === KEY_LEFT) {
      newSelection--;
      let newLeft = (GAME_BOX_WIDTH * (INITIAL_SCALED_GAME - newSelection));
      var id = setInterval(() => {
        if (_gamesContainerLeftPos >= newLeft) {
          clearInterval(id);
        } else {
          _gamesContainerLeftPos = _gamesContainerLeftPos + 1; 
          gamesContainer.style.left = _gamesContainerLeftPos + 'px'; 
        }
      }, GAMES_CONTAINER_TRANSITION_DURATION_SECONDS);
    }

    if (e.keyCode === KEY_RIGHT) {
      newSelection++;
      let newLeft = (GAME_BOX_WIDTH * (INITIAL_SCALED_GAME - newSelection));
      let id = setInterval(() => {
        if (_gamesContainerLeftPos <= newLeft) {
          clearInterval(id);
        } else {
          _gamesContainerLeftPos = _gamesContainerLeftPos - 1; 
          gamesContainer.style.left = _gamesContainerLeftPos + 'px'; 
        }
        
      }, GAMES_CONTAINER_TRANSITION_DURATION_SECONDS);
    }
    _scaleDown(oldSelection);
    _scaleUp(newSelection);
    _deleteText(oldSelection);
    _insertText(newSelection);
    _selectedGame = newSelection;
  }

  function initUi () {
    let game;
    
    let noOfItems = _jsonResponse.totalItems;
    _selectedGame = INITIAL_SCALED_GAME;

    for(let i = 0; i < noOfItems; i++) {
      let url;
      let gameImageBox;
      let gameHeaderBox;
      let editorial;
      let venue;
      
      gameHeaderBox = document.getElementById('game' + (i+1) + 'Header');
      venue = _jsonResponse.games[i].venue;
      if (venue && venue.name) {
        console.log('venue - ',  venue.name);
        gameHeaderBox.innerHTML = venue.name;
        gameHeaderBox.style.fontSize = GAME_HEADER_BOX_FONT_SIZE;
        gameHeaderBox.style.color = GAME_HEADER_BOX_COLOR;
        gameHeaderBox.style.marginBottom = GAME_HEADER_BOX_MARGIN_BOTTOM + 'px';
      }

      let photo  = _jsonResponse.games[i].photo;
      if (photo && photo.cuts[EDITORIAL_IMAGE_INDEX].src) {
        gameImageBox = document.getElementById('game' + (i+1) + 'Image');
        let url = 'url(' + photo.cuts[EDITORIAL_IMAGE_INDEX].src + ')';
        gameImageBox.style.backgroundImage = url;
        gameImageBox.style.height = GAME_IMAGE_BOX_HEIGHT_PERCENT + '%';
      }
    }
    _scaleUp(INITIAL_SCALED_GAME);
    _insertText(INITIAL_SCALED_GAME);
  }

  function processJson(jsonResponse) {

    if(!jsonResponse)
      return;

    _jsonResponse.totalItems = jsonResponse.totalItems;
    _jsonResponse.games = [];

    for(let i = 0; i < _jsonResponse.totalItems; i++) {
      let obj = {};

      if (jsonResponse.games && jsonResponse.games[i]) {

        if (jsonResponse.games[i].venue) 
          obj.venue = jsonResponse.games[i].venue;
        
        if (jsonResponse.games[i].teams)
          obj.teams = jsonResponse.games[i].teams;

        if (jsonResponse.games[i].decisions) {
          obj.decisions = jsonResponse.games[i].decisions;
        }

        obj.gamePk = jsonResponse.games[i].gamePk;

        if (jsonResponse.games[i].content && jsonResponse.games[i].content.editorial) {
          let editorial = jsonResponse.games[i].content.editorial;
          if (editorial && editorial.recap && editorial.recap.mlb && editorial.recap.mlb.photo && editorial.recap.mlb.photo.cuts &&
            editorial.recap.mlb.photo.cuts[EDITORIAL_IMAGE_INDEX] && editorial.recap.mlb.photo.cuts[EDITORIAL_IMAGE_INDEX].src) {
            obj.photo = editorial.recap.mlb.photo;
          }
        }
      }

      _jsonResponse.games.push(obj);
    }
    console.log(_jsonResponse);
   } 

  function registerListeners() {
    document.addEventListener('keydown', _onKeydown);
  }

  return {
    displayResults: function (date) {
      let url =  _prefix + date + _postfix;
      fetch(url)
      .then(response => response.json())
      .then((json) => {
        if (json && json.dates && json.dates[0]) {
          console.log('response ', json.dates[0]);
          processJson(json.dates[0]);
          initUi();
          registerListeners();
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
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, (m,key,value) => {
    vars[key] = value;
  });
  return vars;
}