/* eslint-disable no-console */
import API from '../../npm-extended';

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
    window.API = API;
    const featuresResp = await API.getFeatures();

    console.log('device feature response', featuresResp);
}

main();
