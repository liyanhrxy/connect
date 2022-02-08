/* @flow */
// StarcoinGetAddress
export type StarcoinGetAddress = {
    path: number[];
    showOnTrezor?: boolean;
};

// StarcoinAddress
export type StarcoinAddress = {
    address?: string;
};

// StarcoinGetPublicKey
export type StarcoinGetPublicKey = {
    path: number[];
    showOnTrezor?: boolean;
};

// StarcoinPublicKey
export type StarcoinPublicKey = {
    publicKey?: string;
};

// StarcoinSignTx
export type StarcoinSignTx = {
    path: number[];
    rawTx?: string;
};

// StarcoinSignedTx
export type StarcoinSignedTx = {
    publicKey?: string;
    signature?: string;
};

// StarcoinSignMessage
export type StarcoinSignMessage = {
    path: number[];
    message?: string;
};

// StarcoinMessageSignature
export type StarcoinMessageSignature = {
    publicKey?: string;
    signature?: string;
};

// StarcoinVerifyMessage
export type StarcoinVerifyMessage = {
    publicKey?: string;
    signature?: string;
    message?: string;
};
