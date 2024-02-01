import axios from 'axios';
import {isNumber, isString, isObject} from './utils/helpers.js';
import crashlytics from './utils/crashlytics.js';
import updateHeaders from './utils/updateHeaders.js';
import parseQueryParams from './utils/parseQueryParams.js';
import getApiService from './utils/getApiService.js';
import getTokenAndClient from './utils/getTokenAndClient.js';

const getByEndpoint = async (endpoint, headers) => {
	crashlytics.log(`get: ${endpoint}`);

	const {data} = await axios.get(endpoint, {
		...(headers && isObject(headers) && headers),
	});

	return data;
};

const refreshHeaders = async (headers) => {
	const oauthTokens = await getTokenAndClient();
	const updatedHeaders = await updateHeaders(oauthTokens, headers);

	return updatedHeaders;
};

/**
 * @class Request
 * @name Request
 * @description This class helps to do requests at janis apps.
 * @param {object} params
 * @param {string} params.JANIS_ENV This param must be passed from env.json located at each app.
 */
class Request {
	constructor({JANIS_ENV}) {
		this.JANIS_ENV = JANIS_ENV;
	}

	/**
	 * @name get
	 * @description This method is to do a GET request. The request have be done to a Janis service or an external endpoint.
	 * @param {object} params
	 * @param {string} params.id Id of the entity.
	 * @param {string} params.namespace Entity namespace.
	 * @param {string} params.service Janis service.
	 * @param {string} params.endpoint External endpoint. If this param is passed, the request will be done directly to the endpoint received.
	 * @param {object} params.headers Request headers.
	 * @returns {Promise<object>} Api response.
	 * @example
	 *  const request = new Request({JANIS_ENV: 'janis_dev'})
	 *  const dataEndpoint = await request.get({endpoint: 'https://test.external.service/file.pdf'})
	 *  const data = await request.get({service: 'picking', namespace: 'session', id: '123'})
	 */
	async get({id = '', namespace = '', service = '', endpoint = '', headers = {}}) {
		let hasId;

		try {
			if (endpoint && isString(endpoint)) {
				const data = await getByEndpoint(endpoint, headers);
				return data;
			}

			crashlytics.log(`get: ${service}/${namespace}/${id}`);

			if (!namespace || !isString(namespace)) throw new Error('namespace is not valid');
			if (!service || !isString(service)) throw new Error('service is not valid');
			if (!isString(id)) throw new Error('id is not valid');

			const updatedHeaders = await refreshHeaders(headers);

			hasId = !!id;

			const validUrl = `${getApiService(service, this.JANIS_ENV)}/${namespace}${
				hasId ? `/${id}` : ''
			}`;

			const {data} = await axios.get(validUrl, {headers: updatedHeaders});

			return data;
		} catch (error) {
			crashlytics.recordError(
				error,
				`Error at GET:  service: ${service} namespace: ${namespace} ${hasId ? `id: ${id}` : ''}`,
			);
			return Promise.reject(error);
		}
	}

	/**
   * @name list
   * @description This method is to do a GET to a Janis Service which returns a list of entities.
   * @param {object} params
   * @param {object} params.headers Request headers.
   * @param {object} params.queryParams Filters and sorts. Will be parsed and added to the url.
   * @param {string} params.namespace Entities namespace.
   * @param {string} params.service Janis service.
   * @returns {Promise<Array>} Array of entities
   * @example
   * const request = new Request({JANIS_ENV: 'janis_dev'})
   * const sessions = await request.list({
				namespace: 'session',
				service: 'picking',
				headers: {page: 3},
				queryParams: {
					filters: {sessionOwnershipVisibility, pickingPointId: activeWarehouse.id},
					sort: sessionSortingCriteria,
				},
			})
   */
	async list({headers = {}, queryParams = {}, namespace = '', service = ''}) {
		try {
			crashlytics.log(`list: ${service}-${namespace}`);

			if (!namespace || !isString(namespace)) throw new Error('namespace is not valid');
			if (!service || !isString(service)) throw new Error('service is not valid');

			const {
				page = 1,
				pageSize = 60,
				getTotals = false,
				getOnlyTotals = false,
				...restHeaders
			} = headers;

			const updatedHeaders = await refreshHeaders({
				page,
				pageSize,
				getTotals,
				getOnlyTotals,
				...restHeaders,
			});

			const validUrl = `${getApiService(
				service,
				this.JANIS_ENV,
			)}/${namespace}/${parseQueryParams(queryParams)}`;
			const {data, headers: responseHeaders} = await axios.get(validUrl, {
				headers: updatedHeaders,
			});

			const {'x-janis-total': totalResult} = responseHeaders;
			const total = Number(totalResult);
			const isLastPage = data?.length < pageSize;

			return {
				result: data,
				isLastPage,
				...(total && isNumber(total) && {total}),
			};
		} catch (error) {
			crashlytics.recordError(error, `Error at LIST:  service: ${service} namespace: ${namespace}`);
			return Promise.reject(error);
		}
	}
}

export default Request;
