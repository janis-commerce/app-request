import crashlytics from './crashlytics.js';
import {isNumber, isObject, isString, isArray} from './helpers.js';
import axios from 'axios';

const makeRequest = ({httpVerb, url, data, headers, extendedConfig, crashConfig}) =>
	new Promise((resolve, reject) => {
		const config = {
			method: httpVerb,
			url,
			...extendedConfig,
			...(!!headers && isObject(headers) && {headers}),
			...(!!data && (isObject(data) || isArray(data)) && {data}),
		};

		const {method, service, namespace, id} = crashConfig;

		crashlytics.log(`${method}/ service:${service} - namespace:${namespace}`);
		crashlytics.log(`URL ${method}: ${url}`);

		axios(config)
			.then((response) => {
				const {headers: responseHeaders, status, statusText, data: responseData} = response;
				const {'x-janis-total': totalResult, ...restHeaders} = responseHeaders;
				const total = Number(totalResult);
				const isLastPage = responseData?.length < headers['x-janis-page-size'];

				resolve({
					result: responseData,
					headers: restHeaders,
					statusCode: status,
					isLastPage,
					...(total && isNumber(total) && {total}),
					...(statusText && isString(statusText) && {statusText}),
				});
			})
			.catch((error) => {
				if (error.response) {
					// The request was made and the server responded with a status code
					// that falls out of the range of 2xx
					const {data: errorData = {}, status = '', statusText = ''} = error.response;
					const validMessage = errorData?.message;

					if (isString(validMessage) && validMessage) error.message = validMessage;

					reject({
						result: errorData,
						statusCode: status,
						statusText: statusText,
					});
				} else if (error.request) {
					//Request was made but no response was received
					reject({result: {message: error.message}});
				} else {
					//Something happened in setting up the request that triggered an Error
					reject({result: {message: error.message}});
				}

				crashlytics.recordError(
					error,
					`Error at ${method}: service: ${service} namespace: ${namespace} ${id ? `id: ${id}` : ''} URL:${url}`,
				);
			});
	});

export default makeRequest;
