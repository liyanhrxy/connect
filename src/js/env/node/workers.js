/* @flow */
/* istanbul ignore next */
import TinyWorker from 'tiny-worker';
import type { Transport } from '@onekeyhq/link';

type TransportWrapper = (handle?: RNBridge) => Transport;

export const WebUsbPlugin: TransportWrapper | typeof undefined = undefined;
// export const ReactNativeUsbPlugin: TransportWrapper | typeof undefined = undefined;
export const ReactNativeBlePlugin: TransportWrapper | typeof undefined = undefined;

export const BlockbookWorker = () => {
    return new TinyWorker(() => {
        // $FlowIssue
        require('@onekeyhq/blockchain-link/build/node/blockbook-worker');
    });
};

export const RippleWorker = () => {
    return new TinyWorker(() => {
        // $FlowIssue
        require('@onekeyhq/blockchain-link/build/node/ripple-worker');
    });
};
