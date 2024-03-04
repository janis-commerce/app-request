import axios from 'axios';
import {getUserInfo, getAccessToken} from '@janiscommerce/oauth-native';
import Request from '../lib/request.js';
import {promiseWrapper} from '../lib/utils/helpers.js';
import * as makeRequest from '../lib/utils/makeRequest.js';
import nock from 'nock';

jest.mock('axios');
const makeRequestSpy = jest.spyOn(makeRequest, 'default');
const headers = {
	'content-Type': 'application/json',
	'janis-api-key': 'Bearer',
	'user-agent':
		'unknown/unknown (unknown; unknown) unknown/unknown (unknown janis-app-device-id; unknown)',
	'janis-app-name': 'unknown',
	'janis-app-build': 'unknown',
	'janis-app-version': 'unknown',
	'janis-app-package-name': 'unknown',
	'janis-app-device-os-name': 'unknown',
	'janis-app-device-os-version': 'unknown',
	'janis-app-device-name': 'unknown',
	'janis-client': 'exampleClient',
	'janis-api-secret': 'exampleAccessToken',
};

describe('Request', () => {
	const JANIS_ENV = 'janislocal';
	afterEach(() => {
		jest.clearAllMocks();
	});
	describe('get', () => {
		describe('params errors validations', () => {
			it.each(['', false, undefined, null, {}, []])(
				'should throw an error if namespace is not valid',
				async (invalidNamespace) => {
					const api = new Request({JANIS_ENV: 'janislocal'});
					await expect(api.get({namespace: invalidNamespace})).rejects.toThrow(
						'namespace is not valid',
					);
				},
			);

			it.each(['', false, undefined, null, {}, []])(
				'should throw an error if service is not valid',
				async (invalidService) => {
					const api = new Request({JANIS_ENV: 'janislocal'});
					await expect(api.get({namespace: 'session', service: invalidService})).rejects.toThrow(
						'service is not valid',
					);
				},
			);

			it.each([false, null, {}, []])(
				'should throw an error if id is not valid string',
				async (invalidId) => {
					const api = new Request({JANIS_ENV: 'janislocal'});
					await expect(
						api.get({namespace: 'session', service: 'picking', id: invalidId}),
					).rejects.toThrow('id is not valid');
				},
			);
		});

		describe('getByEndpoint', () => {
			it('does request and returns data when endpoint param is passed', async () => {
				const api = new Request({JANIS_ENV});

				const apiResponse = {
					data: {
						test: '123',
					},
				};

				axios.get.mockResolvedValue(apiResponse);

				const data = await api.get({
					endpoint: 'https://picking.janislocal.in/api/session/asd123',
				});

				expect(data).toEqual(apiResponse.data);
			});

			it('returns an error when the request fails', async () => {
				const api = new Request({JANIS_ENV});

				getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
				getAccessToken.mockResolvedValue('exampleAccessToken');
				axios.get.mockRejectedValue(new Error('error server'));

				await expect(
					api.get({
						service: 'picking',
						namespace: 'session',
						id: '123',
					}),
				).rejects.toThrow('error server');
			});

			it('returns an error if request of an endpoint passed fails', async () => {
				const api = new Request({JANIS_ENV});

				axios.get.mockRejectedValue(new Error('error server'));

				await expect(
					api.get({
						endpoint: 'https://server.test.com/get/asd123',
					}),
				).rejects.toThrow('error server');
			});
		});

		describe('get by service, namespace and id', () => {
			it('should return data if namespace and service are valid', async () => {
				getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
				getAccessToken.mockResolvedValue('exampleAccessToken');
				const api = new Request({JANIS_ENV});

				const apiResponse = {
					data: {
						test: '123',
					},
				};

				axios.get.mockResolvedValue(apiResponse);

				const data = await api.get({
					service: 'picking',
					namespace: 'session',
					id: '123',
				});

				expect(data).toEqual(apiResponse.data);
			});
		});

		describe('get by service and namespace but without id', () => {
			it('should return data if namespace and service are valid', async () => {
				getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
				getAccessToken.mockResolvedValue('exampleAccessToken');
				const api = new Request({JANIS_ENV});

				const apiResponse = {
					data: {
						test: '123',
					},
				};

				axios.get.mockResolvedValue(apiResponse);

				const data = await api.get({
					service: 'picking',
					namespace: 'session',
				});

				expect(data).toEqual(apiResponse.data);
			});
		});
	});

	describe('list', () => {
		describe('params errors validations', () => {
			it.each(['', false, undefined, null, {}, []])(
				'should throw an error if namespace is not valid',
				async (invalidNamespace) => {
					const api = new Request({JANIS_ENV: 'janislocal'});
					await expect(api.list({namespace: invalidNamespace})).rejects.toThrow(
						'namespace is not valid',
					);
				},
			);

			it.each(['', false, undefined, null, {}, []])(
				'should throw an error if service is not valid',
				async (invalidService) => {
					const api = new Request({JANIS_ENV: 'janislocal'});
					await expect(api.list({namespace: 'session', service: invalidService})).rejects.toThrow(
						'service is not valid',
					);
				},
			);
		});

		describe('list by service and namespace', () => {
			it('should return data if namespace and service are valid', async () => {
				getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
				getAccessToken.mockResolvedValue('exampleAccessToken');
				const api = new Request({JANIS_ENV});

				const apiResponse = {
					data: ['123', '456', '789'],
					headers: {
						'x-janis-total': 20,
					},
				};

				axios.get.mockResolvedValue(apiResponse);

				const data = await api.list({
					service: 'picking',
					namespace: 'session',
				});

				expect(data).toEqual({
					result: apiResponse.data,
					isLastPage: true,
					total: 20,
				});
			});
		});
	});

	describe('post', () => {
		it('make a request with httpVerb POST based on URL parameters', async () => {
			const mockMsResponse = {
				id: '1234',
			};

			const headersResponse = {
				'content-type': 'application/json',
			};

			getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
			getAccessToken.mockResolvedValue('exampleAccessToken');

			nock('https://sample-service.janis-test.in')
				.post('/api/sample-entity')
				.reply(200, mockMsResponse, headersResponse);

			axios.mockResolvedValueOnce({
				headers: headersResponse,
				status: 200,
				data: mockMsResponse,
				statusText: 'successfully response',
			});

			const api = new Request({JANIS_ENV});

			await api.post({
				namespace: 'supplying',
				service: 'wms',
				id: '1234',
				body: {
					positionId: '1234',
					positionKey: '1-A',
				},
				pathParams: ['product', '5678'],
				action: 'receive',
				headers: {
					page: 1,
				},
				extraConfigs: {
					timeout: 1000,
				},
			});

			expect(makeRequestSpy).toHaveBeenCalled();
			expect(makeRequestSpy).toHaveBeenCalledWith({
				url: 'https://wms.janislocal.in/api/supplying/product/5678/1234/receive',
				data: {
					positionId: '1234',
					positionKey: '1-A',
				},
				httpVerb: 'post',
				crashConfig: {
					method: 'POST',
					service: 'wms',
					namespace: 'supplying',
					id: '1234',
				},
				headers: {...headers, 'x-janis-page': 1},
				extendedConfig: {
					timeout: 1000,
				},
			});
		});

		it('make a request with httpVerb POST based in an endpoint', async () => {
			const mockMsResponse = {
				id: '1234',
			};

			const headersResponse = {
				'content-type': 'application/json',
			};

			getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
			getAccessToken.mockResolvedValue('exampleAccessToken');

			nock('https://sample-service.janis-test.in')
				.post('/api/sample-entity')
				.reply(200, mockMsResponse, headersResponse);

			axios.mockResolvedValueOnce({
				headers: headersResponse,
				status: 200,
				data: mockMsResponse,
				statusText: 'successfully response',
			});

			const api = new Request({JANIS_ENV});

			await api.post({
				endpoint: 'https://wms.janislocal.in/api/supplying/product/5678/1234/receive',
			});

			expect(makeRequestSpy).toHaveBeenCalled();
			expect(makeRequestSpy).toHaveBeenCalledWith({
				url: 'https://wms.janislocal.in/api/supplying/product/5678/1234/receive',
				data: {},
				httpVerb: 'post',
				crashConfig: {
					method: 'POST',
				},
				headers: headers,
				extendedConfig: {},
			});
		});
	});

	describe('put', () => {
		it('make a request with httpVerb PUT based on URL parameters', async () => {
			const mockMsResponse = {
				id: '1234',
			};

			const headersResponse = {
				'content-type': 'application/json',
			};

			getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
			getAccessToken.mockResolvedValue('exampleAccessToken');

			nock('https://sample-service.janis-test.in')
				.put('/api/sample-entity')
				.reply(200, mockMsResponse, headersResponse);

			axios.mockResolvedValueOnce({
				headers: headersResponse,
				status: 200,
				data: mockMsResponse,
				statusText: 'successfully response',
			});

			const api = new Request({JANIS_ENV});

			await api.put({
				namespace: 'supplying',
				service: 'wms',
				id: '1234',
				body: {
					positionId: '1234',
					positionKey: '1-A',
				},
				pathParams: ['product', '5678'],
				action: 'receive',
				headers: {
					page: 1,
				},
				extraConfigs: {
					timeout: 1000,
				},
			});

			expect(makeRequestSpy).toHaveBeenCalled();
			expect(makeRequestSpy).toHaveBeenCalledWith({
				url: 'https://wms.janislocal.in/api/supplying/product/5678/1234/receive',
				data: {
					positionId: '1234',
					positionKey: '1-A',
				},
				httpVerb: 'put',
				crashConfig: {
					method: 'PUT',
					service: 'wms',
					namespace: 'supplying',
					id: '1234',
				},
				headers: {...headers, 'x-janis-page': 1},
				extendedConfig: {
					timeout: 1000,
				},
			});
		});

		it('make a request with httpVerb PUT based in an endpoint', async () => {
			const mockMsResponse = {
				id: '1234',
			};

			const headersResponse = {
				'content-type': 'application/json',
			};

			getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
			getAccessToken.mockResolvedValue('exampleAccessToken');

			nock('https://sample-service.janis-test.in')
				.put('/api/sample-entity')
				.reply(200, mockMsResponse, headersResponse);

			axios.mockResolvedValueOnce({
				headers: headersResponse,
				status: 200,
				data: mockMsResponse,
				statusText: 'successfully response',
			});

			const api = new Request({JANIS_ENV});

			await api.put({
				endpoint: 'https://wms.janislocal.in/api/supplying/product/5678/1234/receive',
			});

			expect(makeRequestSpy).toHaveBeenCalled();
			expect(makeRequestSpy).toHaveBeenCalledWith({
				url: 'https://wms.janislocal.in/api/supplying/product/5678/1234/receive',
				data: {},
				httpVerb: 'put',
				crashConfig: {
					method: 'PUT',
				},
				headers: headers,
				extendedConfig: {},
			});
		});
	});

	describe('patch', () => {
		it('make a request with httpVerb PATCH based on URL parameters', async () => {
			const mockMsResponse = {
				id: '1234',
			};

			const headersResponse = {
				'content-type': 'application/json',
			};

			getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
			getAccessToken.mockResolvedValue('exampleAccessToken');

			nock('https://sample-service.janis-test.in')
				.patch('/api/sample-entity')
				.reply(200, mockMsResponse, headersResponse);

			axios.mockResolvedValueOnce({
				headers: headersResponse,
				status: 200,
				data: mockMsResponse,
				statusText: 'successfully response',
			});

			const api = new Request({JANIS_ENV});

			await api.patch({
				namespace: 'supplying',
				service: 'wms',
				id: '1234',
				body: {
					positionId: '1234',
					positionKey: '1-A',
				},
				pathParams: ['product', '5678'],
				action: 'receive',
				headers: {
					page: 1,
				},
				extraConfigs: {
					timeout: 1000,
				},
			});

			expect(makeRequestSpy).toHaveBeenCalled();
			expect(makeRequestSpy).toHaveBeenCalledWith({
				url: 'https://wms.janislocal.in/api/supplying/product/5678/1234/receive',
				data: {
					positionId: '1234',
					positionKey: '1-A',
				},
				httpVerb: 'patch',
				crashConfig: {
					method: 'PATCH',
					service: 'wms',
					namespace: 'supplying',
					id: '1234',
				},
				headers: {...headers, 'x-janis-page': 1},
				extendedConfig: {
					timeout: 1000,
				},
			});
		});

		it('make a request with httpVerb PATCH based in an endpoint', async () => {
			const mockMsResponse = {
				id: '1234',
			};

			const headersResponse = {
				'content-type': 'application/json',
			};

			getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
			getAccessToken.mockResolvedValue('exampleAccessToken');

			nock('https://sample-service.janis-test.in')
				.patch('/api/sample-entity')
				.reply(200, mockMsResponse, headersResponse);

			axios.mockResolvedValueOnce({
				headers: headersResponse,
				status: 200,
				data: mockMsResponse,
				statusText: 'successfully response',
			});

			const api = new Request({JANIS_ENV});

			await api.patch({
				endpoint: 'https://wms.janislocal.in/api/supplying/product/5678/1234/receive',
			});

			expect(makeRequestSpy).toHaveBeenCalled();
			expect(makeRequestSpy).toHaveBeenCalledWith({
				url: 'https://wms.janislocal.in/api/supplying/product/5678/1234/receive',
				data: {},
				httpVerb: 'patch',
				crashConfig: {
					method: 'PATCH',
				},
				headers: headers,
				extendedConfig: {},
			});
		});
	});

	describe('prepareAndMakeRequest util', () => {
		describe('params error validations', () => {
			it.each(['', false, undefined, null, {}, []])(
				'should throw an error if namespace is not valid',
				async (invalidNamespace) => {
					const utils = new Request({JANIS_ENV});

					const [, utilsResponse] = await promiseWrapper(
						utils.prepareAndMakeRequest({namespace: invalidNamespace}),
					);

					const message = utilsResponse.result.message;

					expect(message).toBe('namespace is not valid');
				},
			);

			it.each(['', false, undefined, null, {}, []])(
				'should throw an error if service is not valid',
				async (invalidService) => {
					const utils = new Request({JANIS_ENV});

					const [, utilsResponse] = await promiseWrapper(
						utils.prepareAndMakeRequest({namespace: 'shipping', service: invalidService}),
					);

					const message = utilsResponse.result.message;

					expect(message).toBe('service is not valid');
				},
			);

			it.each([false, null, {}, []])(
				'should throw an error if id is not valid',
				async (invalidId) => {
					const utils = new Request({JANIS_ENV});

					const [, utilsResponse] = await promiseWrapper(
						utils.prepareAndMakeRequest({
							namespace: 'shipping',
							service: 'delivery',
							id: invalidId,
						}),
					);

					const message = utilsResponse.result.message;
					const idType = typeof invalidId;

					expect(message).toBe(`id ${invalidId} is invalid type: ${idType}`);
				},
			);
		});
	});
});
