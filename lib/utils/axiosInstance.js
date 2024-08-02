import axios from 'axios';
import Analytics from '@janiscommerce/app-analytics';

const axiosInstance = axios.create();

const availableEnvironments = ['in.janis.delivery', 'in.janis.picking', 'in.janis.wms'];
let analytics = null;

axiosInstance.interceptors.request.use((config) => {
	const {headers = {}} = config || {};
	const {'janis-app-package-name': janisPackageName, 'janis-app-version': appVersion} = headers;

	if (availableEnvironments.includes(janisPackageName)) {
		analytics = new Analytics({appVersion});
		config.metadata = {startTime: new Date()};
	}

	return config;
});

axiosInstance.interceptors.response.use(
	(response) => {
		response.config.metadata.endTime = new Date();
		response.duration = response.config.metadata.endTime - response.config.metadata.startTime;
		if (analytics) {
			analytics.sendCustomEvent('measurement_requests', {
				response_time: response.duration,
				endpoint: response.request.responseURL,
				data_size: response.headers['content-length'] || '0',
				base_endpoint: response.request.responseURL.split('?')[0] || '',
				status_code: response?.status,
			});
		}

		return response;
	},
	(error) => {
		// eslint-disable-next-line no-param-reassign
		error.config.metadata.endTime = new Date();
		// eslint-disable-next-line no-param-reassign
		error.duration = error.config.metadata.endTime - error.config.metadata.startTime;
		if (analytics) {
			analytics.sendCustomEvent('measurement_requests', {
				response_time: error.duration,
				endpoint: error.request.responseURL,
				data_size: '0',
				error_message: error?.message || '',
				base_endpoint: error?.config?.url.split('?')[0] || '',
				status_code: error?.response?.status,
			});
		}

		throw error;
	},
);

export default axiosInstance;
