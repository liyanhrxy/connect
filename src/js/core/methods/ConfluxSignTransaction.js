/* @flow */
import {
    isValidCfxAddress,
    decode as toEthAddress,
} from '@conflux-dev/conflux-address-js';
import AbstractMethod from './AbstractMethod';
import { validateParams } from './helpers/paramsValidator';
import { validatePath } from '../../utils/pathUtils';
import { stripHexPrefix } from '../../utils/formatUtils';
import * as helper from './helpers/ethereumSignTx';

import type { CoreMessage } from '../../types';
import type { ConfluxTransaction } from '../../types/networks/conflux';

type Params = {
    path: number[];
    transaction: ConfluxTransaction;
}

export default class ConfluxSignTx extends AbstractMethod {
    params: Params;

    constructor(message: CoreMessage) {
        super(message);

        this.requiredPermissions = ['read', 'write'];

        const { payload } = message;

        // validate incoming parameters
        validateParams(payload, [
            { name: 'transaction', obligatory: true },
        ]);

        const path = validatePath(payload.path, 3);
        this.info = 'Sign CFX transaction';
        const tx: ConfluxTransaction = payload.transaction;
        validateParams(tx, [
            { name: 'to', type: 'string', obligatory: true },
            { name: 'value', type: 'string', obligatory: true },
            { name: 'gasLimit', type: 'string', obligatory: true },
            { name: 'gasPrice', type: 'string', obligatory: true },
            { name: 'nonce', type: 'string', obligatory: true },
            { name: 'epochHeight', type: 'string', obligatory: true },
            { name: 'storageLimit', type: 'string', obligatory: true },
            { name: 'chainId', type: 'number' },
            { name: 'data', type: 'string' },
        ]);

        // TODO: check if tx data is a valid hex

        // strip '0x' from values
        Object.keys(tx).map(key => {
            if (typeof tx[key] === 'string') {
                let value: string = stripHexPrefix(tx[key]);
                // pad left even
                if (value.length % 2 !== 0) { value = '0' + value; }
                // $FlowIssue
                tx[key] = value;
            }
        });

        this.params = {
            path,
            transaction: tx,
        };
    }

    async run() {
        const tx = this.params.transaction;
        if (isValidCfxAddress((tx.to))) {
            const addressInfo = toEthAddress(tx.to);
            if (addressInfo.netId !== tx.chainId) {
                throw new Error('Invalid address with mismatched chain id');
            } else {
                tx.to = '0x' + toEthAddress(tx.to).hexAddress.toString('hex');
            }
        }
        return helper.confluxSignTx(
            this.device.getCommands().typedCall.bind(this.device.getCommands()),
            this.params.path,
            tx.to,
            tx.value,
            tx.gasLimit,
            tx.gasPrice,
            tx.nonce,
            tx.epochHeight,
            tx.storageLimit,
            tx.chainId,
            tx.data,
        );
    }
}
