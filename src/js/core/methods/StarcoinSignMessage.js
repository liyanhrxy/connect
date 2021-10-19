/* @flow */

import AbstractMethod from './AbstractMethod';
import { validateParams } from './helpers/paramsValidator';
import { validatePath } from '../../utils/pathUtils';

import type { CoreMessage } from '../../types';
import type { MessageType } from '../../types/trezor/protobuf';
import type { LiskMessageSignature } from '../../types/networks/lisk';

export default class StarcoinSignMessage extends AbstractMethod {
    params: $ElementType<MessageType, 'StarcoinSignMessage'>;

    constructor(message: CoreMessage) {
        super(message);

        this.requiredPermissions = ['read', 'write'];

        const { payload } = message;

        // validate incoming parameters
        validateParams(payload, [
            { name: 'path', obligatory: true },
            { name: 'message', type: 'string', obligatory: true },
        ]);

        const path = validatePath(payload.path, 3);
        this.info = 'Sign STC Message';

        // TODO: check if message is already in hex format
        const messageHex = Buffer.from(payload.message, 'utf8').toString('hex');
        this.params = {
            address_n: path,
            message: messageHex,
        };
    }

    async run(): Promise<LiskMessageSignature> {
        const cmd = this.device.getCommands();
        const { message } = await cmd.typedCall('StarcoinSignMessage', 'StarcoinMessageSignature', this.params);
        return {
            publicKey: message.public_key,
            signature: message.signature,
        };
    }
}
