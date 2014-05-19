default: update

update:
	@curl https://codeload.github.com/richleland/pygments-css/legacy.tar.gz/master | tar xz -C public
	@mv public/richleland* public/syntax
