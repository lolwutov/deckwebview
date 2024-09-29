package inputs

import (
	"errors"
	"testing"
)

type SensorTestData struct {
	data          []byte
	offset        uint
	err           error
	want16        int16
	wantPress     bool
	buttonCommand byte
}

func TestUpdateAnalog16Errors(t *testing.T) {

	tests := []SensorTestData{
		{data: []byte{}, offset: 0, err: ErrInvalidOffset},
		{data: []byte{0xff}, offset: 0, err: ErrInvalidOffset},
		{data: []byte{0xff, 0xff}, offset: 1, err: ErrInvalidOffset},
		{data: []byte{0xff, 0xff, 0xff}, offset: 2, err: ErrInvalidOffset},
	}

	for i, tt := range tests {
		sensor := &Analog16{
			Name:   "sensor",
			Offset: tt.offset,
		}

		err := sensor.Update(tt.data)

		if err == nil || !errors.Is(err, tt.err) {
			t.Fatalf("%d: [%x]; offset: %d", i, tt.data, tt.offset)
		}
	}
}

func TestUpdateAnalog16Ranges(t *testing.T) {

	tests := []SensorTestData{
		{data: []byte{0xff, 0xff}, offset: 0, err: nil},
		{data: []byte{0xff, 0xff, 0xff}, offset: 1, err: nil},
		{data: []byte{0xff, 0xff, 0xff}, offset: 1, err: nil},
	}

	for i, tt := range tests {

		sensor := &Analog16{
			Name:   "sensor",
			Offset: tt.offset,
		}

		err := sensor.Update(tt.data)

		if err != nil {
			t.Fatalf("%d: [%x]; offset: %d", i, tt.data, tt.offset)
		}
	}
}

func TestUpdateAnalog16Vals(t *testing.T) {
	tests := []SensorTestData{
		{data: []byte{0x00, 0x00}, offset: 0, want16: 0},
		{data: []byte{0xff, 0xff}, offset: 0, want16: -1},
		{data: []byte{0xff, 0x7f}, offset: 0, want16: 32767},
		{data: []byte{0x00, 0x80}, offset: 0, want16: -32768},
		{data: []byte{0xff, 0x7f, 0x00}, offset: 1, want16: 127},
		{data: []byte{0x00, 0xff, 0x00}, offset: 1, want16: 255},
	}

	for i, tt := range tests {

		sensor := &Analog16{
			Name:   "sensor",
			Offset: tt.offset,
		}

		err := sensor.Update(tt.data)

		if err != nil || tt.want16 != sensor.Value {
			t.Fatalf("%d: [%x]; offset: %d; want: %d, got: %d", i, tt.data, tt.offset, tt.want16, sensor.Value)
		}

	}
}

func TestUpdateButtonErrors(t *testing.T) {
	tests := []SensorTestData{
		{data: []byte{}, offset: 0, err: ErrInvalidOffset},
		{data: []byte{0xff}, offset: 1, err: ErrInvalidOffset},
		{data: []byte{0xff, 0xff}, offset: 2, err: ErrInvalidOffset},
	}

	for i, tt := range tests {
		sensor := &Button{
			Name:   "sensor",
			Offset: tt.offset,
		}

		err := sensor.Update(tt.data)

		if err == nil || !errors.Is(err, tt.err) {
			t.Fatalf("%d: [%x]; offset: %d", i, tt.data, tt.offset)
		}
	}
}

func TestUpdateButtonRanges(t *testing.T) {

	tests := []SensorTestData{
		{data: []byte{0xff}, offset: 0, err: nil},
		{data: []byte{0xff, 0xff}, offset: 1, err: nil},
	}

	for i, tt := range tests {

		sensor := &Button{
			Name:   "sensor",
			Offset: tt.offset,
		}

		err := sensor.Update(tt.data)

		if err != nil {
			t.Fatalf("%d: [%x]; offset: %d", i, tt.data, tt.offset)
		}
	}
}

func TestUpdateButtonVals(t *testing.T) {
	tests := []SensorTestData{
		{data: []byte{0xff}, offset: 0, buttonCommand: 0xff, wantPress: true},
		{data: []byte{0x00}, offset: 0, buttonCommand: 0x00, wantPress: false},
		{data: []byte{0x00}, offset: 0, buttonCommand: 0xff, wantPress: false},
		{data: []byte{0xff}, offset: 0, buttonCommand: 0x00, wantPress: false},
		{data: []byte{0b10101010}, offset: 0, buttonCommand: 0b10000000, wantPress: true},
		{data: []byte{0b10101010}, offset: 0, buttonCommand: 0b00100000, wantPress: true},
		{data: []byte{0b10101010}, offset: 0, buttonCommand: 0b00001000, wantPress: true},
		{data: []byte{0b10101010}, offset: 0, buttonCommand: 0b00000010, wantPress: true},
	}

	for i, tt := range tests {

		sensor := &Button{
			Name:    "sensor",
			Offset:  tt.offset,
			Command: tt.buttonCommand,
		}

		err := sensor.Update(tt.data)

		if err != nil || tt.wantPress != sensor.Pressed {
			t.Fatalf("%d: [%x]; offset: %d; want: %v, got: %v", i, tt.data, tt.offset, tt.wantPress, sensor.Pressed)
		}

	}
}
