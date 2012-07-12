UGLIFYJS = ./node_modules/.bin/uglifyjs
BANNER = ./node_modules/.bin/banner


dist/clustr.min.js:
	cat src/clustr.js \
		src/merge_intersecting.js > dist/clustr.js
	$(UGLIFYJS) dist/clustr.js > dist/clustr.min.js

clean:
	rm dist/*

all: dist/clustr.min.js

.PHONY: dist/clustr.min.js
