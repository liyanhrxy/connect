/* @flow */

// sign transaction
// get address

export type ConfluxGetAddress = {
    path: string | number[];
    chainId: number;
    address?: string;
    showOnTrezor?: boolean;
}

export type ConfluxTransaction = {
    to: string;
    value: string;
    gasPrice: string;
    gasLimit: string;
    nonce: string;
    epochHeight: string;
    storageLimit: string;
    chainId: number;
    data?: string;
}

export type ConfluxSignTransaction = {
    path: string | number[];
    transaction: ConfluxTransaction;
}
