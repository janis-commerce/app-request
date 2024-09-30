import axios from 'axios';
import Analytics from '@janiscommerce/app-analytics';

const axiosInstance = axios.create();

// Only logs in analytics with production apps
const availableEnvironments = [
	'in.janis.delivery',
	'in.janis.picking',
	'in.janis.wms',
	'in.janis.delivery.qa',
	'in.janis.wms.qa',
	'in.janis.picking.qa',
];

let analytics = null;
let appName = null;

/* The code snippet `axiosInstance.interceptors.request.use(...)` is setting up a request interceptor
for Axios. When a request is made using Axios, this interceptor function will be executed before the
request is sent. Here's a breakdown of what it does: */
axiosInstance.interceptors.request.use((config) => {
	const {headers = {}} = config || {};
	const {'janis-app-package-name': janisPackageName, 'janis-app-version': appVersion} = headers;
	appName = janisPackageName;
	config.metadata = {};

	if (availableEnvironments.includes(appName)) {
		config.metadata = {};
		analytics = new Analytics({appVersion});
		config.metadata = {startTime: new Date()};
	}

	return config;
});

/* This code snippet is setting up a response interceptor for Axios. When a response is received after
making a request using Axios, this interceptor function will be executed. Here's a breakdown of what
it does: */
axiosInstance.interceptors.response.use(
	(response) => {
		if (availableEnvironments.includes(appName)) {
			response.config.metadata.endTime = new Date();
			response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
			if (analytics) {
				analytics.sendAction('measurement_requests', null, {
					response_time: response?.duration,
					params_endpoint: response?.request?.responseURL?.split('?')[1]?.substring(0, 100),
					data_size: response?.headers['content-length'] || '0',
					base_endpoint: response?.request?.responseURL?.split('?')[0] || '',
					status_code: response?.status,
					app_version: response?.config?.headers?.['janis-app-version'],
				});
			}
		}
		return response;
	},
	(error) => {
		if (availableEnvironments.includes(appName)) {
			// eslint-disable-next-line no-param-reassign
			error.config.metadata.endTime = new Date();
			// eslint-disable-next-line no-param-reassign
			error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
			if (analytics) {
				analytics.sendAction('measurement_requests', null, {
					response_time: error?.duration,
					params_endpoint: error?.request?.responseURL?.split('?')[1]?.substring(0, 100),
					data_size: '0',
					error_message: error?.message || '',
					base_endpoint: error?.config?.url?.split('?')[0] || '',
					status_code: error?.response?.status,
					app_version: error?.config?.headers?.['janis-app-version'],
				});
			}
		}

		throw error;
	},
);

export default axiosInstance;
