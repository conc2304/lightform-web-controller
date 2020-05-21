Ensure the [lightform bootstrap styles](https://gitlab.lumenous3d.com/cloud/lightform-bootstrap) 
repo shares a parent directory with this repo (and run `gulp` in that repo to generate the css). 

## Packaging for device

1. Copy everything from the `device` folder into wherever the firmware lives. (use `cp -rL` to resolve symlinks)
2. Create a file `config/env.js` with the content
	```json
	{
		"cloud": false,
		"device": true
	}
	```

## Running locally 

1. Set a config file to point to an environment. For example, to run a local web ui against a dev backend
	```bash
	cd config
	ln -s env.dev.js env.js
	```
2. host the files in the repo (for example using the VS code live server extension or [python's simple http server](https://developer.mozilla.org/en-US/docs/Learn/Common_questions/set_up_a_local_testing_server#Running_a_simple_local_HTTP_server))
3. open your browser


