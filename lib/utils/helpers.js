const formatDeviceDataForUserAgent = (deviceData) => {
	if (!isObject(deviceData) || !Object.keys(deviceData).length) return {};

	const keysToCheck = [
		'janis-app-package-name',
		'janis-app-version',
		'janis-app-name',
		'janis-app-build',
		'janis-app-device-os-name',
		'janis-app-device-os-version',
		'janis-app-device-id',
		'janis-app-device-name',
	];

	const hasSomeValidValues = keysToCheck.some(
		(key) => isString(deviceData[key]) && !!deviceData[key],
	);

	if (!hasSomeValidValues) return {};

	const userAgentParts = [];

	keysToCheck.forEach((key) => {
		const value =
			!deviceData[key] || !isString(deviceData[key]) ? `unknown ${key}` : deviceData[key];
		userAgentParts.push(value);
	});

	return {
		'user-agent': `${userAgentParts[0]}/${userAgentParts[1]} (${userAgentParts[2]}; ${userAgentParts[3]}) ${userAgentParts[4]}/${userAgentParts[5]} (${userAgentParts[6]}; ${userAgentParts[7]})`,
	};
};

const filterValidHeaders = (headers) => {
	if (!headers || !isObject(headers) || !Object.keys(headers).length) return {};

	return Object.fromEntries(
		Object.entries(headers).filter(([, value]) => !!value && !!isString(value)),
	);
};

/**
 * @function getHeaders
 * @param {object} [params={}] - object with params
 * @param {object} [deviceDataHeaders={}] - headers with the device info
 * @param {object} [customHeaders={}] - extra custom headers
 * @param {string} params.client - client name for janis api
 * @param {string} params.accessToken - access token for janis api
 * @param {number} params.page - number of page
 * @param {number} params.pageSize - quantity per page
 * @param {boolean} params.getTotals - request api totals
 * @param {boolean} params.getOnlyTotals - request api totals without body response
 * @description get correct headers for janis api
 * @returns {object}
 * @example
 * const params = {
 *   client: 'my-client',
 *   accessToken: 'my-access-token',
 *   page: 1,
 *   pageSize: 10,
 *   getTotals: true,
 *   getOnlyTotals: false
 * };
 * const deviceDataHeaders = {
 *   'janis-app-name': 'MyApp',
 *   'janis-app-version': '1.0.0',
 *   'janis-app-device-os-name': 'iOS',
 *   'janis-app-device-os-version': '14.5',
 *   'janis-app-device-name': 'iPhone 12',
 *   'janis-app-device-id': '123456789'
 * };
 * const customHeaders = {
 *   'custom-header': 'custom-value'
 * };
 * const headers = getHeaders(params, deviceDataHeaders, customHeaders);
 * // {
 * //   'content-Type': 'application/json',
 * //   'janis-api-key': 'Bearer',
 * //   'janis-client': 'my-client',
 * //   'janis-api-secret': 'my-access-token',
 * //   'x-janis-page': 1,
 * //   'x-janis-page-size': 10,
 * //   'x-janis-totals': true,
 * //   'x-janis-only-totals': false,
 * //   'user-agent': 'MyApp/1.0.0 (iOS 14.5; iPhone 12; 123456789)',
 * //   'custom-header': 'custom-value'
 * // }
 */
export const getHeaders = (params = {}, deviceDataHeaders = {}, customHeaders = {}) => {
	const validCustomHeaders = filterValidHeaders(customHeaders);
	const validDeviceDataHeaders = filterValidHeaders(deviceDataHeaders);
	const validUserAgentHeader = formatDeviceDataForUserAgent(validDeviceDataHeaders);

	const baseHeaders = {
		'content-Type': 'application/json',
		'janis-api-key': 'Bearer',
		...validUserAgentHeader,
		...validDeviceDataHeaders,
		...validCustomHeaders,
	};

	if (!isObject(params)) return baseHeaders;
	const {client, accessToken, page, pageSize, getTotals, getOnlyTotals} = params;

	return {
		...baseHeaders,
		...(isString(client) && client && {'janis-client': client}),
		...(isString(accessToken) && accessToken && {'janis-api-secret': accessToken}),
		...(isNumber(page) && page && {'x-janis-page': page}),
		...(isNumber(pageSize) && pageSize && {'x-janis-page-size': pageSize}),
		...(isBoolean(getTotals) && getTotals && {'x-janis-totals': getTotals}),
		...(isBoolean(getOnlyTotals) && getOnlyTotals && {'x-janis-only-totals': getOnlyTotals}),
	};
};

export const isBoolean = (bool) => typeof bool === 'boolean';

export const isString = (str) => !!(typeof str === 'string');

export const isObject = (obj) => !!(obj && obj.constructor === Object);

export const isArray = (arr) => !!(arr instanceof Array);

export const isNumber = (num) => typeof num === 'number' && !Number.isNaN(Number(num));

export const promiseWrapper = (promise) =>
	promise.then((data) => [data, null]).catch((error) => Promise.resolve([null, error]));
