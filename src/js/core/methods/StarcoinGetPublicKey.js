/* @flow */

import AbstractMethod from './AbstractMethod';
import { validateParams } from './helpers/paramsValidator';
import { validatePath } from '../../utils/pathUtils';

import * as UI from '../../constants/ui';
import { UiMessage } from '../../message/builder';

import type { CoreMessage } from '../../types';
import type { MessageType } from '../../types/trezor/protobuf';

type Params = {
    ...$ElementType<MessageType, 'StarcoinGetPublicKey'>,
};

export default class EthereumGetPublicKey extends AbstractMethod {
    params: Params[] = [];
    hasBundle: boolean;
    confirmed: ?boolean;

    constructor(message: CoreMessage) {
        super(message);

        this.requiredPermissions = ['read'];

        // create a bundle with only one batch if bundle doesn't exists
        this.hasBundle = Object.prototype.hasOwnProperty.call(message.payload, 'bundle');
        const payload = !this.hasBundle ? { ...message.payload, bundle: [ message.payload ] } : message.payload;

        // validate bundle type
        validateParams(payload, [
            { name: 'bundle', type: 'array' },
        ]);

        payload.bundle.forEach(batch => {
            // validate incoming parameters for each batch
            validateParams(batch, [
                { name: 'path', obligatory: true },
                { name: 'showOnDevice', type: 'boolean' },
            ]);

            const path = validatePath(batch.path, 3);
            // const network = getEthereumNetwork(path);
            // this.firmwareRange = getFirmwareRange(this.name, network, this.firmwareRange);

            let showOnDevice = false;
            if (Object.prototype.hasOwnProperty.call(batch, 'showOnDevice')) {
                showOnDevice = batch.showOnDevice;
            }

            this.params.push({
                address_n: path,
                show_display: showOnDevice,
            });
        });

        // set info
        if (this.params.length === 1) {
            this.info = 'Export STC public key';
        } else {
            this.info = 'Export multiple public keys';
        }
    }

    async confirmation(): Promise<boolean> {
        if (this.confirmed) return true;
        // wait for popup window
        await this.getPopupPromise().promise;
        // initialize user response promise
        const uiPromise = this.createUiPromise(UI.RECEIVE_CONFIRMATION, this.device);

        // request confirmation view
        this.postMessage(UiMessage(UI.REQUEST_CONFIRMATION, {
            view: 'export-xpub',
            label: this.info,
        }));

        // wait for user action
        const uiResp = await uiPromise.promise;

        this.confirmed = uiResp.payload;
        return this.confirmed;
    }

    async run() {
        const responses: {
          path: number[];
          serializedPath: string;
          publicKey: string;
      }[] = [];
        const cmd = this.device.getCommands();
        for (let i = 0; i < this.params.length; i++) {
            const batch = this.params[i];
            const response = await cmd.starcoinGetPublicKey({
                address_n: batch.address_n,
                show_display: batch.show_display,
            });
            responses.push(response);

            if (this.hasBundle) {
                // send progress
                this.postMessage(UiMessage(UI.BUNDLE_PROGRESS, {
                    progress: i,
                    response,
                }));
            }
        }
        return this.hasBundle ? responses : responses[0];
    }
}
