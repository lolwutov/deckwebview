export const configs = {
  "deck": [
      {
        "type": "button",
        "id": "a",
        "text": "A",
        "classes": [
          "abxy"
        ]
      },
      {
        "type": "button",
        "id": "b",
        "text": "B",
        "classes": [
          "abxy"
        ]
      },
      {
        "type": "button",
        "id": "x",
        "text": "X",
        "classes": [
          "abxy"
        ]
      },
      {
        "type": "button",
        "id": "y",
        "text": "Y",
        "classes": [
          "abxy"
        ]
      },
      {
        "type": "button",
        "id": "rShoulder",
        "text": "R1",
        "classes": [
          "shoulder"
        ]
      },
      {
        "type": "button",
        "id": "lShoulder",
        "text": "L1",
        "classes": [
          "shoulder"
        ]
      },
      {
        "type": "button",
        "id": "up",
        "text": "⇑",
        "classes": [
          "dpad"
        ]
      },
      {
        "type": "button",
        "id": "right",
        "text": "⇒",
        "classes": [
          "dpad"
        ]
      },
      {
        "type": "button",
        "id": "down",
        "text": "⇓",
        "classes": [
          "dpad"
        ]
      },
      {
        "type": "button",
        "id": "left",
        "text": "⇐",
        "classes": [
          "dpad"
        ]
      },
      {
        "type": "button",
        "id": "L4",
        "text": "L4",
        "classes": [
          "back"
        ]
      },
      {
        "type": "button",
        "id": "L5",
        "text": "L5",
        "classes": [
          "back"
        ]
      },
      {
        "type": "button",
        "id": "R4",
        "text": "R4",
        "classes": [
          "back"
        ]
      },
      {
        "type": "button",
        "id": "R5",
        "text": "R5",
        "classes": [
          "back"
        ]
      },
      {
        "type": "button",
        "id": "start",
        "text": "start",
        "classes": [
          "menu"
        ]
      },
      {
        "type": "button",
        "id": "select",
        "text": "select",
        "classes": [
          "menu"
        ]
      },
      {
        "type": "button",
        "id": "steam",
        "text": "STEAM",
        "classes": [
          "system"
        ]
      },
      {
        "type": "button",
        "id": "dots",
        "text": "•••",
        "classes": [
          "system"
        ]
      },
      {
        "type": "dstrigger",
        "id": "rTrigger",
        "width": 60,
        "height": 15,
        "backgroundColor": "#252525",
        "activeColor": "#4444FF",
        "axis": {
          "max": 32767,
          "signed": false
        },
        "pressColor": "#FF0000"
      },
      {
        "type": "dstrigger",
        "id": "lTrigger",
        "width": 60,
        "height": 15,
        "backgroundColor": "#252525",
        "activeColor": "#4444FF",
        "axis": {
          "max": 32767,
          "signed": false
        },
        "pressColor": "#FF0000"
      },
      {
        "type": "pressurePad",
        "id": "lTrackPad",
        "width": 75,
        "height": 75,
        "backgroundColor": "#252525",
        "activeColor": "#44FF44",
        "xAxis": {
          "max": 32767,
          "signed": true
        },
        "yAxis": {
          "max": 32767,
          "signed": true
        },
        "press": {
          "max": 32767,
          "signed": false
        },
        "pointRadius": 10,
        "pressGradient": {
          "color": "#FF0000",
          "curve": 5
        },
        "maxPressSize": 26,
        "pressThreshold": 2000
      },
      {
        "type": "pressurePad",
        "id": "rTrackPad",
        "width": 75,
        "height": 75,
        "backgroundColor": "#252525",
        "activeColor": "#44FF44",
        "xAxis": {
          "max": 32767,
          "signed": true
        },
        "yAxis": {
          "max": 32767,
          "signed": true
        },
        "press": {
          "max": 32767,
          "signed": false
        },
        "pointRadius": 10,
        "pressGradient": {
          "color": "#FF0000",
          "curve": 5
        },
        "maxPressSize": 26,
        "pressThreshold": 2000
      },
      {
        "type": "capStick",
        "id": "lStick",
        "width": 60,
        "height": 60,
        "backgroundColor": "#252525",
        "activeColor": "#4444FF",
        "xAxis": {
          "max": 32767,
          "signed": true
        },
        "yAxis": {
          "max": 32767,
          "signed": true
        },
        "field": {
          "max": 6000,
          "signed": false
        },
        "pointRadius": 3,
        "clickColor": "#FF0000",
        "touchColor": "#44FF44",
        "maxFieldSize": 9
      },
      {
        "type": "capStick",
        "id": "rStick",
        "width": 60,
        "height": 60,
        "backgroundColor": "#252525",
        "activeColor": "#4444FF",
        "xAxis": {
          "max": 32767,
          "signed": true
        },
        "yAxis": {
          "max": 32767,
          "signed": true
        },
        "field": {
          "max": 6000,
          "signed": false
        },
        "pointRadius": 3,
        "clickColor": "#FF0000",
        "touchColor": "#44FF44",
        "maxFieldSize": 9
      },
      {
        "type": "linear",
        "id": "roll",
        "width": 60,
        "height": 10,
        "backgroundColor": "#252525",
        "activeColor": "#44FF44",
        "axis": {
          "max": 16383,
          "signed": true
        },
        "gradient": {
          "color": "#FF4444",
          "curve": 1
        },
        "classes": ["gyro"]
      },
      {
        "type": "linear",
        "id": "pitch",
        "width": 60,
        "height": 10,
        "backgroundColor": "#252525",
        "activeColor": "#44FF44",
        "axis": {
          "max": 16383,
          "signed": true
        },
        "gradient": {
          "color": "#FF4444",
          "curve": 1
        },
        "classes": ["gyro"]
      },
      {
        "type": "linear",
        "id": "yaw",
        "width": 60,
        "height": 10,
        "backgroundColor": "#252525",
        "activeColor": "#44FF44",
        "axis": {
          "max": 16383,
          "signed": true
        },
        "gradient": {
          "color": "#FF4444",
          "curve": 1
        },
        "classes": ["gyro"]
      }
    ],
}


export const activeController = "deck";
export const activeStyleSheet = "deck-compact.css";