# Deck Web View
DeckWebView reads inputs from a steam deck and displays them in a browser.
It can be used as an overlay with the obs browser feature.

![logo](preview.webp)

## Installation

### Auto
In the desktop mode open the konsole and run

`wget -O - https://github.com/lolwutov/deckwebview/releases/latest/download/install.sh -nv | bash`

This will download the latest web app and the compiled daemon, place them into `/home/deck/Applications/deckwebview` and enable the deckwebview systemd service.

The application will be available at localhost:49753

To uninstall run

`wget -O - https://github.com/lolwutov/deckwebview/releases/latest/download/uninstall.sh -nv | bash`

### Manual

You will need git and go=>1.22.2

Clone this repository

`git clone github.com/lolwutov/deckwebview && cd deckwebview`

then build it with

`go build cmd/deckwebview/deckwebview.go`

move the entire folder to the deck and within it launch with

`./deckwebview`

If you want to install it as a daemon, there is a deckwebview.service template in the ./install folder

Put it into `/home/deck/.config/systemd/user` and enable with

`systemctl --user daemon-reload && systemctl --user enable --now deckwebview.service`

You may want to change paths to the application in the service file, default is /home/deck/Applications/deckwebview

## Configuration

This app consists of two parts: a daemon that reads inputs and handles websockets, and a web app that displays those inputs.

### Daemon
launch parameters:
- -h: host's address and port for serving the web app; default is localhost:49753
- -d: a directory to serve as a web app; default is ./static
- -t: a rate at which data is sent to the web app in ms, increasing this may improve browser's cpu use; default is 8

### Web app

Web app configs are located in `./static/config` relative to the installation directory. The css folder is used for custom stylesheets and `controller.js` is the main configuration file.

Each controller is an object with an array of inputs inside configs var, activeController selects corresponding config and activeStyleSheet selects specified css file from the css folder.

Each input is an html element which behaves differently depending on type and expected data.

Example of a simple config with two buttons:


controller.js:
```
export const configs = {
    "simpleButton": [
        {"type": "button", "id": "mybutton"},
        {"type": "button", "id": "mybutton2"}
    ]
}

export const activeController = "simpleButton";
export const activeStyleSheet = "simple-button.css";
```


This will place 2 div elements on a page with ids "mybutton" and "mybutton2", and `simple-buttons.css` in `./config/styles` is used for styling.

Data from the daemon must match the inputs. For the steam deck, there are 5 types of supported inputs:

- Button
- Pressure Pad
- Capacitive Stick
- Dual-stage trigger
- Linear (1-axis analog, mainly used for gyroscope axes)

There are default configurations and styles that can be used for reference.

### List of all supported inputs and their configuration parameters

All elements can be used with parameter
```
"classes": ["myclass", "myclass1", "myclass2" ...]
```
to add any number of default classes to that element; this parameter is optional.

"type" option is mandatory for selecting appropriate input type.

"id" option is mandatory - not only it assigns id for an element, it must also match the correct input id from daemon's data.

#### Button

Represents a simple button

Creates a div element with dynamic class based on a data from the daemon. When input is received, ".pressed" class is added to the element.

- "type": "button"
- "text": "mytext" - displays text inside element; optional

#### Linear input

Represents an 1-dimensional axis like a simple trigger or one of gyro axes

Creates a canvas element where 0 is the leftmost point and max value is the rightmost unless values are signed - more in the description.

- "type": "linear"
- "width": 60 - width of an element; not optional
- "height": 10 - height of an element; not optional
- "axis": {"max": 16383, "signed": true} - axis description that is expected as data from the daemon. If signed is true, then 0 becomes the middle point of the canvas and negative and positive edges (-16384 and 16383 in this example) are left and right correspondently; not optional
- "backgroundColor": "#252525" - background color of the canvas; not optional
- "activeColor": "#44FF44" - fill color of the canvas; not optional
- "gradient": {"color": "#FF4444","curve": 1} - color gradient. If used, changes color from active color to assigned color with speed of "curve"; optional

#### Dual-stage trigger
Represents a dual-stage trigger. It acts like a simple linear input but with a separate button (physical or virtual) at the end of a threshold

Creates a canvas element

All options are the same as for the linear input, except for button press parameter.

- "type": "dstrigger"
- "pressColor": "#FF0000" - fill color when trigger is fully pressed. When not used, acts as a linear input; optional

#### Planar

Represents a simple 2d-surface like a simple stick without any click capabilities, a single-point touchpad or a touchscreen

Creates a canvas element with a point that represents input's positon on a 2d plane

- "type": "planar"
- "width": 70 - width of the element; not optional
- "height": 70 - height of the element; not optional
- "xAxis": {"max": 32767,"signed": true} - horizontal axis settings. Similar to the linear input parameter but signed parameter does not affect view. Point always centers on 0 or middle value; not optional
- "yAxis": {"max": 32767,"signed": true} - vertical axis settings; not optional
- "backgroundColor": "#252525" - background color of the canvas; not optional
- "activeColor": "#44FF44" - color of the point; not optional
- "pointRadius": 10 - radius of the point in pixels; not optional


#### Stick

Represents a classic stick with a click capability

Creates a canvas element

All options are the same as for the planar input, except for click

- "type": "stick"
- "clickColor": "#FF0000" - color of the point when stick is pressed; not optional


#### Pressure pad

Represents a touch panel with a pressure sensor

Creates canvas element

All options are the same as for the planar input, except for some new

- "type": "pressurePad"
- "press": {"max": 32767, "signed": false} - pressure is just another analog axis; not optional
- "pressGradient": {"color": "#FF0000","curve": 5} - if this parameter is set, point will change color from active to specified depending on the pressure value; optional
- "maxPressSize": 26 - if this parameter is set, point will change it's size depending on the pressure value; optional
- "pressThreshold": 2000 - if this and gradient parameters are specified, then point will instantly change color to the specified gradient color when pressure exceeds value; optional


#### Capacitive Stick

Represents a stick with a capacitive sensor thumb grip, like the ones that on the steam deck

Creates canvas element

All options are the same as for stick, but with sensor options

- "type": "capStick"
- "field": {"max": 6000, "signed": false} - field is an axis that detects how close is a finger to the stick; not optional
- "maxFieldSize": 9 - the radius of a point in pixels when the field is at max value; optional
- "touchColor": "#44FF44" - color of a point when stick is considered to be "touched", this is a separate sensor from the field; not optional


### List of ids for steam deck and corresponding inputs:

#### Buttons
- a
- b
- x
- y
- up
- right
- down
- left
- rShoulder
- lShoulder
- start
- select
- L4
- L5
- R4
- R5
- steam
- dots

#### Dual stage triggers
- rTrigger
- lTrigger

#### Pressure pads
- lTrackPad
- rTrackPad

#### Capacitive sticks
- lStick
- rStick

#### Linear inputs
- roll
- pitch
- yaw

## Extending

This app was made with the steam deck and its capabilities in mind, but it should be fairly easy to adapt it to any type of controller. 

To do so, a device of the Controller interface must be implemented in ./internal/contollers package.

The idea is that each device (controller) is a collection of inputs and each input is a collection of sensors which can either be a button or an analog and to display them web app must have corresponding inputs with sensors as data parameters. It's already have plenty of most common inputs with suitable data described in types ending in ~Data in typedefs.js

The only major missing type i can think of is a multitouch planar but this is a work in progress.


## Known bugs

- Stick capacitive sensor shows strange values. While it's working fine for display purposes, this still should be looked into.
- Occasional flickering on signed linear inputs.


## TODO

- Add support for Steam Controller
- Consider adding touch screen support for deck
