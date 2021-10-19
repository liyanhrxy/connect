/* @flow */

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
            raw_tx: payload.rawTx,
        };
    }

    async run() {
        const cmd = this.device.getCommands();
        const response = await cmd.typedCall('SolanaSignTx', 'SolanaSignedTx', this.params);
        return response.message;
    }
}
