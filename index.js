/*
 * Q!.
 * 
 */

function main() {
  console.log('hello world');

  var page = document.getElementById("container")
  if (page) {
    page.onkeypress = function(e){
      var e = window.event || e;
      alert(e.keyCode);
    }
  } else {
    console.log("null event");
  }


  fetch("http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=2019-05-09&sportId=1")
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
    console.log(myJson.dates[0].games[0]);
    //console.log(JSON.stringify(myJson));

    //var c = document.getElementById("myCanvas");
    //var ctx = c.getContext("2d");
    //ctx.font = "15px Arial";
    //ctx.fillText(myJson.dates[0].games[0].gamePk + '', 10, 50);

    

  });


}

main();

