import axios from 'axios';
import nock from 'nock';
import crashlytics from '../../lib/utils/crashlytics.js';
import makeRequest from '../../lib/utils/makeRequest.js';

jest.mock('axios');

const mockMsResponse = [{name: 'foo'}];
const headersResponse = {
	'content-type': 'application/json',
};

describe('makeRequest function that return a new promise:', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	it('should resolve with data and statusText and totals when the request is successful ant the response returns valid values for this keys', async () => {
		nock('https://sample-service.janis-test.in')
			.get('/api/sample-entity')
			.reply(200, mockMsResponse);

		axios.mockResolvedValueOnce({
			headers: {...headersResponse, 'x-janis-total': '100'},
			status: 200,
			data: mockMsResponse,
			statusText: 'successfully response',
		});

		const result = await makeRequest({
			httpVerb: 'GET',
			url: 'https://sample-service.janis-test.in/api/sample-entity',
			headers: {Authorization: 'Bearer token'},
			crashConfig: {method: 'GET', service: 'example', namespace: 'test'},
		});

		expect(result.result).toEqual([{name: 'foo'}]);
		expect(result.statusCode).toEqual(200);
	});

	it('should resolve with data when request is successful', async () => {
		nock('https://sample-service.janis-test.in')
			.post('/api/sample-entity')
			.reply(200, mockMsResponse, headersResponse);

		axios.mockResolvedValueOnce({
			headers: {headersResponse},
			status: 200,
			data: {id: '1234'},
		});

		const result = await makeRequest({
			httpVerb: 'POST',
			url: 'https://sample-service.janis-test.in/api/sample-entity',
			headers: {Authorization: 'Bearer token'},
			crashConfig: {method: 'POST', service: 'example', namespace: 'test'},
			data: {id: '1234', email: 'janis@janis.im'},
		});

		expect(result.result).toEqual({id: '1234'});
		expect(result.statusCode).toEqual(200);
		expect(result.statusText).toBeUndefined();
	});

	it('prop data can be array', async () => {
		nock('https://sample-service.janis-test.in')
			.post('/api/sample-entity')
			.reply(200, mockMsResponse, headersResponse);

		axios.mockResolvedValueOnce({
			headers: {headersResponse},
			status: 200,
			data: {id: '1234'},
		});

		const result = await makeRequest({
			httpVerb: 'POST',
			url: 'https://sample-service.janis-test.in/api/sample-entity',
			headers: {Authorization: 'Bearer token'},
			crashConfig: {method: 'POST', service: 'example', namespace: 'test'},
			data: [{id: '1234', email: 'janis@janis.im'}],
		});

		expect(result.result).toEqual({id: '1234'});
		expect(result.statusCode).toEqual(200);
		expect(result.statusText).toBeUndefined();
	});

	it('should reject with error when request fails', async () => {
		nock('https://sample-service.janis-test.in')
			.get('/api/sample-entity/1234')
			.reply(403, mockMsResponse, headersResponse);

		axios.mockRejectedValueOnce({
			response: {},
		});

		crashlytics.recordError = jest.fn();

		await expect(
			makeRequest({
				httpVerb: 'GET',
				url: 'https://sample-service.janis-test.in/api/sample-entity/1234',
				headers: {Authorization: 'Bearer token'},
				crashConfig: {method: 'GET', service: 'example', namespace: 'test', id: '1234'},
			}),
		).rejects.toEqual({
			result: {},
			statusCode: '',
			statusText: '',
		});
	});

	it('should reject with error when request fails and send data to crashlytics without id when this it not passed', async () => {
		nock('https://sample-service.janis-test.in')
			.get('/api/sample-entity')
			.reply(403, mockMsResponse, headersResponse);

		axios.mockRejectedValueOnce({
			response: {
				data: {message: 'unauthorized token'},
				status: 403,
				statusText: 'unauthorized token',
			},
		});

		crashlytics.recordError = jest.fn();

		await expect(
			makeRequest({
				httpVerb: 'GET',
				url: 'https://sample-service.janis-test.in/api/sample-entity',
				headers: {Authorization: 'Bearer token'},
				crashConfig: {method: 'GET', service: 'example', namespace: 'test'},
			}),
		).rejects.toEqual({
			result: {message: 'unauthorized token'},
			statusCode: 403,
			statusText: 'unauthorized token',
		});
	});

	it('should reject with error.message when error.response is undefined and error.request is truthy', async () => {
		nock('https://sample-service.janis-test.in')
			.get('/api/sample-entity/1234')
			.reply(403, mockMsResponse, headersResponse);

		axios.mockRejectedValueOnce({
			message: 'Request was made but no response was received',
			request: {data: 123},
		});

		crashlytics.recordError = jest.fn();

		await expect(
			makeRequest({
				httpVerb: 'GET',
				url: 'https://sample-service.janis-test.in/api/sample-entity/1234',
				headers: {Authorization: 'Bearer token'},
				crashConfig: {method: 'GET', service: 'example', namespace: 'test', id: '1234'},
			}),
		).rejects.toEqual({
			result: {message: 'Request was made but no response was received'},
		});
	});

	it('should reject with error.message when error.response and error.request are undefined', async () => {
		nock('https://sample-service.janis-test.in')
			.get('/api/sample-entity/1234')
			.reply(403, mockMsResponse, headersResponse);

		axios.mockRejectedValueOnce({
			message: 'Network Error',
		});

		crashlytics.recordError = jest.fn();

		await expect(
			makeRequest({
				httpVerb: 'GET',
				url: 'https://sample-service.janis-test.in/api/sample-entity/1234',
				headers: {Authorization: 'Bearer token'},
				crashConfig: {method: 'GET', service: 'example', namespace: 'test', id: '1234'},
			}),
		).rejects.toEqual({
			result: {message: 'Network Error'},
		});
	});
});
