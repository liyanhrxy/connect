/* @flow */

import { isNewer, parse } from '@onekeyhq/rollout/lib/utils/version';
import type { DeviceFirmwareStatus, FirmwareRelease, Features } from '../types';

const release = {};

export const parseBLEFirmware = (json: JSON): void => {
    Object.assign(release, json);
};

export const getBLEFirmwareStatus = (features: Features): DeviceFirmwareStatus => {
    // indication that firmware is not installed at all. This information is set to false in bl mode. Otherwise it is null.
    if (features.ble_enable === false) {
        return 'none';
    }

    // bootloader mode
    if (features.ble_enable !== true) {
        return 'unknown';
    }

    try {
        const parsedFeatures = parse(features.ble_ver.split('.'));
        const parsedRelease = parse(release.version.split('.'));
        const hasNewer = isNewer(parsedRelease, parsedFeatures);

        if (hasNewer && release.isRequired) return 'required';

        if (hasNewer) return 'outdated';
    } catch {
        return 'unknown';
    }

    return 'valid';
};

export const getBLERelease = (): ?FirmwareRelease => {
    return release;
};
