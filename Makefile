install:
	npm install

publish:
	npm publish --dry-run
	npm link

help:
	npx babel-node src/bin/gendiff.js -h

lint:
	npx eslint .

test:
	npx jest