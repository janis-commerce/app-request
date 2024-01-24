import {isString} from './helpers.js';

/**
 * @function getApiService
 * @param {string} service
 * @returns {string} url api
 * @example getApiService('catalog') // 'https://catalog.janisdev.in/api'
 */

const getApiService = (service = '', JANIS_ENV) => {
	if (!service || !isString(service)) return '';
	if (!JANIS_ENV || !isString(JANIS_ENV)) return '';

	return `https://${service}.${JANIS_ENV}.in/api`;
};

export default getApiService;
