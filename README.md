JSONFeedDisplay  
---------------

This project parses out the data for each game in the MLB JSON feed, and construct a simple list that the user can
navigate through with the keyboard, left and right.

## Requirements
  * Your favorite text editor
  * An HTML5 compliant browser
  * A webserver on which to host the sample
  * simplehttpserver[Please refer Referece section below]

## Running the Application
  1. $ git clone https://github.com/rnavada/JSONFeedDisplay.git
  2. $ cd JSONFeedDisplay
  3. $ python -m SimpleHTTPServer
  4. From Chrome Browser access go to url: http://127.0.0.1:8000/
  5. Enter the data in the date picker field.
  6. From the vertical Navigation bar select MLB. The list page will be displayed.
  7. If you dont enter any date, the app will display results for that particular day.
  
## Application screenshots
  Initial page. Please select the date and click on MLB.
![alt text](https://github.com/rnavada/JSONFeedDisplay/blob/develop/mlb/images/Screenshot%20from%202019-06-02%2021-56-03.png)
  Wireframe and scaling up by 150%
![alt text](https://github.com/rnavada/JSONFeedDisplay/blob/develop/mlb/images/Screenshot%20from%202019-06-02%2021-56-38.png)
  Hit ENTER key to see the game details overlay. Hit ESC key to hide the overlay.
![alt text](https://github.com/rnavada/JSONFeedDisplay/blob/develop/mlb/images/Screenshot%20from%202019-06-02%2021-56-52.png)

## Testing
  The project has been tested only on Chrome and Firefox browsers.

## Build

## Referece
  1. https://www.pythonforbeginners.com/modules-in-python/how-to-use-simplehttpserver/
  2. For a prticualar day schedule: http://statsapi.mlb.com/api/v1/schedule?hydrate=game(content(editorial(recap))),decisions&date=2018-06-10&sportId=1
  3. For game specific information: http://statsapi.mlb.com/api/v1.1/game/567087/feed/live
