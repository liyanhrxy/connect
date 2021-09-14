/* @flow */

import { TypedDataUtils } from 'eth-sig-util';
import AbstractMethod from './AbstractMethod';
import { validateParams, getFirmwareRange } from './helpers/paramsValidator';
import { validatePath } from '../../utils/pathUtils';
import { getEthereumNetwork } from '../../data/CoinInfo';
import { toChecksumAddress, getNetworkLabel } from '../../utils/ethereumUtils';
import { ERRORS } from '../../constants';

import type { CoreMessage, EthereumNetworkInfo } from '../../types';
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
        EIP712Domain: MessageTypeProperty[];
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

type VERSION = 'V3' | 'V4';

type Params = {
    ...$ElementType<MessageType, 'EthereumSignMessage'>,
    network?: EthereumNetworkInfo;
    version: VERSION;
    data: TypedMessage;
};

export default class EthereumSignMessage712 extends AbstractMethod {
    params: Params;

    constructor(message: CoreMessage) {
        super(message);

        this.requiredPermissions = ['read', 'write'];

        const { payload } = message;

        // validate incoming parameters
        validateParams(payload, [
            { name: 'path', obligatory: true },
            { name: 'data', type: 'object' },
            { name: 'version', type: 'string' },
        ]);

        const path = validatePath(payload.path, 3);
        const network = getEthereumNetwork(path);
        this.firmwareRange = getFirmwareRange(this.name, network, this.firmwareRange);

        this.info = getNetworkLabel('Sign #NETWORK message', network);

        this.params = {
            network,
            address_n: path,
            data: payload.data,
        };
    }

    async run() {
        const cmd = this.device.getCommands();
        const { address_n, network, version, data } = this.params;

        const useV4 = version === 'V4';
        const sanitizedData = TypedDataUtils.sanitizeData(data);

        if (sanitizedData.primaryType === 'EIP712Domain') {
            throw ERRORS.TypedError('Backend_NotSupported', 'primaryType `EIP712Domain` is not support');
        }

        const domainHash = TypedDataUtils.hashStruct(
            'EIP712Domain',
            sanitizedData.domain,
            sanitizedData.types,
            useV4
        );
        const messageHash = TypedDataUtils.hashStruct(
            sanitizedData.primaryType,
            sanitizedData.message,
            sanitizedData.types,
            useV4
        );

        const response = await cmd.typedCall('EthereumSignMessageEIP712', 'EthereumMessageSignature', {
            address_n,
            domain_hash: domainHash,
            message_hash: messageHash,
        });
        response.message.address = toChecksumAddress(response.message.address, network);
        return response.message;
    }
}
