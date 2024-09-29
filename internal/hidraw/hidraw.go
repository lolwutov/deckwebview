package hidraw

import (
	"errors"
	"os"
	"path/filepath"

	"golang.org/x/sys/unix"
)

func Path(vid, pid int16, descVal []byte) (string, error) {
	path := ""
	nodes, err := filepath.Glob("/dev/hidraw*")
	if err != nil {
		return path, err
	}
	for _, node := range nodes {
		if tryDevice(node, vid, pid, descVal) {
			return node, nil
		}

	}

	return path, errors.New("device not found")

}

func tryDevice(hidnode string, vid, pid int16, descVal []byte) bool {
	device, err := os.Open(hidnode)
	if err != nil {
		return false
	}

	defer device.Close()

	fd := int(device.Fd())
	info, err := unix.IoctlHIDGetRawInfo(fd)
	if err != nil {
		return false
	}

	dsize, err := unix.IoctlGetUint32(fd, unix.HIDIOCGRDESCSIZE)
	if err != nil || uint32(len(descVal)) > dsize {
		return false
	}

	descriptor := unix.HIDRawReportDescriptor{}
	descriptor.Size = dsize

	err = unix.IoctlHIDGetDesc(fd, &descriptor)
	if err != nil {
		return false
	}

	return info.Product == pid && info.Vendor == vid && partialMatch(descriptor.Value[:dsize], descVal)
}

func partialMatch(target, value []byte) bool {
	if len(value) > len(target) {
		return false
	}

	for i, val := range value {
		if val != target[i] {
			return false
		}
	}
	return true

}
