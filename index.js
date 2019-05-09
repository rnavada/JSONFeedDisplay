//var c = document.getElementById("myCanvas");
//var ctx = c.getContext("2d");
//var img = document.getElementById("scream");
//ctx.drawImage(img,100,109);

function main() {
  console.log('hello world');

  fetch("http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=2019-05-09&sportId=1")
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    console.log(myJson);
    console.log(myJson.dates[0].games[0]);
    //console.log(JSON.stringify(myJson));
  });


}

main();