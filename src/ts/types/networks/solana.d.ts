// SolanaGetAddress
export interface SolanaGetAddress {
    path: string | number[];
    showOnTrezor?: boolean;
}

// SolanaAddress
export interface SolanaAddress {
    address?: string;
}

// SolanaSignTx
export interface SolanaSignTx {
    path: number[];
    rawTx: string;
}

// SolanaSignedTx
export interface SolanaSignedTx {
    signature: string;
}
