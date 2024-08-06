import {getUserInfo, getAccessToken} from '@janiscommerce/oauth-native';
import Request from '../lib/request.js';
import {promiseWrapper} from '../lib/utils/helpers.js';
import * as makeRequest from '../lib/utils/makeRequest.js';
import * as axiosInstance from '../lib/utils/axiosInstance.js';
import nock from 'nock';

const makeRequestSpy = jest.spyOn(makeRequest, 'default');
const axiosInstanceMock = jest.spyOn(axiosInstance, 'default');

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
		it('make a request with httpVerb GET based on URL parameters', async () => {
			const mockMsResponse = {
				data: {
					test: '123',
				},
			};

			const headersResponse = {
				'content-type': 'application/json',
			};

			getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
			getAccessToken.mockResolvedValue('exampleAccessToken');

			nock('https://picking.janislocal.in/api/session/asd123')
				.get('/api/session/asd123')
				.reply(200, mockMsResponse);

			axiosInstanceMock.mockResolvedValueOnce({
				headers: headersResponse,
				status: 200,
				data: mockMsResponse,
				statusText: 'successfully response',
			});
			const api = new Request({JANIS_ENV});

			await api.get({
				namespace: 'picking',
				service: 'sample-service',
				id: '1234',
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
				url: 'https://sample-service.janislocal.in/api/picking/product/5678/1234/receive',
				data: undefined,
				httpVerb: 'get',
				crashConfig: {
					method: 'GET',
					service: 'sample-service',
					namespace: 'picking',
					id: '1234',
				},
				headers: {...headers, 'x-janis-page': 1},
				extendedConfig: {
					timeout: 1000,
				},
			});
		});

		it('make a request with httpVerb GET based in an endpoint', async () => {
			const mockMsResponse = {
				data: {
					test: '123',
				},
			};

			const headersResponse = {
				'content-type': 'application/json',
			};

			getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
			getAccessToken.mockResolvedValue('exampleAccessToken');

			nock('https://picking.janislocal.in/api/session/asd123')
				.get('/api/session/asd123')
				.reply(200, mockMsResponse);

			axiosInstanceMock.mockResolvedValueOnce({
				headers: headersResponse,
				status: 200,
				data: mockMsResponse,
				statusText: 'successfully response',
			});
			const api = new Request({JANIS_ENV});

			await api.get({
				endpoint: 'https://picking.janislocal.in/api/session/asd123',
			});

			expect(makeRequestSpy).toHaveBeenCalled();
			expect(makeRequestSpy).toHaveBeenCalledWith({
				url: 'https://picking.janislocal.in/api/session/asd123',
				data: undefined,
				httpVerb: 'get',
				crashConfig: {
					method: 'GET',
				},
				headers: headers,
				extendedConfig: {},
			});
		});
	});

	describe('list', () => {
		it('make a request with httpVerb GET method LIST based on URL parameters', async () => {
			const mockMsResponse = {
				data: [
					{
						test: '123',
					},
				],
			};

			const headersResponse = {
				'content-type': 'application/json',
			};

			getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
			getAccessToken.mockResolvedValue('exampleAccessToken');

			nock('https://picking.janislocal.in/api/session/asd123')
				.get('/api/session/asd123')
				.reply(200, mockMsResponse);

			axiosInstanceMock.mockResolvedValueOnce({
				headers: headersResponse,
				status: 200,
				data: mockMsResponse,
				statusText: 'successfully response',
			});
			const api = new Request({JANIS_ENV});

			await api.list({
				namespace: 'picking',
				service: 'sample-service',
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
				url: 'https://sample-service.janislocal.in/api/picking/product/5678/receive',
				data: undefined,
				httpVerb: 'get',
				crashConfig: {
					method: 'LIST',
					service: 'sample-service',
					namespace: 'picking',
				},
				headers: {...headers, 'x-janis-page': 1, 'x-janis-page-size': 60},
				extendedConfig: {
					timeout: 1000,
				},
			});
		});

		it('make a request with httpVerb GET method LIST based in an endpoint', async () => {
			const mockMsResponse = {
				data: [
					{
						test: '123',
					},
				],
			};

			const headersResponse = {
				'content-type': 'application/json',
			};

			getUserInfo.mockResolvedValue({tcode: 'exampleClient'});
			getAccessToken.mockResolvedValue('exampleAccessToken');

			nock('https://picking.janislocal.in/api/session/asd123')
				.get('/api/session/asd123')
				.reply(200, mockMsResponse);

			axiosInstanceMock.mockResolvedValueOnce({
				headers: headersResponse,
				status: 200,
				data: mockMsResponse,
				statusText: 'successfully response',
			});
			const api = new Request({JANIS_ENV});

			await api.list({
				endpoint: 'https://picking.janislocal.in/api/session/asd123',
			});

			expect(makeRequestSpy).toHaveBeenCalled();
			expect(makeRequestSpy).toHaveBeenCalledWith({
				url: 'https://picking.janislocal.in/api/session/asd123',
				data: undefined,
				httpVerb: 'get',
				crashConfig: {
					method: 'LIST',
				},
				headers: {...headers, 'x-janis-page': 1, 'x-janis-page-size': 60},
				extendedConfig: {},
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

			axiosInstanceMock.mockResolvedValueOnce({
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

			axiosInstanceMock.mockResolvedValueOnce({
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

			axiosInstanceMock.mockResolvedValueOnce({
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

			axiosInstanceMock.mockResolvedValueOnce({
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

			axiosInstanceMock.mockResolvedValueOnce({
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

			axiosInstanceMock.mockResolvedValueOnce({
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
