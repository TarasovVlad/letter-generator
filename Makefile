install:
	npm ci

start:
	npx serve .

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

publish:
	npm publish --access public
