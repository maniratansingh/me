# Makefile for mrps.in static site compilation

.DEFAULT_GOAL := build

build:
	bash build.sh

clean:
	rm -rf site

serve:
	cd site && python3 -m http.server 8080

.PHONY: build clean serve
