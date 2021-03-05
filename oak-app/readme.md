# Lightform First Time User Experience App for Projected Interfaces

This is Lightform's First Time User Experience App also know as FTUX built with StencilJs.  The goal of this app is to create a user flow that helps guid users through the necessary set up steps in order to use the Oak experience.  The main components to this app are 1.) A welcome screen 2.) a device to network pairing flow 3.) a firmware update flow 4.) a device registration flo.
The intention of this app is for it to live and be run through an Android Webview on a Lightform device and to be able to be controlled through the proprietary remote control for the Lightform Device.

## Web/Android Interactions 
Web app and Android App interact with Javascript interface exposed by Android.
(taken from [Pairing App Wip](https://www.notion.so/lightform/Pairing-App-WIP-e136e4cee3ca47b3941bf3e25b5428d2))

## Getting Started
All of the following commands are expected to be run from this directory: `.web/oak-app`

Installing dependencies:

```bash
npm install
```

Start the development server and launch the application

```bash
npm start
```

### Building for Production (uses prod api)
```bash
npm run build
```

### Use this build for beta / dev build
For an internal runtime in an IoT device with Android Webview (AKA: LF2+, Oak ...)
(uses dev api)
```bash 
npm run build.dev
```

##### The contents of `.web/oak-app/dist` are the final bundle to be uploaded to a Lightform device

For internal runtimes, like Device Pairing, that has to be run from a device, use the Custom Elements Bundle that is built in the `dist` directory.  For sites being hosted use the `public_html` build.  It is expected that the contents of `public_html` directory be placed at the root of where the site is being served.
** Note This build is using `src/dist.html`.  This is a modified version of `src/index.html` where the call to the build entry files are replaced by calling `defineCustomElements()` in the built/generated custom bundle `dist/index.js`;


To run the unit tests once, run:

```
npm test
```

To run the unit tests and watch for file changes during development, run:

```
npm run test.watch
```




