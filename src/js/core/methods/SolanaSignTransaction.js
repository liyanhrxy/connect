/* @flow */

import { base58_to_binary, binary_to_base58 } from 'base58-js';

import AbstractMethod from './AbstractMethod';
import { validateParams } from './helpers/paramsValidator';
import { validatePath } from '../../utils/pathUtils';

import type { CoreMessage } from '../../types';
import type { MessageType } from '../../types/trezor/protobuf';

type Params = $ElementType<MessageType, 'SolanaSignTx'>;
type Response = {
    signature: string;
}
export default class SolanaSignTransaction extends AbstractMethod {
    params: Params[] = [];
    hasBundle: boolean;
    progress: number = 0;

    constructor(message: CoreMessage) {
        super(message);
        this.requiredPermissions = ['read', 'write'];

        this.hasBundle = Object.prototype.hasOwnProperty.call(message.payload, 'bundle');
        const payload = !this.hasBundle ? { ...message.payload, bundle: [ message.payload ] } : message.payload;

        validateParams(payload, [
            { name: 'bundle', type: 'array' },
        ]);

        if (this.params.length === 1) {
            this.info = 'Sign SOL transaction';
        } else {
            this.info = 'Sign multiple SOL transaction';
        }

        payload.bundle.forEach(batch => {
            validateParams(batch, [
                { name: 'path', obligatory: true },
                { name: 'rawTx', type: 'string', obligatory: true },
            ]);

            const path = validatePath(batch.path, 3);

            this.params.push({
                address_n: path,
                raw_tx: base58_to_binary(batch.rawTx),
            });
        });
    }

    async _call(params: Params) {
        const cmd = this.device.getCommands();
        const { message } = await cmd.typedCall('SolanaSignTx', 'SolanaSignedTx', params);
        const signature = binary_to_base58(Buffer.from(message.signature, 'hex'));
        return {
            ...message,
            signature,
        };
    }

    async run() {
        const responses: Response[] = [];

        for (let i = 0; i < this.params.length; i++) {
            const batch = this.params[i];

            const resp = await this._call(batch);
            responses.push(resp);

            this.progress++;
        }
        return this.hasBundle ? responses : responses[0];
    }
}
