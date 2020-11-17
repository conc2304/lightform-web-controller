# Device run web assets

### Getting Started
- This project depends on Parcel.Js as its bundler and asset server.
- From this directory 
- Install dependencies: `npm install`
- Build bundle: `npm run dev`
- Open the localhost url given in the terminal (ie. `http://localhost:1234`)
** NOTICE ** Parcel is currently only set up to serve pair.html

### Notes for Device Pairing
- In order to run, it is expected that the web component bundle be available `./js/custom-elements/index.js`.
- `./js/custom-elements/index.js` is an automatically built and generated file.

#### Building the Web Component Bundle
To rebuild and make `index.js` available to the captive portal pairing page:
From `/web-components` run `npm run build`.  This will generate the bundle's entry file and then gulp will automatically copy it into the appropriate directory.  
Note ** See `gulpfile.js` if you need to specify a different output directory.
 


#### Internal Builds - sending a zip file to someone
- From this directory 
- Install dependencies: `npm install`
- Build bundle: `npm run build`
- Copy the built `dist` directory to anywhere and zip that folder up and send it to someone.

##### Expectations:
- Any asset/resource in javascript needs to be `required` or `imported` - @See `js/pair.js`
- For viewing the rendered project in the browser with VS Code the "Live Server" plugin/extension is required.
- In order to view the project in a browser, it is expected that the `dist` directory be at the root of the server.  
- So to view it you will want to Open a New Window in VS Code, and then start by opening this `dist` folder.  This will make it so that the project is at the root of the server.


