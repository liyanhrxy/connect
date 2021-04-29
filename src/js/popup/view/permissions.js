/* @flow */

import { UiMessage } from '../../message/builder';
import * as UI from '../../constants/ui';
import DataManager from '../../data/DataManager';
import { container, showView, postMessage, createTooltip } from './common';
import type { RequestPermission } from '../../types/events';

const getPermissionText = (permissionType: string, deviceName: string): string => {
    let text: string = '';

    switch (permissionType) {
        case 'read':
            text = '从 OneKey 硬件设备读取公钥';
            break;
        case 'read-meta':
            text = '从 OneKey 硬件设备读取元数据';
            break;
        case 'write':
            text = '从 OneKey 硬件设备进行交易和数据签名';
            break;
        case 'write-meta':
            text = '将元数据写入 OneKey 硬件设备';
            break;
        case 'management':
            text = '修改 OneKey 硬件设备设置';
            break;
        case 'custom-message':
            text = '运行自定义操作';
            break;
    }
    return text;
};

const getPermissionTooltipText = (permissionType: string): string => {
    let text: string = '';

    switch (permissionType) {
        case 'read':
            text = '从您的设备加载公开信息所需的权限';
            break;
        case 'write':
            text = '确认后，获取执行例如签名操作所需的权限';
            break;
        case 'management':
            text = '更改设备设置（例如PIN，密码，标签或备份等）所需的权限。';
            break;
        case 'custom-message':
            text = 'Development tool. Use at your own risk. Allows service to send arbitrary data to your OneKey device.';
            break;
    }
    return text;
};

const createPermissionItem = (permissionText: string, tooltipText: string): HTMLDivElement => {
    const permissionItem = document.createElement('div');
    permissionItem.className = 'permission-item';

    // Tooltip
    if (tooltipText !== '') {
        const tooltip = createTooltip(tooltipText);
        permissionItem.appendChild(tooltip);
    }
    //

    // Permission content (icon & text)
    const contentDiv = document.createElement('div');
    contentDiv.className = 'content';
    const infoIcon = document.createElement('span');
    infoIcon.className = 'info-icon';

    const permissionTextSpan = document.createElement('span');
    permissionTextSpan.innerText = permissionText;
    contentDiv.appendChild(infoIcon);
    contentDiv.appendChild(permissionTextSpan);
    permissionItem.appendChild(contentDiv);
    //

    return permissionItem;
};

export const initPermissionsView = (payload: $PropertyType<RequestPermission, 'payload'>): void => {
    showView('permissions');

    const h3: HTMLElement = container.getElementsByTagName('h3')[0];
    const hostName: HTMLElement = h3.getElementsByClassName('host-name')[0];
    const permissionsList: HTMLElement = container.getElementsByClassName('permissions-list')[0];
    const confirmButton: HTMLElement = container.getElementsByClassName('confirm')[0];
    const cancelButton: HTMLElement = container.getElementsByClassName('cancel')[0];
    const rememberCheckbox: HTMLInputElement = (container.getElementsByClassName('remember-permissions')[0]: any);

    hostName.innerText = DataManager.getSettings('hostLabel') || DataManager.getSettings('origin');
    if (payload && Array.isArray(payload.permissions)) {
        payload.permissions.forEach(p => {
            const permissionText = getPermissionText(p, payload.device.label);
            const tooltipText = getPermissionTooltipText(p);

            const permissionItem = createPermissionItem(permissionText, tooltipText);
            permissionsList.appendChild(permissionItem);
        });
    }

    confirmButton.onclick = () => {
        postMessage(UiMessage(UI.RECEIVE_PERMISSION, {
            remember: (rememberCheckbox && rememberCheckbox.checked),
            granted: true,
        }));
        showView('loader');
    };

    cancelButton.onclick = () => {
        postMessage(UiMessage(UI.RECEIVE_PERMISSION, {
            remember: (rememberCheckbox && rememberCheckbox.checked),
            granted: false,
        }));
        showView('loader');
    };

    rememberCheckbox.onchange = (e) => {
        confirmButton.innerText = e.target.checked ? '当前设备总是允许读取' : '仅当前操作允许读取';
    };
};
