// OneKeyConnect API types tests

// Exported constants
/* eslint-disable no-unused-vars */
import OneKeyConnect, {
    UI_EVENT,
    DEVICE_EVENT,
    RESPONSE_EVENT,
    TRANSPORT_EVENT,
    BLOCKCHAIN_EVENT,
    BLOCKCHAIN,
    DEVICE,
    IFRAME,
    POPUP,
    TRANSPORT,
    UI,
    // Exported types
    Device,
    DeviceStatus,
    FirmwareRelease,
    DeviceFirmwareStatus,
    DeviceMode,
    Features,
    AccountInfo,
    EthereumAddress,
} from '../index';
/* eslint-disable no-unused-vars */

export const init = async () => {
    const manifest = { appUrl: '', email: '' };
    OneKeyConnect.init({ manifest });
    // @ts-ignore
    OneKeyConnect.init();
    // @ts-ignore
    OneKeyConnect.init({});
    // @ts-ignore
    OneKeyConnect.manifest({});
    // @ts-ignore
    OneKeyConnect.manifest({ appUrl: 1 });
    // @ts-ignore
    OneKeyConnect.manifest({ email: 1 });

    const settings = await OneKeyConnect.getSettings();
    if (settings.success) {
        const { payload } = settings;
        payload.manifest;
        payload.connectSrc;
        payload.debug;
        payload.popup;
        payload.lazyLoad;
        payload.webusb;
        payload.pendingTransportEvent;
        payload.pendingTransportEvent;
    }

    OneKeyConnect.dispose();
    OneKeyConnect.cancel();
    OneKeyConnect.cancel('Interruption error');
    OneKeyConnect.renderWebUSBButton();
    OneKeyConnect.disableWebUSB();
};

export const events = async () => {
    OneKeyConnect.on(DEVICE_EVENT, event => {
        const { payload } = event;
        event.type;
        payload.path;
        payload.type;
        if (payload.type === 'acquired') {
            payload.mode;
            payload.firmware;
            payload.status;

            // features
            payload.features.vendor;
            payload.features.device_id;
            payload.features.major_version;
            payload.features.minor_version;
            payload.features.patch_version;
            payload.features.pin_protection;
            payload.features.passphrase_protection;
            payload.features.label;
            payload.features.initialized;
            payload.features.revision;
            payload.features.needs_backup;
            payload.features.flags;
            payload.features.unfinished_backup;
            payload.features.no_backup;
            payload.features.model;
        }
    });
    OneKeyConnect.off(DEVICE_EVENT, () => {});
    OneKeyConnect.removeAllListeners();

    // @ts-ignore
    OneKeyConnect.on('DEVICE-EVENT', () => {});

    OneKeyConnect.on(TRANSPORT_EVENT, event => {
        if (event.type === TRANSPORT.START) {
            event.payload.type;
            event.payload.version;
            event.payload.outdated;
        }
        if (event.type === TRANSPORT.ERROR) {
            event.payload.bridge;
        }
    });
    OneKeyConnect.off(TRANSPORT_EVENT, () => {});

    OneKeyConnect.on(UI_EVENT, event => {
        if (event.type === UI.BUNDLE_PROGRESS) {
            event.payload.progress;
            event.payload.error;
            event.payload.response;
        }
        if (event.type === UI.REQUEST_BUTTON) {
            event.payload.code;
            event.payload.data;
            event.payload.device;
        }
    });
    OneKeyConnect.off(UI_EVENT, () => {});

    OneKeyConnect.on<AccountInfo>(UI.BUNDLE_PROGRESS, event => {
        event.progress;
        event.error;
        event.response.empty;
        event.response.availableBalance;
    });

    OneKeyConnect.on<EthereumAddress>(UI.BUNDLE_PROGRESS, event => {
        event.progress;
        event.error;
        event.response.serializedPath;
        event.response.address;
    });

    OneKeyConnect.on(UI.REQUEST_BUTTON, event => {
        event.code;
        event.data;
        event.device;
    });

    OneKeyConnect.on(BLOCKCHAIN_EVENT, event => {
        if (event.type === BLOCKCHAIN.CONNECT) {
            event.payload.blockHash;
            event.payload.shortcut;
            event.payload.testnet;
        }
        if (event.type === BLOCKCHAIN.BLOCK) {
            event.payload.blockHash;
            event.payload.blockHeight;
        }
        if (event.type === BLOCKCHAIN.NOTIFICATION) {
            event.payload.notification.descriptor;
            event.payload.notification.tx;
        }
    });
    OneKeyConnect.off(BLOCKCHAIN_EVENT, () => {});
};
