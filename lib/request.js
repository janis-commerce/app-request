import {isString, URLMaker, parsePathParams} from './utils/helpers.js';
import crashlytics from './utils/crashlytics.js';
import updateHeaders from './utils/updateHeaders.js';
import parseQueryParams from './utils/parseQueryParams.js';
import getTokenAndClient from './utils/getTokenAndClient.js';
import makeRequest from './utils/makeRequest.js';

const refreshHeaders = async (headers) => {
	const {page, pageSize, getTotals, getOnlyTotals, ...customHeaders} = headers;

	const oauthTokens = await getTokenAndClient();
	const updatedHeaders = await updateHeaders(
		{...oauthTokens, page, pageSize, getTotals, getOnlyTotals},
		customHeaders,
	);

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
	 * @param {object} params.queryParams Filters and sorts. Will be parsed and added to the url.
	 * @param {string<Array>} params.pathParams array of string that represent some part of the api/URL
	 * @param {string} params.action the action that will be performed on the entity
	 * @param {object} params.extraConfigs any extra configuration for the request
	 * @returns {Promise<object>} Api response.
	 * @example
	 *  const request = new Request({JANIS_ENV: 'janis_dev'})
	 *  const dataEndpoint = await request.get({endpoint: 'https://test.external.service/file.pdf'})
	 *  const data = await request.get({service: 'picking', namespace: 'session', id: '123'})
	 */
	async get({
		id = '',
		namespace = '',
		service = '',
		endpoint = '',
		headers = {},
		action = '',
		queryParams = {},
		pathParams = [],
		extraConfigs = {},
	}) {
		return this.prepareAndMakeRequest({
			httpVerb: 'get',
			endpoint,
			namespace,
			service,
			id,
			queryParams,
			pathParams,
			action,
			headers,
			extraConfigs,
			method: 'GET',
		});
	}

	/**
	 * @name list
	 * @description This method is to do a GET to a Janis Service which returns a list of entities.
	 * @param {object} params
	 * @param {object} params.headers Request headers.
	 * @param {object} params.queryParams Filters and sorts. Will be parsed and added to the url.
	 * @param {string} params.namespace Entities namespace.
	 * @param {string} params.service Janis service.
	 * @param {string} params.endpoint External endpoint. If this param is passed, the request will be done directly to the endpoint received.
	 * @param {string<Array>} params.pathParams array of string that represent some part of the api/URL
	 * @param {string} params.action the action that will be performed on the entity
	 * @param {object} params.extraConfigs any extra configuration for the request
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
	async list({
		headers = {},
		queryParams = {},
		namespace = '',
		service = '',
		endpoint = '',
		action = '',
		pathParams = [],
		extraConfigs = {},
	}) {
		return this.prepareAndMakeRequest({
			httpVerb: 'get',
			headers: {page: 1, pageSize: 60, getTotals: false, getOnlyTotals: false, ...headers},
			endpoint,
			namespace,
			service,
			queryParams,
			pathParams,
			action,
			extraConfigs,
			method: 'LIST',
		});
	}

	/**
	 * @name post
	 * @description This method is to do a POST to a Janis Service which returns a list of entities.
	 * @param {object} params
	 * @param {object} params.headers Request headers.
	 * @param {object} params.queryParams Filters and sorts. Will be parsed and added to the url.
	 * @param {string} params.namespace Entities namespace.
	 * @param {string} params.endpoint External endpoint. If this param is passed, the request will be done directly to the endpoint received.
	 * @param {string} params.service Janis service.
	 * @param {string} params.id id for the entity that will be update
	 * @param {string<Array>} params.pathParams array of string that represent some part of the api/URL
	 * @param {string} params.action the action that will be performed on the entity
	 * @param {object} params.body required body for the api
	 * @param {object} params.extraConfigs any extra configuration for the request
	 * @returns {Promise} Response from API
	 * @example
	 * const request = new Request({JANIS_ENV: 'janis_dev'})
	 * const updateSupplying = await request.post({
	 * 		namespace: 'supplying',
	 * 		service: 'wms',
	 *		action:'approve'
	 * })
	 */
	async post({
		namespace,
		service,
		endpoint = '',
		id = '',
		body = {},
		queryParams = {},
		pathParams = [],
		action = '',
		headers = {},
		extraConfigs = {},
	}) {
		return this.prepareAndMakeRequest({
			httpVerb: 'post',
			endpoint,
			namespace,
			service,
			id,
			body,
			queryParams,
			pathParams,
			action,
			headers,
			extraConfigs,
			method: 'POST',
		});
	}

	/**
   * @name patch
	* @description This method is to do a PATCH to a Janis Service for update some entity data key
	* @param {object} params
	* @param {object} params.headers Request headers.
	* @param {object} params.queryParams Filters and sorts. Will be parsed and added to the url.
	* @param {string} params.namespace Entities namespace.
	* @param {string} params.endpoint External endpoint. If this param is passed, the request will be done directly to the endpoint received.
	* @param {string} params.service Janis service.
	* @param {string} params.id id for the entity that will be update
	* @param {string<Array>} params.pathParams array of string that represent some part of the api/URL
	* @param {string} params.action the action that will be performed on the entity
	* @param {object} params.body required body for the api
	* @param {object} params.extraConfigs any extra configuration for the request
	* @returns {Promise} Response from API
	* @example
	* const request = new Request({JANIS_ENV: 'janis_dev'})
	* const userData = await request.patch({
					namespace: 'account',
					service: 'id',
					body: {
						firstname: 'user name',
						lastname: 'user last name'
					}
				})
   */
	async patch({
		namespace,
		service,
		endpoint = '',
		id = '',
		body = {},
		queryParams = {},
		pathParams = [],
		action = '',
		headers = {},
		extraConfigs = {},
	}) {
		return this.prepareAndMakeRequest({
			httpVerb: 'patch',
			endpoint,
			namespace,
			service,
			id,
			body,
			queryParams,
			pathParams,
			action,
			headers,
			extraConfigs,
			method: 'PATCH',
		});
	}

	/**
	 * @name put
	 * @description This method is to do a PUT to a Janis Service for update entity data
	 * @param {object} params
	 * @param {object} params.headers Request headers.
	 * @param {object} params.queryParams Filters and sorts. Will be parsed and added to the url.
	 * @param {string} params.namespace Entities namespace.
	 * @param {string} params.endpoint External endpoint. If this param is passed, the request will be done directly to the endpoint received.
	 * @param {string} params.service Janis service.
	 * @param {string} params.id id for the entity that will be update
	 * @param {string<Array>} params.pathParams array of string that represent some part of the api/URL
	 * @param {string} params.action the action that will be performed on the entity
	 * @param {object} params.body required body for the api
	 * @param {object} params.extraConfigs any extra configuration for the request
	 * @returns {Promise} Response from API
	 * @example
	 * const request = new Request({JANIS_ENV: 'janis_dev'})
	 * const driverData = await request.put({
					namespace: 'driver',
					service: 'delivery',
					id: 'driverId',
					body: {
						status;'active',
						userId:'driverId',
						activeWarehouseId:'12345'
					}
				})
   */
	async put({
		namespace,
		service,
		endpoint = '',
		id = '',
		body = {},
		queryParams = {},
		pathParams = [],
		action = '',
		headers = {},
		extraConfigs = {},
	}) {
		return this.prepareAndMakeRequest({
			httpVerb: 'put',
			endpoint,
			namespace,
			service,
			id,
			body,
			queryParams,
			pathParams,
			action,
			headers,
			extraConfigs,
			method: 'PUT',
		});
	}

	/**
	 * @name prepareAndMakeRequest
	 * @description function that is responsible for preparing and managing the parameters received from each method to make a request
	 * @param {object} params
	 * @param {string} params.httpVerb configuration of the http method to use in the request
	 * @param {string} params.method name of the method that will be used and reported to crashlytics
	 * @param {object} params.headers Request headers.
	 * @param {object} params.queryParams Filters and sorts. Will be parsed and added to the url.
	 * @param {string} params.namespace Entities namespace.
	 * @param {string} params.endpoint External endpoint. If this param is passed, the request will be done directly to the endpoint received.
	 * @param {string} params.service Janis service.
	 * @param {string} params.id id for the entity that will be update
	 * @param {string<Array>} params.pathParams array of string that represent some part of the api/URL
	 * @param {string} params.action the action that will be performed on the entity
	 * @param {object} params.body required body for the api
	 * @param {object} params.extraConfigs any extra configuration for the request
	 * @returns {Promise} Response from API
	 * @example
	 * const request = new Request({JANIS_ENV: 'janis_dev'})
	 * const driverData = await request.put({
					namespace: 'driver',
					service: 'delivery',
					id: 'driverId',
					body: {
						status;'active',
						userId:'driverId',
						activeWarehouseId:'12345'
					}
				})
   */
	async prepareAndMakeRequest({
		httpVerb,
		namespace,
		service,
		endpoint,
		id = '',
		body,
		pathParams,
		action,
		headers,
		queryParams,
		method,
		extraConfigs,
	}) {
		try {
			if (!endpoint) {
				if (!namespace || !isString(namespace)) throw new Error('namespace is not valid');
				if (!service || !isString(service)) throw new Error('service is not valid');
				if (!isString(id)) throw new Error(`id ${id} is invalid type: ${typeof id}`);
			}

			const updatedHeaders = await refreshHeaders(headers);
			const parsedPathParams = parsePathParams(pathParams);
			const parsedQueryParams = parseQueryParams(queryParams);

			const janisUrl = URLMaker({
				service,
				environment: this.JANIS_ENV,
				namespace,
				pathParams: parsedPathParams,
				id,
				action,
				queryParams: parsedQueryParams,
			});

			const validUrl = !!endpoint && isString(endpoint) ? endpoint : janisUrl;

			const crashConfig = {
				method,
				...(!!service && {service}),
				...(!!namespace && {namespace}),
				...(!!id && {id}),
			};

			return makeRequest({
				url: validUrl,
				data: body,
				httpVerb,
				crashConfig,
				headers: updatedHeaders,
				extendedConfig: extraConfigs,
			});
		} catch (error) {
			const formattedError = {
				result: {
					message: error.message,
				},
			};

			crashlytics.recordError(
				error,
				`Error at ${method}: service: ${service} namespace: ${namespace} reason: ${error.message}`,
			);

			return Promise.reject(formattedError);
		}
	}
}

export default Request;
