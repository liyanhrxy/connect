/* @flow */

import AbstractMethod from './AbstractMethod';
import { validateParams, getFirmwareRange } from './helpers/paramsValidator';
import { validatePath } from '../../utils/pathUtils';
import { getEthereumNetwork } from '../../data/CoinInfo';
import { toChecksumAddress, getNetworkLabel } from '../../utils/ethereumUtils';

import type { CoreMessage, EthereumNetworkInfo } from '../../types';
import type { MessageType } from '../../types/trezor/protobuf';

type Params = {
    ...$ElementType<MessageType, 'EthereumSignMessage'>,
    network?: EthereumNetworkInfo;
    domain?: string;
};

export default class EthereumSignMessage extends AbstractMethod {
    params: Params;

    constructor(message: CoreMessage) {
        super(message);

        this.requiredPermissions = ['read', 'write'];

        const { payload } = message;

        // validate incoming parameters
        validateParams(payload, [
            { name: 'path', obligatory: true },
            { name: 'message', type: 'string', obligatory: true },
            { name: 'domain', type: 'string', obligatory: true },
            { name: 'hex', type: 'boolean' },
        ]);

        const path = validatePath(payload.path, 3);
        const network = getEthereumNetwork(path);
        this.firmwareRange = getFirmwareRange(this.name, network, this.firmwareRange);

        this.info = getNetworkLabel('Sign #NETWORK message', network);

        this.params = {
            network,
            address_n: path,
            message: payload.message,
            domain: payload.domain,
        };
    }

    async run() {
        const cmd = this.device.getCommands();
        const { address_n, message, network, domain } = this.params;

        const response = await cmd.typedCall('EthereumSignMessageEIP712', 'EthereumMessageSignature', {
            address_n,
            message_hash: message,
            domain_hash: domain,
        });
        response.message.address = toChecksumAddress(response.message.address, network);
        return response.message;
    }
}
