/* @flow */

import {getInfo} from '@onekeyfe/rollout';
import {isNewer} from '@onekeyfe/rollout/lib/utils/version';
import type {DeviceFirmwareStatus, Features, FirmwareRelease} from '../types';
import {findDefectiveBatchDevice} from '../utils/findDefectiveBatchDevice';
import {getDeviceType} from '../utils/deviceFeaturesUtils';

// [] is weird flow hack https://github.com/facebook/flow/issues/380#issuecomment-224380551
const releases = {
    [1]: [],
    [2]: [],
    ['mini']: [],
};

// strip "data" directory from download url (default: data.trezor.io)
// it's hard coded in "releases.json" ("mytrezor" dir structure)
const cleanUrl = (url: ?string) => {
    if (typeof url !== 'string') return;
    if (url.indexOf('data/') === 0) return url.substring(5);
    return url;
};

export const parseFirmware = (json: JSON, model: number | string): void => {
    const obj: Object = json;
    Object.keys(obj).forEach(key => {
        const release = obj[key];
        releases[model].push({
            ...release,
            url: cleanUrl(release.url),
            url_bitcoinonly: cleanUrl(release.url_bitcoinonly),
        });
    });
};

export const getFirmwareStatus = (features: Features): DeviceFirmwareStatus => {
    // indication that firmware is not installed at all. This information is set to false in bl mode. Otherwise it is null.
    if (features.firmware_present === false) {
        return 'none';
    }
    // for t1 in bootloader, what device reports as firmware version is in fact bootloader version, so we can
    // not safely tell firmware version
    if (features.major_version === 1 && features.bootloader_mode) {
        return 'unknown';
    }

    // refuse to upgrade defective hardware
    if (findDefectiveBatchDevice(features)) {
        const { onekey_version } = features;
        let { major_version, minor_version, patch_version } = features;

        if (onekey_version) {
            const onekey_version_list = onekey_version.split('.').map(Number);
            [major_version, minor_version, patch_version] = onekey_version_list;
        }

        const needUpdate = isNewer([2, 1, 6], [
            major_version,
            minor_version,
            patch_version,
        ]);
        return needUpdate ? 'required' : 'valid';
    }

    const deviceType = getDeviceType(features);
    const deviceSymbol = deviceType === 'mini' ? 'mini' : features.major_version;

    const info = getInfo({features, releases: releases[deviceSymbol]});

    // should not happen, possibly if releases list contains inconsistent data or so
    if (!info) return 'unknown';

    if (info.isRequired) return 'required';

    if (info.isNewer) return 'outdated';

    return 'valid';
};

export const getRelease = (features: Features): ?FirmwareRelease => {
    const deviceType = getDeviceType(features);
    const deviceSymbol = deviceType === 'mini' ? 'mini' : features.major_version;
    return getInfo({features, releases: releases[deviceSymbol]});
};

export const getReleases = (model: number, features: Features): FirmwareRelease[] => {
    const deviceType = getDeviceType(features);
    const deviceSymbol = deviceType === 'mini' ? 'mini' : model;
    return releases[deviceSymbol];
};
