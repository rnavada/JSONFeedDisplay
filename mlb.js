
let mlb  = (function (){

  'use strict';
  let _defaultSelection = 4;
  let _maxItems = 16;
  let _selectedImageIndex = 14; //Index of the Photo from editorial object
  let _prefix = "http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=";
  let _postfix = "&sportId=1"
  let _keyLeft = 37;
  let _keyRight = 39;
  let _jsonResponse = {};
  let _currentSelection = {};
  let _i = 1;
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
    game.style.transitionDuration = "3s";
    game.style.transform = "scale(1.2, 1.6)";
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
    console.log('insertText - ', newSelection);

    let game; 
    if (_jsonResponse && _jsonResponse.games && _jsonResponse.games[newSelection - 1]) {
      game = _jsonResponse.games[newSelection - 1];
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

  function _init () {
    
    let game;
    
    _maxItems = _jsonResponse.totalItems;
    _currentSelection.box = _defaultSelection;

    for(let i = 0; i < _maxItems; i++) {
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
        gameHeaderBox.style.fontSize = "large";
        gameHeaderBox.style.color = "orange";
        gameHeaderBox.style.marginBottom = "50px";
      }

      if (_jsonResponse.games && _jsonResponse.games[i] && _jsonResponse.games[i].content && _jsonResponse.games[i].content.editorial) {
        editorial = _jsonResponse.games[i].content.editorial;
      }

      if (editorial) {
        if (editorial.recap && editorial.recap.mlb && editorial.recap.mlb.photo && editorial.recap.mlb.photo.cuts &&
          editorial.recap.mlb.photo.cuts[_selectedImageIndex] && editorial.recap.mlb.photo.cuts[_selectedImageIndex].src) {
          gameImageBox = document.getElementById('game' + (i+1) + 'Image');
          let url = 'url(' + editorial.recap.mlb.photo.cuts[_selectedImageIndex].src + ')';
          gameImageBox.style.backgroundImage = url;
          gameImageBox.style.height = '55%';
        }
      } 
    }
    console.log('about to insert text ');
    _scaleUp(_defaultSelection);
    _insertText(_defaultSelection);
    document.addEventListener('keydown', _onKeydown);

  }


  function _onKeydown (e) {
    console.log('onKeydown - ', e.keyCode, e);

    if (e.keyCode !== _keyLeft && e.keyCode !== _keyRight) {
      return;
    }

    let oldSelection = _currentSelection.box;
    let newSelection = _currentSelection.box;

    if((oldSelection == 1 && e.keyCode === _keyLeft) || ((oldSelection == _maxItems && e.keyCode === _keyRight))) 
      return;
    
    let gamesContainer = document.getElementById("flex-container");
    if (e.keyCode === _keyLeft) {
      newSelection--;
      let newLeft = (220 * _i);
      console.log('newSelection ' + newSelection + ' i ' + _i);
      var id = setInterval(() => {
        if (_gamesContainerLeftPos >= newLeft) {
          console.log('_gamesContainerLeftPos ', _gamesContainerLeftPos);
          clearInterval(id);
        } else {
          _gamesContainerLeftPos = _gamesContainerLeftPos + 1; 
          gamesContainer.style.left = _gamesContainerLeftPos + 'px'; 
          
        }
      }, 3);
      _i++;
    }

    if (e.keyCode === _keyRight) {
      newSelection++;
      let newLeft = (220 * _i);
      console.log('newSelection ' + newSelection + ' i ' + _i);
      let id = setInterval(() => {
        if (_gamesContainerLeftPos <= newLeft) {
          console.log('_gamesContainerLeftPos ', _gamesContainerLeftPos);
          clearInterval(id);

        } else {
          _gamesContainerLeftPos = _gamesContainerLeftPos - 1; 
          gamesContainer.style.left = _gamesContainerLeftPos + 'px'; 
        }
      }, 3);
      _i--;
    }
    _scaleDown(oldSelection);
    _scaleUp(newSelection);
    _deleteText(oldSelection);
    _insertText(newSelection);
    _currentSelection.box = newSelection;
  }

  return {
    displayResults: function (date) {
      let url =  _prefix + date + _postfix;
      fetch(url)
      .then(response => response.json())
      .then((json) => {
        if (json && json.dates && json.dates[0]) {
          console.log('response ', json.dates[0]);
          console.log('Items ', json.dates[0].totalItems);
          _jsonResponse = json.dates[0];
          _init();
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