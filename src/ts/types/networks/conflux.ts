// sign transaction
// get address

export interface ConfluxGetAddress {
    path: string | number[];
    chainId: number;
    address?: string;
    showOnTrezor?: boolean;
}

export interface ConfluxTransaction {
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

export interface ConfluxSignTransaction  {
    path: string | number[];
    transaction: ConfluxTransaction;
}
