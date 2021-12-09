/* @flow */

import AbstractMethod from './AbstractMethod';
import { validateParams } from './helpers/paramsValidator';
import { validatePath } from '../../utils/pathUtils';
import { messageToHex } from '../../utils/formatUtils';
import type { CoreMessage } from '../../types';
import type { MessageType } from '../../types/trezor/protobuf';

type Params = {
    ...$ElementType<MessageType, 'ConfluxSignMessage'>,
};

export default class ConfluxSignMessage extends AbstractMethod {
    params: Params;

    constructor(message: CoreMessage) {
        super(message);

        this.requiredPermissions = ['read', 'write'];

        const { payload } = message;

        // validate incoming parameters
        validateParams(payload, [
            { name: 'path', obligatory: true },
            { name: 'message', type: 'string', obligatory: true },
            { name: 'hex', type: 'boolean' },
        ]);

        const path = validatePath(payload.path, 3);
        this.info = 'Sign CFX Message';
        const messageHex = payload.hex ? messageToHex(payload.message) : Buffer.from(payload.message, 'utf8').toString('hex');
        this.params = {
            address_n: path,
            message: messageHex,
        };
    }

    async run() {
        const cmd = this.device.getCommands();
        const { address_n, message } = this.params;
        const response = await cmd.typedCall('ConfluxSignMessage', 'ConfluxMessageSignature', {
            address_n,
            message,
        });
        return response.message;
    }
}
