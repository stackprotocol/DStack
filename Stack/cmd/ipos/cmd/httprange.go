package cmd

import (
	"errors"
	"fmt"
	"strconv"
	"strings"
)

const (
	byteRangePrefix = "bytes="
)

type HTTPRangeSpec struct {
	IsSuffixLength bool

	Start, End int64
}

func (h *HTTPRangeSpec) GetLength(resourceSize int64) (rangeLength int64, err error) {
	switch {
	case resourceSize < 0:
		return 0, errors.New("Resource size cannot be negative")

	case h == nil:
		rangeLength = resourceSize

	case h.IsSuffixLength:
		specifiedLen := -h.Start
		rangeLength = specifiedLen
		if specifiedLen > resourceSize {
			rangeLength = resourceSize
		}

	case h.Start >= resourceSize:
		return 0, errInvalidRange

	case h.End > -1:
		end := h.End
		if resourceSize <= end {
			end = resourceSize - 1
		}
		rangeLength = end - h.Start + 1

	case h.End == -1:
		rangeLength = resourceSize - h.Start

	default:
		return 0, errors.New("Unexpected range specification case")
	}

	return rangeLength, nil
}

func (h *HTTPRangeSpec) GetOffsetLength(resourceSize int64) (start, length int64, err error) {
	if h == nil {
		return 0, resourceSize, nil
	}

	length, err = h.GetLength(resourceSize)
	if err != nil {
		return 0, 0, err
	}

	start = h.Start
	if h.IsSuffixLength {
		start = resourceSize + h.Start
		if start < 0 {
			start = 0
		}
	}
	return start, length, nil
}

func parseRequestRangeSpec(rangeString string) (hrange *HTTPRangeSpec, err error) {
	if !strings.HasPrefix(rangeString, byteRangePrefix) {
		return nil, fmt.Errorf("'%s' does not start with '%s'", rangeString, byteRangePrefix)
	}

	byteRangeString := strings.TrimPrefix(rangeString, byteRangePrefix)

	sepIndex := strings.Index(byteRangeString, "-")
	if sepIndex == -1 {
		return nil, fmt.Errorf("'%s' does not have a valid range value", rangeString)
	}

	offsetBeginString := byteRangeString[:sepIndex]
	offsetBegin := int64(-1)
	if len(offsetBeginString) > 0 {
		if offsetBeginString[0] == '+' {
			return nil, fmt.Errorf("Byte position ('%s') must not have a sign", offsetBeginString)
		} else if offsetBegin, err = strconv.ParseInt(offsetBeginString, 10, 64); err != nil {
			return nil, fmt.Errorf("'%s' does not have a valid first byte position value", rangeString)
		} else if offsetBegin < 0 {
			return nil, fmt.Errorf("First byte position is negative ('%d')", offsetBegin)
		}
	}

	offsetEndString := byteRangeString[sepIndex+1:]
	offsetEnd := int64(-1)
	if len(offsetEndString) > 0 {
		if offsetEndString[0] == '+' {
			return nil, fmt.Errorf("Byte position ('%s') must not have a sign", offsetEndString)
		} else if offsetEnd, err = strconv.ParseInt(offsetEndString, 10, 64); err != nil {
			return nil, fmt.Errorf("'%s' does not have a valid last byte position value", rangeString)
		} else if offsetEnd < 0 {
			return nil, fmt.Errorf("Last byte position is negative ('%d')", offsetEnd)
		}
	}

	switch {
	case offsetBegin > -1 && offsetEnd > -1:
		if offsetBegin > offsetEnd {
			return nil, errInvalidRange
		}
		return &HTTPRangeSpec{false, offsetBegin, offsetEnd}, nil
	case offsetBegin > -1:
		return &HTTPRangeSpec{false, offsetBegin, -1}, nil
	case offsetEnd > -1:
		if offsetEnd == 0 {
			return nil, errInvalidRange
		}
		return &HTTPRangeSpec{true, -offsetEnd, -1}, nil
	default:
		return nil, fmt.Errorf("'%s' does not have valid range value", rangeString)
	}
}

func (h *HTTPRangeSpec) String(resourceSize int64) string {
	if h == nil {
		return ""
	}
	off, length, err := h.GetOffsetLength(resourceSize)
	if err != nil {
		return ""
	}
	return fmt.Sprintf("%d-%d", off, off+length-1)
}
