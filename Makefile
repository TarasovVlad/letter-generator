install:
	npm ci

start:
	open index.html

lint:
	npx eslint .

lint-fix:
	npx eslint . --fix

publish:
	npm publish --dry-run