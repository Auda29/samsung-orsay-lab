.PHONY: build test sample preview
build:
	python3 tools/build.py --host 127.0.0.1 --port 8080
test:
	python3 -m unittest discover -s tests -v
	node --test tests/player.test.cjs
	python3 tests/browser.py
sample:
	python3 tools/make_sample.py
preview: build
	python3 tools/serve.py --port 8080
