/* @flow */
'use strict';

import AbstractMethod from './AbstractMethod';

import * as UI from '../../constants/ui';
import { UiMessage } from '../../message/builder';
import type { Success } from '../../types/trezor';
import type { CoreMessage, UiPromiseResponse } from '../../types';

export default class BixinReboot extends AbstractMethod {
    confirmed: boolean = false;

    constructor(message: CoreMessage) {
        super(message);
        this.requiredPermissions = ['management'];
        this.useEmptyPassphrase = true;
    }

    async confirmation(): Promise<boolean> {
        if (this.confirmed) return true;
        // wait for popup window
        await this.getPopupPromise().promise;
        // initialize user response promise
        const uiPromise = this.createUiPromise(UI.RECEIVE_CONFIRMATION, this.device);

        // request confirmation view
        this.postMessage(new UiMessage(UI.REQUEST_CONFIRMATION, {
            view: 'device-management',
            customConfirmButton: {
                className: 'reboot',
                label: `Reboot ${this.device.toMessageObject().label}`,
            },
            label: 'Are you sure you want to reboot your device?',
        }));

        // wait for user action
        const uiResp: UiPromiseResponse = await uiPromise.promise;

        this.confirmed = uiResp.payload;
        return this.confirmed;
    }

    async run(): Promise<Success> {
        return this.device.getCommands().bixinReboot();
    }
}
