

function getDate () {
  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  return today;
}

function mlbSelected () {

  let url;
  var input = document.getElementById('gameday').value;
  if(input){
    console.log(input);
    url = './mlb/mlb.html?date=' + input;
  } else {
    url = './mlb/mlb.html?date=' + getDate();
  }

  if (url) {
    console.log('new url - ', url);
    window.location.replace(url);
  }

}