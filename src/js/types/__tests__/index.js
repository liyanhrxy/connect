/* @flow */
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
    ERRORS,
    IFRAME,
    POPUP,
    TRANSPORT,
    UI,
} from '../../index';
/* eslint-disable no-unused-vars */

// Exported types
import type {
    API,
    Device,
    DeviceStatus,
    FirmwareRelease,
    DeviceFirmwareStatus,
    DeviceMode,
    Features,
    AccountInfo,
    EthereumAddress,
} from '../../index';

export const init = async () => {
    const manifest = { appUrl: '', email: '' };
    OneKeyConnect.init({ manifest });
    // $FlowIssue: invalid params
    OneKeyConnect.init();
    // $FlowIssue: invalid params
    OneKeyConnect.init({});
    // $FlowIssue: invalid params
    OneKeyConnect.init({ manifest: { appUrl: '', email: '' }, connectSrc: undefined });

    OneKeyConnect.manifest(manifest);
    // $FlowIssue: invalid params
    OneKeyConnect.manifest({});
    // $FlowIssue: invalid params
    OneKeyConnect.manifest({ appUrl: 1 });
    // $FlowIssue: invalid params
    OneKeyConnect.manifest({ email: 1 });

    const settings = await OneKeyConnect.getSettings();
    if (settings.success) {
        const { payload } = settings;
        (payload.manifest: typeof manifest | null | void);
        (payload.connectSrc: string | void);
        (payload.debug: boolean | void);
        (payload.popup: boolean | void);
        (payload.lazyLoad: boolean | void);
        (payload.webusb: boolean | void);
        (payload.pendingTransportEvent: boolean | void);
        (payload.pendingTransportEvent: boolean | void);
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
        (event.type: 'device-connect' | 'device-connect_unacquired' | 'device-changed' | 'device-disconnect');
        (payload.path: string);
        (payload.type: 'acquired' | 'unacquired' | 'unreadable');
        if (payload.type === 'acquired') {
            (payload.mode: 'normal' | 'bootloader' | 'initialize' | 'seedless');
            (payload.firmware: 'valid' | 'outdated' | 'required' | 'unknown' | 'none');
            (payload.status: 'available' | 'occupied' | 'used');
            // features
            (payload.features.vendor: string | null);
            (payload.features.device_id: string | null);
            (payload.features.major_version: number | null);
            (payload.features.minor_version: number | null);
            (payload.features.patch_version: number | null);
            (payload.features.pin_protection: boolean);
            (payload.features.passphrase_protection: boolean | null);
            (payload.features.label: string | null);
            (payload.features.initialized: boolean);
            (payload.features.revision: string | null);
            (payload.features.needs_backup: boolean);
            (payload.features.flags: number);
            (payload.features.unfinished_backup: boolean);
            (payload.features.no_backup: boolean);
            (payload.features.model: string);
        }
    });
    OneKeyConnect.off(DEVICE_EVENT, () => {});
    // $FlowIssue: invalid event type
    OneKeyConnect.off('DEVICE---EVENT', () => {});

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
