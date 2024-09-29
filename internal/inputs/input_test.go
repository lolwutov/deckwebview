package inputs

import (
	"encoding/json"
	"testing"
)

type MarshalTestData struct {
	i    Input
	want string
}

func TestUnmMarshal(t *testing.T) {
	tests := []MarshalTestData{
		{i: Input{Name: "TestButton"}, want: "{\"id\":\"TestButton\"}"},
		{i: Input{Name: "TestButton", Sensors: []Sensor{&Button{Name: "b"}}}, want: "{\"b\":false,\"id\":\"TestButton\"}"},
		{i: Input{Name: "TestAnalog", Sensors: []Sensor{&Analog16{Name: "a"}}}, want: "{\"a\":0,\"id\":\"TestAnalog\"}"},
		{i: Input{Name: "TestMixed", Sensors: []Sensor{&Analog16{Name: "a"}, &Button{Name: "b"}}}, want: "{\"a\":0,\"b\":false,\"id\":\"TestMixed\"}"},
	}

	for i, tt := range tests {
		got, err := json.Marshal(tt.i)

		if err != nil || string(got) != tt.want {
			t.Fatalf("%d: %s", i, string(got))
		}
	}
}
