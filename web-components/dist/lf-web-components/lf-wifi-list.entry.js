import { r as registerInstance, h } from './index-6745bcf5.js';

const lfWifiListComponentCss = ".theme--dark{background-color:#232326;color:#babfd1}.theme--light{background-color:#babfd1;color:#232326}:host{display:block;width:50%;margin:0 auto;font-family:AltasRegular, Helvetica, sans-serif;font-weight:400;font-style:normal;font-stretch:normal}lf-list-item.lf-list-item--disabled{cursor:not-allowed}.lock-icon{height:1rem}";

var SignalStrength;
(function (SignalStrength) {
    SignalStrength["Weak"] = "Weak";
    SignalStrength["OK"] = "OK";
    SignalStrength["Strong"] = "Strong";
})(SignalStrength || (SignalStrength = {}));
var LoadingProgress;
(function (LoadingProgress) {
    LoadingProgress["Uninitialized"] = "Uninitialized";
    LoadingProgress["Loading"] = "Loading";
    LoadingProgress["Loaded"] = "Loaded";
})(LoadingProgress || (LoadingProgress = {}));
const LfList = class {
    constructor(hostRef) {
        registerInstance(this, hostRef);
        this.wifiEntries = [];
        this.progress = LoadingProgress.Uninitialized;
        this.listData = [
            {
                wifiName: "Wu-Tang LAN",
                locked: true,
                signalStrength: SignalStrength.Strong,
            },
            {
                wifiName: "It Burns When IP",
                locked: true,
                signalStrength: SignalStrength.Weak,
            },
            {
                wifiName: "Bill Wi The Science Fi",
                locked: true,
                signalStrength: SignalStrength.OK,
            },
            {
                wifiName: "FBI Surveillance Van",
                locked: false,
                signalStrength: SignalStrength.Strong,
            },
        ];
    }
    async componentWillLoad() {
        this.progress = LoadingProgress.Loading;
        this.getWifiList()
            .then((response) => {
            this.wifiEntries = response;
        })
            .catch((e) => {
            throw new Error(e);
        })
            .then(() => {
            this.progress = LoadingProgress.Loaded;
        });
    }
    async getWifiList() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.listData);
            }, 1000);
        });
    }
    render() {
        const iconPath = "/assets/images/icons/";
        function getLockIconPath(locked) {
            const iconImageFile = locked ? "Lock.svg" : "Unlock.svg";
            const resolvedFilePath = `${iconPath}${iconImageFile}`;
            return resolvedFilePath;
        }
        function getWifiSignalPath(signalStrength) {
            let wifiSignalFile;
            switch (signalStrength) {
                case SignalStrength.Strong:
                    wifiSignalFile = "network-3bars.svg";
                    break;
                case SignalStrength.OK:
                    wifiSignalFile = "network-2bars.svg";
                    break;
                case SignalStrength.Weak:
                    wifiSignalFile = "network-1bar.svg";
                    break;
            }
            const resolvedFilePath = `${iconPath}${wifiSignalFile}`;
            return resolvedFilePath;
        }
        return (h("lf-list", { outlined: true, dark: true, striped: true, class: "wifi-test" }, h("lf-subheader", null, h("div", null, "WIFI Networks")), this.wifiEntries.map((item, index) => {
            return (h("lf-list-item", { disabled: index % 2 === 0 }, h("img", { slot: "start", src: getWifiSignalPath(item.signalStrength) }), h("div", null, item.wifiName), h("img", { class: "lock-icon", slot: "end", src: getLockIconPath(item.locked) })));
        })));
    }
};
LfList.style = lfWifiListComponentCss;

export { LfList as lf_wifi_list };
