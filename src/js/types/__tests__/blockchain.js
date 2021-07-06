/* @flow */
import OneKeyConnect from '../../index';

export const blockchainEstimateFee = async () => {
    const levels = [
        {
            label: 'high',
            blocks: 1,
            feeLimit: '100',
            feePerTx: '100',
            feePerUnit: '100',
        },
        {
            label: 'normal',
            feePerUnit: '100',
            blocks: 0,
        },
        {
            label: 'economy',
            feePerUnit: '100',
            blocks: 0,
        },
        {
            label: 'low',
            feePerUnit: '100',
            blocks: 0,
        },
        {
            label: 'custom',
            feePerUnit: '100',
            blocks: 0,
        },
    ];

    const simple = await OneKeyConnect.blockchainEstimateFee({ coin: 'btc' });
    if (simple.success) {
        const { payload } = simple;
        (payload.blockTime: number);
        (payload.minFee: number);
        (payload.maxFee: number);
        (payload.levels: typeof levels);
    }

    OneKeyConnect.blockchainEstimateFee({
        coin: 'btc',
        request: {
            blocks: [0],
            specific: {
                conservative: true,
                data: '0x',
                from: '0x',
                to: '0x',
                txsize: 100,
            },
            feeLevels: 'smart',
        },
    });

    OneKeyConnect.blockchainEstimateFee({
        coin: 'btc',
        request: {
            feeLevels: 'preloaded',
        },
    });
};

export const blockchainGetTransactions = async () => {
    const txs = await OneKeyConnect.blockchainGetTransactions({ coin: 'btc', txs: ['txid'] });
    if (txs.success) {
        const { payload } = txs;
        payload.forEach(tx => {
            if (tx.type === 'blockbook') {
                // (tx.vin: any[]);
            }
        });
    }
};

export const others = async () => {
    const accounts = [
        {
            descriptor: 'xpub',
            addresses: {
                used: [],
                unused: [],
                change: [],
            },
        },
        {
            descriptor: '0x00',
        },
    ];

    OneKeyConnect.blockchainSubscribe({
        accounts,
        coin: 'btc',
    });

    OneKeyConnect.blockchainSubscribe({
        coin: 'btc',
    });

    OneKeyConnect.blockchainUnsubscribe({
        accounts,
        coin: 'btc',
    });

    OneKeyConnect.blockchainUnsubscribe({
        coin: 'btc',
    });

    OneKeyConnect.blockchainDisconnect({ coin: 'btc' });

    OneKeyConnect.blockchainSetCustomBackend({
        coin: 'btc',
        blockchainLink: undefined,
    });

    OneKeyConnect.blockchainSetCustomBackend({
        coin: 'btc',
    });

    OneKeyConnect.blockchainSetCustomBackend({
        coin: 'btc',
        blockchainLink: {
            type: 'blockbook',
            url: ['https://btc1.trezor.io/'],
        },
    });
};
