/* eslint-disable no-unused-vars */
import SharedConnectionWorker from 'sharedworker-loader?name=workers/shared-connection-worker.[hash].js!@onekeyhq/link/lib/lowlevel/sharedConnectionWorker';
import BlockbookWorker from 'worker-loader?filename=workers/blockbook-worker.[hash].js!@onekeyhq/blockchain-link/lib/workers/blockbook/index.js';
import RippleWorker from 'worker-loader?filename=workers/ripple-worker.[hash].js!@onekeyhq/blockchain-link/lib/workers/ripple/index.js';

import TrezorLink from '@onekeyhq/link';

const WebUsbPlugin = () => {
    return new TrezorLink.Lowlevel(new TrezorLink.WebUsb(), typeof SharedWorker !== 'undefined' ? () => new SharedConnectionWorker() : null);
};

const ReactNativeUsbPlugin = undefined;

export {
    WebUsbPlugin,
    ReactNativeUsbPlugin,
    BlockbookWorker,
    RippleWorker,
};
