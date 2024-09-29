package deck

import (
	"bufio"
	"encoding/json"
	"errors"
	"fmt"
	"log"
	"lolwutov/deckwebview/internal/hidraw"
	"lolwutov/deckwebview/internal/inputs"
	"os"
)

type Deck struct {
	vid        int16
	pid        int16
	descVal    []byte
	reportSize int
	hidpath    string
	device     *os.File
	Inputs     []inputs.Input
}

func New() (*Deck, error) {
	deck := &Deck{
		vid:        0x28de,
		pid:        0x1205,
		descVal:    []byte{0x06, 0xff, 0xff, 0x09, 0x01, 0xa1, 0x01, 0x09, 0x02, 0x09, 0x03, 0x15, 0x00, 0x26, 0xff, 0x00, 0x75, 0x08, 0x95, 0x40, 0x81, 0x02, 0x09, 0x06, 0x09, 0x07, 0x15, 0x00, 0x26, 0xff, 0x00, 0x75, 0x08, 0x95, 0x40, 0xb1, 0x02, 0xc0},
		reportSize: 64,
		hidpath:    "",
		device:     nil,
		Inputs: []inputs.Input{
			{
				Name: "a",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 8, Command: 0x80},
				},
			},
			{
				Name: "b",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 8, Command: 0x20},
				},
			},
			{
				Name: "x",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 8, Command: 0x40},
				},
			},
			{
				Name: "y",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 8, Command: 0x10},
				},
			},
			{
				Name: "lShoulder",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 8, Command: 0x08},
				},
			},
			{
				Name: "rShoulder",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 8, Command: 0x04},
				},
			},
			{
				Name: "up",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 9, Command: 0x01},
				},
			},
			{
				Name: "right",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 9, Command: 0x02},
				},
			},
			{
				Name: "down",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 9, Command: 0x08},
				},
			},
			{
				Name: "left",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 9, Command: 0x04},
				},
			},
			{
				Name: "L4",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 13, Command: 0x02},
				},
			},
			{
				Name: "L5",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 9, Command: 0x80},
				},
			},
			{
				Name: "R4",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 13, Command: 0x04},
				},
			},
			{
				Name: "R5",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 10, Command: 0x01},
				},
			},
			{
				Name: "select",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 9, Command: 0x10},
				},
			},
			{
				Name: "start",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 9, Command: 0x40},
				},
			},
			{
				Name: "steam",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 9, Command: 0x20},
				},
			},
			{
				Name: "dots",
				Sensors: []inputs.Sensor{
					&inputs.Button{Name: "pressed", Offset: 14, Command: 0x04},
				},
			},
			{
				Name: "lTrackPad",
				Sensors: []inputs.Sensor{
					&inputs.Analog16{Name: "x", Offset: 16},
					&inputs.Analog16{Name: "y", Offset: 18},
					&inputs.Analog16{Name: "press", Offset: 56},
				},
			},
			{
				Name: "rTrackPad",
				Sensors: []inputs.Sensor{
					&inputs.Analog16{Name: "x", Offset: 20},
					&inputs.Analog16{Name: "y", Offset: 22},
					&inputs.Analog16{Name: "press", Offset: 58},
				},
			},
			{
				Name: "lStick",
				Sensors: []inputs.Sensor{
					&inputs.Analog16{Name: "x", Offset: 48},
					&inputs.Analog16{Name: "y", Offset: 50},
					&inputs.Analog16{Name: "field", Offset: 60},
					&inputs.Button{Name: "click", Offset: 10, Command: 0x40},
					&inputs.Button{Name: "touch", Offset: 13, Command: 0x40},
				},
			},
			{
				Name: "rStick",
				Sensors: []inputs.Sensor{
					&inputs.Analog16{Name: "x", Offset: 52},
					&inputs.Analog16{Name: "y", Offset: 54},
					&inputs.Analog16{Name: "field", Offset: 62},
					&inputs.Button{Name: "click", Offset: 11, Command: 0x04},
					&inputs.Button{Name: "touch", Offset: 13, Command: 0x80},
				},
			},
			{
				Name: "lTrigger",
				Sensors: []inputs.Sensor{
					&inputs.Analog16{Name: "val", Offset: 44},
					&inputs.Button{Name: "press", Offset: 8, Command: 0x02},
				},
			},
			{
				Name: "rTrigger",
				Sensors: []inputs.Sensor{
					&inputs.Analog16{Name: "val", Offset: 46},
					&inputs.Button{Name: "press", Offset: 8, Command: 0x01},
				},
			},
			{
				Name: "roll",
				Sensors: []inputs.Sensor{
					&inputs.Analog16{Name: "val", Offset: 24},
				},
			},
			{
				Name: "pitch",
				Sensors: []inputs.Sensor{
					&inputs.Analog16{Name: "val", Offset: 26},
				},
			},
			{
				Name: "yaw",
				Sensors: []inputs.Sensor{
					&inputs.Analog16{Name: "val", Offset: 42},
				},
			},
		},
	}

	hidpath, err := hidraw.Path(deck.vid, deck.pid, deck.descVal)

	if err != nil {
		return nil, err
	}

	deck.hidpath = hidpath

	return deck, nil
}

func (deck *Deck) Close() {
	err := deck.device.Close()
	if err != nil {
		log.Fatal(err)
	}
	deck.device = nil
}

func (deck *Deck) Open() {
	device, err := os.Open(deck.hidpath)
	if err != nil {
		log.Fatal(err)
	}
	deck.device = device
}

func (deck *Deck) Read() ([]byte, error) {
	if deck.device == nil {
		return nil, errors.New("device is closed")
	}

	buffer := make([]byte, 64)
	_, err := deck.device.Read(buffer)
	if err != nil {
		return nil, err
	}

	for _, input := range deck.Inputs {
		err := input.Update(buffer)
		if err != nil {
			return nil, err
		}
	}

	data, err := json.Marshal(deck.Inputs)
	if err != nil {
		return nil, err
	}

	return data, nil
}

func (deck *Deck) Closed() bool {
	return deck.device == nil
}

func (deck *Deck) ReadRaw() {
	buffer := make([]byte, 64)
	if deck.device == nil {
		log.Fatal("device is closed")
	}
	for {
		read, err := deck.device.Read(buffer)
		if err != nil {
			log.Fatal(err)
		}
		if read != 64 {
			log.Fatal("read: ", read)
		}
		printFormatted(buffer[:], 16, 4)
	}
}

func printFormatted(chunk []byte, cols, rows int) {
	f := bufio.NewWriter(os.Stdout)
	defer f.Flush()
	fmt.Fprintln(f, "------------------------------------------------------------------------")
	for i := 0; i < rows; i++ {
		for j := 0; j < cols; j++ {
			fmt.Fprintf(f, "%02x ", chunk[i*cols+j])
		}
		fmt.Fprintln(f)
	}
}
