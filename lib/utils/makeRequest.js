import crashlytics from './crashlytics.js';
import {isNumber, isObject, isString} from './helpers.js';
import axios from 'axios';

const makeRequest = ({httpVerb, url, data, headers, extendedConfig, crashConfig}) =>
	new Promise((resolve, reject) => {
		const config = {
			method: httpVerb,
			url,
			...extendedConfig,
			...(!!headers && isObject(headers) && {headers}),
			...(!!data && isObject(data) && {data}),
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
				const {data: errorData = {}, status = '', statusText = ''} = error.response;
				const validMessage = errorData?.message;

				if (isString(validMessage) && validMessage) error.message = validMessage;

				crashlytics.recordError(
					error,
					`Error at ${method}: service: ${service} namespace: ${namespace} ${id ? `id: ${id}` : ''} URL:${url}`,
				);

				reject({
					result: errorData,
					statusCode: status,
					statusText,
				});
			});
	});

export default makeRequest;
