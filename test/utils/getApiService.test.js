import getApiService from '../../lib/utils/getApiService.js';

describe('getApiService', () => {
	it('should return a valid API URL when valid service and JANIS_ENV are provided', () => {
		const service = 'picking';
		const JANIS_ENV = 'janisdev';
		const expectedUrl = 'https://picking.janisdev.in/api';
		expect(getApiService(service, JANIS_ENV)).toEqual(expectedUrl);
	});

	it('should return an empty string when no service is provided', () => {
		const JANIS_ENV = 'production';
		expect(getApiService('', JANIS_ENV)).toEqual('');
	});

	it.each([undefined, null, 1, false, {}, []])(
		'should return an empty string when service is not a string',
		(invalidService) => {
			const JANIS_ENV = 'testing';
			expect(getApiService(invalidService, JANIS_ENV)).toEqual('');
		}
	);

	it.each([undefined, null, 1, false, {}, []])(
		'should handle empty JANIS_ENV gracefully',
		(invalidEnv) => {
			const service = 'picking';
			expect(getApiService(service, invalidEnv)).toEqual('');
		}
	);
});
