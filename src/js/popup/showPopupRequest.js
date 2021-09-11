/* @flow */

const layerID: string = 'TrezorConnectInteractionLayer';

const layerInnerHtml: string = `
    <div class="trezorconnect-container" id="${layerID}">
        <div class="trezorconnect-window">
            <div class="trezorconnect-head">
                <div class="trezorconnect-close">
                    <svg x="0px" y="0px" viewBox="24 24 60 60" width="24px" height="24px" preserveAspectRatio="xMinYMin meet">
                        <polygon class="st0" points="40,67.9 42.1,70 55,57.1 67.9,70 70,67.9 57.1,55 70,42.1 67.9,40 55,52.9 42.1,40 40,42.1 52.9,55 "/>
                    </svg>
                </div>
            </div>
            <div class="trezorconnect-body">
                <h3>弹出页面被阻挡</h3>
                <p>请点击 「继续」 手动打开弹出页面内容</p>
                <button class="trezorconnect-open">继续</button>
            </div>
        </div>
    </div>
`;

export const showPopupRequest = (open: () => void, cancel: () => void) => {
    if (document.getElementById(layerID)) {
        return;
    }

    const div: HTMLDivElement = document.createElement('div');
    div.id = layerID;
    div.className = 'trezorconnect-container';
    div.innerHTML = layerInnerHtml;

    if (document.body) {
        document.body.appendChild(div);
    }

    const button: HTMLElement = div.getElementsByClassName('trezorconnect-open')[0];
    button.onclick = () => {
        open();
        if (document.body) { document.body.removeChild(div); }
    };

    const close: HTMLElement = div.getElementsByClassName('trezorconnect-close')[0];
    close.onclick = () => {
        cancel();
        if (document.body) { document.body.removeChild(div); }
    };
};
