Ensure the [lightform bootstrap styles](https://gitlab.lumenous3d.com/cloud/lightform-bootstrap) 
repo shares a parent directory with this repo (and run `gulp` in that repo to generate the css). 

## Packaging for device

1. Copy everything from the `device` folder into wherever the firmware lives. (use `cp -rL` to resolve symlinks)
2. Create a file `config/env.json` with the content
	```json
	{
		"cloud": false,
		"device": true
	}
	```
