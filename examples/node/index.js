/* eslint-disable no-console */
const OneKeyConnect = require('../../npm-extended');

const API = OneKeyConnect.default;

async function main() {
    API.on('UI_EVENT', event => {
        console.log('UI_EVENT', event);
    });

    API.on('DEVICE_EVENT', event => {
        console.log('DEVICE_EVENT', event);
    });

    API.on('RESPONSE_EVENT', event => {
        console.log('RESPONSE_EVENT', event);
    });

    API.on('TRANSPORT_EVENT', event => {
        console.log('TRANSPORT_EVENT', event);
    });

    API.on('BLOCKCHAIN_EVENT', event => {
        console.log('BLOCKCHAIN_EVENT', event);
    });

    await API.init({
        debug: false,
        manifest: {
            email: 'hi@onekey.so',
            appUrl: 'https://onekey.so',
        },
    });

    const featuresResp = await API.getFeatures();
    console.log('features: ', featuresResp);

    const data = {
        domain: {
            name: 'My amazing dApp',
            version: '2',
            chainId: '0x01',
            verifyingContract: '0x1C56346CD2A2Bf3202F771f50d3D14a367B48070',
            salt: '0xf2d857f4a3edcb9b78b4d503bfe733db1e3f6cdc2b7971ee739626c97e86a558',
        },
        message: {
            amount: 100,
            bidder: {
                userId: 323,
                wallet: '0x3333333333333333333333333333333333333333',
            },
        },
        primaryType: 'Bid',
        types: {
            EIP712Domain: [
                { name: 'name', type: 'string' },
                { name: 'version', type: 'string' },
                { name: 'chainId', type: 'uint256' },
                { name: 'verifyingContract', type: 'address' },
                { name: 'salt', type: 'bytes32' },
            ],
            Bid: [
                { name: 'amount', type: 'uint256' },
                { name: 'bidder', type: 'Identity' },
            ],
            Identity: [
                { name: 'userId', type: 'uint256' },
                { name: 'wallet', type: 'address' },
            ],
        },
    };

    const resp = await API.ethereumSignMessageEIP712({
        path: "m/44'/60'/0'",
        data: data,
        version: 'V3',
    });
    console.log(resp);
}

main();
