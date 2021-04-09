import '../../styles/tools.less';

import { call, manifest } from '../env/browser';

const reconnect = document.getElementById('reconnect');

manifest({
    email: 'hi@onekey.so',
    appUrl: 'https://www.onekey.so',
});

reconnect.addEventListener('click', () => {
    call({ method: 'getFeatures' }).then((res) => {
        if (res && res.success) {
            // eslint-disable-next-line no-console
            console.log(res);
            alert('reset success');
        }
    }).catch(() => {
        alert('reset failure');
    });
});
