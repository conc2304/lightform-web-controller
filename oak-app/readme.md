# Lightform Device Pairing App for Projected Interfaces

This is Lightform's device pairing app.  The goal of this app is to allow Lightform users the ability to connect their Lightform Device to the network of their choice.
The intention of this app is for it to live and be run through an Android Webview on a Lightform device and to be able to be controlled through either a USB connected keyboard or through the proprietary remote control for the Lightform.

## Web/Android Interactions 
(taken from [Pairing App Wip](https://www.notion.so/lightform/Pairing-App-WIP-e136e4cee3ca47b3941bf3e25b5428d2))

Web app and Android App interact with Javascript interface exposed by Android.

### Android Interface

```
@JavascriptInterface
public String availableWifiNetworks()   

@JavascriptInterface
public void connectToNetwork(String jsonStr)
```

### Web Calls

```
const networksResponse = Android.availableWifiNetworks();
Android.connectToNetwork(networkString);
```

## Getting Started
All of the following commands are expected to be run from this directory: `/lf3-pairing`

Installing dependencies:

```bash
npm install
```

Start the development server and launch the application

```bash
npm start
```

### Building for Production
```bash
npm run build
```

For an internal runtime in an IoT device with Android Webview (AKA: LF2+, Oak ...)

```bash
npm run build --device
```
This will change the networking interface to interface with 

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


### Extras
There is an experimental/exploratory svg background that can be enabled by setting the `animated-background` property of the pairing-app component to true;
To Note: it has been seen that running the animated svg through the Android Webview interface causes a lag in remote control interaction.



