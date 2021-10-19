/* @flow */

import { UI_EVENT, DEVICE_EVENT, TRANSPORT_EVENT, RESPONSE_EVENT, BLOCKCHAIN_EVENT } from '../constants';
import type { CoreMessage, UiMessageBuilder, BlockchainMessageBuilder } from '../types';

export const UiMessage: UiMessageBuilder = (type, payload) => (
    {
        event: UI_EVENT,
        type,
        payload,
    }
);

export const DeviceMessage = (type: string, payload: any): CoreMessage => (
    {
        event: DEVICE_EVENT,
        type,
        payload,
    }
);

export const TransportMessage = (type: string, payload: any): CoreMessage => (
    {
        event: TRANSPORT_EVENT,
        type,
        // convert Error/TypeError object into payload error type (Error object/class is converted to string while sent via postMessage)
        payload: payload.error ? { ...payload, error: payload.error.message, code: payload.error.code } : payload,
    }
);

export const ResponseMessage = (
    id: number,
    success: boolean,
    payload: any = null,
    { message, method }: { message?: any, method?: any } = {},
): CoreMessage => {
    const device = {};
    const includingFeatures = Boolean(message?.payload?.includingFeatures);
    if (includingFeatures) {
        device.features = method?.device?.features ?? {};
    }
    return {
        event: RESPONSE_EVENT,
        type: RESPONSE_EVENT,
        id,
        success,
        device,
        // convert Error/TypeError object into payload error type (Error object/class is converted to string while sent via postMessage)
        payload: success ? payload : { error: payload.error.message, code: payload.error.code },
    };
};

export const BlockchainMessage: BlockchainMessageBuilder = (type, payload) => (
    {
        event: BLOCKCHAIN_EVENT,
        type,
        payload,
    }
);
