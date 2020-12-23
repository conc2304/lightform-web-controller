
class AndroidCallbackBridge {
  constructor() {}

  updateFirmwareProgress = function (downloadProgress = 0, status = true) {
    console.log('Android - updateFirmwareProgress');

    const event = new CustomEvent('firmwareDownloadProgress', {
      detail: {
        progress: downloadProgress,
        status: status,
      },
    });
    window.dispatchEvent(event);
  };
}

const WebViewBridge = new AndroidCallbackBridge();
