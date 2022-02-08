// StarcoinGetAddress
export interface StarcoinGetAddress {
    path: number[];
    showOnTrezor?: boolean;
}

// StarcoinAddress
export interface StarcoinAddress {
    address?: string;
}

// StarcoinGetPublicKey
export interface StarcoinGetPublicKey {
    path: number[];
    showOnTrezor?: boolean;
}

// StarcoinPublicKey
export interface StarcoinPublicKey {
    publicKey?: string;
}

// StarcoinSignTx
export interface StarcoinSignTx {
    path: number[];
    rawTx?: string;
}

// StarcoinSignedTx
export interface StarcoinSignedTx {
    publicKey?: string;
    signature?: string;
}

// StarcoinSignMessage
export interface StarcoinSignMessage {
    path: number[];
    message?: string;
}

// StarcoinMessageSignature
export interface StarcoinMessageSignature {
    publicKey?: string;
    signature?: string;
}

// StarcoinVerifyMessage
export interface StarcoinVerifyMessage {
    publicKey?: string;
    signature?: string;
    message?: string;
}
