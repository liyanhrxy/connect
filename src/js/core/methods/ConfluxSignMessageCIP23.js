/* @flow */

import { TypedDataUtils } from 'eth-sig-util';
import AbstractMethod from './AbstractMethod';
import { validateParams } from './helpers/paramsValidator';
import { validatePath } from '../../utils/pathUtils';
import { ERRORS } from '../../constants';

import type { CoreMessage } from '../../types';
import type { MessageType } from '../../types/trezor/protobuf';
type MessageTypeProperty = {
    name: string;
    type: string;
}

type Record<T, V> = {
    [T]: V;
}

type TypedMessage = {
    types: {
        CIP23Domain: MessageTypeProperty[];
        [additionalProperties: string]: MessageTypeProperty[];
    };
    primaryType: string;
    domain: {
        name?: string;
        version?: string;
        chainId?: number;
        verifyingContract?: string;
    };
    message: Record<string, any>;
}

type Params = {
    ...$ElementType<MessageType, 'ConfluxSignMessageCIP23'>,
    data: TypedMessage;
};

export default class ConfluxSignMessageCIP23 extends AbstractMethod {
    params: Params;

    constructor(message: CoreMessage) {
        super(message);

        this.requiredPermissions = ['read', 'write'];

        const { payload } = message;

        // validate incoming parameters
        validateParams(payload, [
            { name: 'path', obligatory: true },
            { name: 'data', type: 'object' },
        ]);

        const path = validatePath(payload.path, 3);
        this.info = 'Sign CFX CIP23 Message';
        this.params = {
            address_n: path,
            data: payload.data,
        };
    }

    async run() {
        const cmd = this.device.getCommands();
        const { address_n, data } = this.params;

        const sanitizedData = TypedDataUtils.sanitizeData(data);

        if (sanitizedData.primaryType === 'CIP23Domain') {
            throw ERRORS.TypedError('Backend_NotSupported', 'primaryType `CIP23Domain` is not support');
        }

        const domainHash = TypedDataUtils.hashStruct(
            'CIP23Domain',
            sanitizedData.domain,
            sanitizedData.types,
        );
        const messageHash = TypedDataUtils.hashStruct(
            sanitizedData.primaryType,
            sanitizedData.message,
            sanitizedData.types,
        );

        const response = await cmd.typedCall('ConfluxSignMessageCIP23', 'ConfluxMessageSignature', {
            address_n,
            domain_hash: domainHash,
            message_hash: messageHash,
        });
        return response.message;
    }
}
