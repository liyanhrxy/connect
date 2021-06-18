/* @flow */

import {getInfo} from '@onekeyhq/rollout';
import type {DeviceFirmwareStatus, Features, FirmwareRelease} from '../types';
import {findDefectiveBatchDevice} from '../utils/findDefectiveBatchDevice';

// [] is weird flow hack https://github.com/facebook/flow/issues/380#issuecomment-224380551
const releases = {
    [1]: [],
    [2]: [],
};

// strip "data" directory from download url (default: data.trezor.io)
// it's hard coded in "releases.json" ("mytrezor" dir structure)
const cleanUrl = (url: ?string) => {
    if (typeof url !== 'string') return;
    if (url.indexOf('data/') === 0) return url.substring(5);
    return url;
};

export const parseFirmware = (json: JSON, model: number): void => {
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

export const parse = (versionArr: VersionArray) => {
    return {
        major: versionArr[0],
        minor: versionArr[1],
        patch: versionArr[2],
    };
};

const isNewer = (versionX: VersionArray, versionY: VersionArray) => {
    const parsedX = parse(versionX);
    const parsedY = parse(versionY);

    if (parsedX.major - parsedY.major !== 0) {
        return parsedX.major > parsedY.major;
    }
    if (parsedX.minor - parsedY.minor !== 0) {
        return parsedX.minor > parsedY.minor;
    }
    if (parsedX.patch - parsedY.patch !== 0) {
        return parsedX.patch > parsedY.patch;
    }

    return false;
};

export const getFirmwareStatus = (features: Features): DeviceFirmwareStatus => {
    // refuse to upgrade defective hardware
    if (findDefectiveBatchDevice(features)) {
        const needUpdate = isNewer([2, 1, 6], [
            features.fw_major,
            features.fw_minor,
            features.fw_patch,
        ]);
        return needUpdate ? 'required' : 'valid';
    }

    // indication that firmware is not installed at all. This information is set to false in bl mode. Otherwise it is null.
    if (features.firmware_present === false) {
        return 'none';
    }
    // for t1 in bootloader, what device reports as firmware version is in fact bootloader version, so we can
    // not safely tell firmware version
    if (features.major_version === 1 && features.bootloader_mode) {
        return 'unknown';
    }
    const info = getInfo({features, releases: releases[features.major_version]});

    // should not happen, possibly if releases list contains inconsistent data or so
    if (!info) return 'unknown';

    if (info.isRequired) return 'required';

    if (info.isNewer) return 'outdated';

    return 'valid';
};

export const getRelease = (features: Features): ?FirmwareRelease => {
    return getInfo({features, releases: releases[features.major_version]});
};

export const getReleases = (model: number): FirmwareRelease[] => {
    return releases[model];
};
