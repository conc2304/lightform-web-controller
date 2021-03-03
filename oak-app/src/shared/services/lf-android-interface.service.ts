// From Player Framework repo -  AndroidInterface.js

// Allows to call a Android java function asynchronously
// spawn long running computations/io on the Java/Android without blocking the JS/Website running inside the WebView
// Eg. const result = await callAndroidAsync(jsonrpc: '2.0', id: <random>, method: 'javaFunction', { param1: 'value1', param2: 'value2' })

export interface AndroidCommand {
  jsonrpc: string,
  id: string,
  method: string,
  params: object,
}

export async function callAndroidAsync(command: AndroidCommand) {
  const rand = 'asyncJava_' + command.id;
  window[rand] = {};

  // func called from android
  window[rand].callback = isSuccess => {
    console.log('isSuccess: ' + isSuccess);
    // @ts-ignore - Android
    const dataOrErr = Android.runAsyncResult(rand);
    if (isSuccess) window[rand].resolve(dataOrErr);
    else window[rand].reject(dataOrErr);
    delete window[rand]; // clean up
  };

  // @ts-ignore - Android
  Android.runAsync(rand, JSON.stringify(command));

  return new Promise((resolve, reject) => {
    window[rand].resolve = data => resolve(data);
    window[rand].reject = err => reject(err);
  });
}

export function androidSetDoneFlag() {
  // @ts-ignore - Android
  Android.done();
}

export function androidExit() {
  // @ts-ignore - Android
  Android.exit();
}

export function androidGetDeviceName() {

  // @ts-ignore - Android
  return Android.getDeviceName();
}

export function androidGetDeviceSerial() {

  // @ts-ignore - Android
  return Android.getSerial();
}

export function androidReboot() {
  // @ts-ignore - Android
  Android.reboot();
}
