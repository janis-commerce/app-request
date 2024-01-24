import {
	getApplicationName,
	getBuildNumber,
	getVersion,
	getBundleId,
	getSystemName,
	getSystemVersion,
	getUniqueId,
	getModel,
} from 'react-native-device-info';
import {getHeaders} from './helpers.js';

/**
 * @function getDeviceData
 * @description return data from device user
 * @returns {{
 * 'application-name': string,
 * 'build-number': string,
 * 'app-version': string,
 * 'bundle-id': string,
 * 'os-name': string,
 * 'device-id': string,
 * 'device-name': string
 * }} - Object with device data
 * @example getDeviceData() => {applicationName: 'AppName', buildNumber: '434', appVersion: '1.5.0', bundleId: 'com.janis.appname', osName: 'android', osVersion: '11', deviceId: '34hf83hf89ahfjo', deviceName: 'Pixel 2'}
 */

export const getDeviceData = () => {
	const applicationName = getApplicationName() || '';
	const buildNumber = getBuildNumber() || '';
	const appVersion = getVersion() || '';
	const bundleId = getBundleId() || '';
	const osName = getSystemName() || '';
	const osVersion = getSystemVersion() || '';
	const deviceId = getUniqueId() || '';
	const deviceName = getModel() || '';

	return {
		'janis-app-name': applicationName,
		'janis-app-build': buildNumber,
		'janis-app-version': appVersion,
		'janis-app-package-name': bundleId,
		'janis-app-device-os-name': osName,
		'janis-app-device-os-version': osVersion,
		'janis-app-device-id': deviceId,
		'janis-app-device-name': deviceName,
	};
};
/**
 * @name updateHeaders
 * @description get correct headers for janis api
 * @param {object} [params={}] - object with params
 * @param {object} [customHeaders={}] - object with customs params
 * @param {string} params.client - client name for janis api
 * @param {string} params.accessToken - access token for janis api
 * @param {number} params.page - number of page
 * @param {number} params.pageSize - quantity per page
 * @param {boolean} params.getTotals - request api totals
 * @param {boolean} params.getOnlyTotals - request api totals without body response
 * @returns object
 * @module utils:api:utils
 */
const updateHeaders = (params, customHeaders) => {
	const deviceData = getDeviceData();

	return getHeaders(params, deviceData, customHeaders);
};

export default updateHeaders;
