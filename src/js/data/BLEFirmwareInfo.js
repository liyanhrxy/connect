/* @flow */

import {isNewer} from '@onekeyhq/rollout/lib/utils/version';
import type {DeviceFirmwareStatus, Features, FirmwareRelease} from '../types';

const releases: FirmwareRelease[] = [];

export const parseBLEFirmware = (json: JSON): void => {
    if (!json) return;
    const obj: Object = json;
    Object.keys(obj).forEach(key => {
        const release = obj[key];
        releases.push(release);
    });
};

export const getBLEFirmwareStatus = (features: Features): DeviceFirmwareStatus => {
    // refuse to upgrade defective hardware
    if (features.se_ver === '1.1.0.2') {
        return 'valid';
    }

    // indication that firmware is not installed at all. This information is set to false in bl mode. Otherwise it is null.
    if (features.ble_enable === false) {
        return 'none';
    }

    // bootloader mode
    if (features.ble_enable !== true) {
        return 'unknown';
    }

    const info = getInfo({features, releases});

    // should not happen, possibly if releases list contains inconsistent data or so
    if (!info) return 'unknown';

    if (info.isRequired) return 'required';

    if (info.isNewer) return 'outdated';

    return 'valid';
};

export const getBLERelease = (features: Features): ?FirmwareRelease => {
    return getInfo({features, releases});
};

export const getBLEReleases = (): FirmwareRelease[] => {
    return releases;
};

const isRequired = (changelog) => {
    if (!changelog || !changelog.length) return null;
    return changelog.some(item => item.required);
};

function getInfo({features, releases}: { features: Features; releases: FirmwareRelease[] }) {
    if (typeof features.ble_ver !== 'string') {
        return null;
    }

    const splitedVersion = features.ble_ver.split('.');

    if (splitedVersion.length !== 3) {
        return null;
    }

    const parsedReleases = releases.map(r => ({...r, version: r.version.split('.')}));
    const changelog = parsedReleases.filter(r => isNewer(r.version, splitedVersion));

    if (!parsedReleases.length) {
        // no new firmware
        return null;
    }

    return {
        changelog,
        release: parsedReleases[0],
        isRequired: isRequired(changelog),
        isNewer: isNewer(parsedReleases[0].version, splitedVersion),
    };
}
