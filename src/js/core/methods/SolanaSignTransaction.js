/* @flow */

import { base58_to_binary, binary_to_base58 } from 'base58-js';

import AbstractMethod from './AbstractMethod';
import { validateParams } from './helpers/paramsValidator';
import { validatePath } from '../../utils/pathUtils';

import type { CoreMessage } from '../../types';
import type { MessageType } from '../../types/trezor/protobuf';

export default class SolanaSignTransaction extends AbstractMethod {
    params: $ElementType<MessageType, 'SolanaSignTx'>;

    constructor(message: CoreMessage) {
        super(message);
        this.requiredPermissions = ['read', 'write'];
        this.info = 'Sign SOL transaction';

        const { payload } = message;

        // validate incoming parameters
        validateParams(payload, [
            { name: 'path', obligatory: true },
            { name: 'rawTx', type: 'string', obligatory: true },
        ]);

        const path = validatePath(payload.path, 3);

        this.params = {
            address_n: path,
            raw_tx: base58_to_binary(payload.rawTx),
        };
    }

    async run() {
        const cmd = this.device.getCommands();
        const { message } = await cmd.typedCall('SolanaSignTx', 'SolanaSignedTx', this.params);
        const signature = binary_to_base58(Buffer.from(message.signature, 'hex'));
        return {
            ...message,
            signature,
        };
    }
}
