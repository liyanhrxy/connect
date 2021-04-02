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
        debug: true,
        manifest: {
            email: 'hi@onekey.so',
            appUrl: 'https://onekey.so',
        },
    });

    const featuresResp = await API.getFeatures();
    console.log('features: ', featuresResp);
}

main();
