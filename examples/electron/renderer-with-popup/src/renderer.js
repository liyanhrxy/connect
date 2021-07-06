// OneKeyConnect is injected as inline script in html
// therefore it doesn't need to included into node_modules
// get reference straight from window object
const OneKeyConnect = window.OneKeyConnect;

// SETUP trezor-connect

// Listen to DEVICE_EVENT
// this event will be emitted only after user grants permission to communicate with this app
OneKeyConnect.on('DEVICE_EVENT', event => {
    printLog(event);
});

// Initialize OneKeyConnect
OneKeyConnect.init({
    webusb: false, // webusb is not supported in electron
    debug: false, // see whats going on inside iframe
    lazyLoad: true, // set to "false" (default) if you want to start communication with bridge on application start (and detect connected device right away)
    // set it to "true", then trezor-connect will not be initialized until you call some OneKeyConnect.method()
    // this is useful when you don't know if you are dealing with Trezor user
    manifest: {
        email: 'email@developer.com',
        appUrl: 'electron-app-boilerplate',
    },
}).then(() => {
    printLog('OneKeyConnect is ready!');
}).catch(error => {
    printLog('OneKeyConnect init error: ' + error);
});

// click to get public key
const btn = document.getElementById('get-xpub');
btn.onclick = () => {
    OneKeyConnect.getPublicKey({
        path: "m/49'/0'/0'",
        coin: 'btc',
    }).then(response => {
        printLog(response);
    });
};

// print log helper
function printLog(data) {
    const log = document.getElementById('log');
    const current = log.value;
    if (current.length > 0) {
        log.value = JSON.stringify(data) + '\n\n' + current;
    } else {
        log.value = JSON.stringify(data);
    }
}
