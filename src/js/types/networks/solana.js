/* @flow */

// SolanaGetAddress
export type SolanaGetAddress = {
    path: string | number[];
    showOnTrezor?: boolean;
};

// SolanaAddress
export type SolanaAddress = {
    address?: string;
};

// SolanaSignTx
export type SolanaSignTx = {
    path: number[];
    rawTx: string;
};

// SolanaSignedTx
export type SolanaSignedTx = {
    signature: string;
};

