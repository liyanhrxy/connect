/* @flow */

import AbstractMethod from './AbstractMethod';
import { validateParams } from './helpers/paramsValidator';
import { validatePath, getSerializedPath } from '../../utils/pathUtils';
import { stripHexPrefix } from '../../utils/formatUtils';

import { UI, ERRORS } from '../../constants';
import { UiMessage } from '../../message/builder';

import type { EthereumAddress } from '../../types/networks/ethereum';
import type { CoreMessage } from '../../types';
import type { MessageType } from '../../types/trezor/protobuf';

type Params = {
    ...$ElementType<MessageType, 'StarcoinGetAddress'>,
    address?: string;
};

export default class StarcoinGetAddress extends AbstractMethod {
    params: Params[] = [];
    hasBundle: boolean;
    progress: number = 0;
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
            { name: 'useEventListener', type: 'boolean' },
        ]);

        payload.bundle.forEach(batch => {
            // validate incoming parameters for each batch
            validateParams(batch, [
                { name: 'path', obligatory: true },
                { name: 'address', type: 'string' },
                { name: 'showOnDevice', type: 'boolean' },
            ]);

            const path = validatePath(batch.path, 3);

            let showOnDevice = true;
            if (Object.prototype.hasOwnProperty.call(batch, 'showOnDevice')) {
                showOnDevice = batch.showOnDevice;
            }

            this.params.push({
                address_n: path,
                show_display: showOnDevice,
                address: batch.address,
            });
        });

        // set info
        if (this.params.length === 1) {
            this.info = 'Export STC address';
        } else {
            this.info = 'Export multiple addresses';
        }

        const useEventListener = payload.useEventListener && this.params.length === 1 && typeof this.params[0].address === 'string' && this.params[0].show_display;
        this.confirmed = useEventListener;
        this.useUi = !useEventListener;
    }

    getButtonRequestData(code: string) {
        if (code === 'ButtonRequest_Address') {
            const data = {
                type: 'address',
                serializedPath: getSerializedPath(this.params[this.progress].address_n),
                address: this.params[this.progress].address || 'not-set',
            };
            return data;
        }
        return null;
    }

    async confirmation(): Promise<boolean> {
        if (this.confirmed) return true;
        // wait for popup window
        await this.getPopupPromise().promise;
        // initialize user response promise
        const uiPromise = this.createUiPromise(UI.RECEIVE_CONFIRMATION, this.device);

        // request confirmation view
        this.postMessage(UiMessage(UI.REQUEST_CONFIRMATION, {
            view: 'export-address',
            label: this.info,
        }));

        // wait for user action
        const uiResp = await uiPromise.promise;

        this.confirmed = uiResp.payload;
        return this.confirmed;
    }

    async noBackupConfirmation(): Promise<boolean> {
        // wait for popup window
        await this.getPopupPromise().promise;
        // initialize user response promise
        const uiPromise = this.createUiPromise(UI.RECEIVE_CONFIRMATION, this.device);

        // request confirmation view
        this.postMessage(UiMessage(UI.REQUEST_CONFIRMATION, {
            view: 'no-backup',
        }));

        // wait for user action
        const uiResp = await uiPromise.promise;
        return uiResp.payload;
    }

    async _call({
        address_n,
        show_display,
    }: Params) {
        const cmd = this.device.getCommands();
        return cmd.starcoinGetAddress({
            address_n,
            show_display,
        });
    }

    async run() {
        const responses: EthereumAddress[] = [];

        for (let i = 0; i < this.params.length; i++) {
            const batch = this.params[i];
            // silently get address and compare with requested address
            // or display as default inside popup
            if (batch.show_display) {
                const silent = await this._call({
                    ...batch,
                    show_display: false,
                });
                if (typeof batch.address === 'string') {
                    if (stripHexPrefix(batch.address).toLowerCase() !== stripHexPrefix(silent.address).toLowerCase()) {
                        throw ERRORS.TypedError('Method_AddressNotMatch');
                    }
                } else {
                    // save address for future verification in "getButtonRequestData"
                    batch.address = silent.address;
                }
            }
            const response = await this._call(batch);
            responses.push(response);

            if (this.hasBundle) {
                // send progress
                this.postMessage(UiMessage(UI.BUNDLE_PROGRESS, {
                    progress: i,
                    response,
                }));
            }

            this.progress++;
        }
        return this.hasBundle ? responses : responses[0];
    }
}
