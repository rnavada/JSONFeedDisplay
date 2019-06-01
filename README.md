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

## Testing
  The project has been tested only on Chrome and Firefox browsers.

## Build

## Referece
https://www.pythonforbeginners.com/modules-in-python/how-to-use-simplehttpserver/
