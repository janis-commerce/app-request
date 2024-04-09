import {strict as assert} from 'assert';
import {
	getHeaders,
	isBoolean,
	isString,
	isObject,
	isArray,
	isNumber,
	isFunction,
	promiseWrapper,
	URLMaker,
	parsePathParams,
} from '../../lib/utils/helpers.js';

describe('helpers', () => {
	describe('getHeaders helper', () => {
		const baseHeaders = {
			'content-Type': 'application/json',
			'janis-api-key': 'Bearer',
		};
		describe('Params', () => {
			it('should return only baseHeaders if no params are passed', () => {
				assert.deepEqual(getHeaders(1, 1, 1), baseHeaders);
			});

			it('should include custom client header', () => {
				const params = {
					client: 'my-client',
				};
				const expectedHeaders = {
					...baseHeaders,
					'janis-client': 'my-client',
				};
				assert.deepEqual(getHeaders(params), expectedHeaders);
			});

			it('should include custom access token header', () => {
				const params = {
					accessToken: 'my-access-token',
				};
				const expectedHeaders = {
					...baseHeaders,
					'janis-api-secret': 'my-access-token',
				};
				assert.deepEqual(getHeaders(params), expectedHeaders);
			});

			it('should include page and page size headers', () => {
				const params = {
					page: 1,
					pageSize: 10,
				};
				const expectedHeaders = {
					...baseHeaders,
					'x-janis-page': 1,
					'x-janis-page-size': 10,
				};
				assert.deepEqual(getHeaders(params), expectedHeaders);
			});

			it('should include getTotals header', () => {
				const params = {
					getTotals: true,
				};
				const expectedHeaders = {
					...baseHeaders,
					'x-janis-totals': true,
				};
				assert.deepEqual(getHeaders(params), expectedHeaders);
			});

			it('should include getOnlyTotals header', () => {
				const params = {
					getOnlyTotals: true,
				};
				const expectedHeaders = {
					...baseHeaders,
					'x-janis-only-totals': true,
				};
				assert.deepEqual(getHeaders(params), expectedHeaders);
			});
		});

		describe('CustomHeaders', () => {
			it('should include all custom headers', () => {
				const params = {
					client: 'my-client',
					accessToken: 'my-access-token',
					page: 1,
					pageSize: 10,
					getTotals: true,
					getOnlyTotals: true,
				};
				const customHeaders = {
					'custom-header-1': 'value-1',
					'custom-header-2': 'value-2',
					'invalid-header': '',
				};
				const expectedHeaders = {
					...baseHeaders,
					'janis-client': 'my-client',
					'janis-api-secret': 'my-access-token',
					'x-janis-page': 1,
					'x-janis-page-size': 10,
					'x-janis-totals': true,
					'x-janis-only-totals': true,
					'custom-header-1': 'value-1',
					'custom-header-2': 'value-2',
				};
				assert.deepEqual(getHeaders(params, {}, customHeaders), expectedHeaders);
			});
		});

		describe('DeviceHeaders', () => {
			it('should handle empty device data headers and custom headers', () => {
				const params = {
					client: 'my-client',
				};
				const expectedHeaders = {
					...baseHeaders,
					'janis-client': 'my-client',
				};
				assert.deepEqual(getHeaders(params, {}, {}), expectedHeaders);
			});

			it('should not send user-agent when all headers are empty', () => {
				const deviceDataHeaders = {
					'janis-app-name': '',
					'janis-app-version': '',
					'janis-app-package-name': '',
					'janis-app-build': '',
					'janis-app-device-os-name': '',
					'janis-app-device-os-version': '',
					'janis-app-device-name': '',
					'janis-app-device-id': '',
				};
				const headers = getHeaders({}, deviceDataHeaders);
				assert.equal(headers['user-agent'], undefined);
			});

			it('should include user-agent header with valid deviceDataHeaders', () => {
				const deviceDataHeaders = {
					'janis-app-name': 'MyApp',
					'janis-app-version': '1.0.0',
					'janis-app-package-name': 'janis.beta.app',
					'janis-app-build': '1',
					'janis-app-device-os-name': 'iOS',
					'janis-app-device-os-version': '14.5',
					'janis-app-device-name': 'iPhone 12',
					'janis-app-device-id': '123456789',
				};
				const expectedUserAgent = 'janis.beta.app/1.0.0 (MyApp; 1) iOS/14.5 (123456789; iPhone 12)';
				const headers = getHeaders({}, deviceDataHeaders);
				assert.equal(headers['user-agent'], expectedUserAgent);
			});

			it('should set user-agent unkown key when some key its not valid or missing', () => {
				const deviceDataHeaders = {
					'janis-app-name': 'MyApp',
					'janis-app-version': '1.0.0',
					'janis-app-package-name': 'janis.beta.app',
					'janis-app-build': '1',
					'janis-app-device-os-name': 'iOS',
					'janis-app-device-os-version': '14.5',
					'janis-app-device-name': '',
					// 'janis-app-device-id': '123456789'
				};

				const expectedHeaders = {
					...baseHeaders,
					'user-agent':
						'janis.beta.app/1.0.0 (MyApp; 1) iOS/14.5 (unknown janis-app-device-id; unknown janis-app-device-name)',
					'janis-app-name': 'MyApp',
					'janis-app-version': '1.0.0',
					'janis-app-package-name': 'janis.beta.app',
					'janis-app-build': '1',
					'janis-app-device-os-name': 'iOS',
					'janis-app-device-os-version': '14.5',
				};

				const headers = getHeaders({}, deviceDataHeaders);
				assert.deepEqual(headers, expectedHeaders);
			});

			it('should not include user-agent header when all keys are missing or are invlid', () => {
				const deviceDataHeaders = {
					'random-1': 'MyApp',
					'random-2': '1.0.0',
					'random-3': 'janis.beta.app',
				};

				const headers = getHeaders({}, deviceDataHeaders);
				assert.equal(headers['user-agent'], undefined);
			});

			it('should not include user-agent header with empty deviceDataHeaders', () => {
				const deviceDataHeaders = {};
				const headers = getHeaders({}, deviceDataHeaders);
				assert.deepEqual(headers['user-agent'], undefined);
			});
		});
	});

	describe('isBoolean helper', () => {
		it('return false when argument is not a boolean', () => {
			[() => false, NaN, {}, '', 'Janis', null, undefined].forEach((arg) =>
				assert.equal(isBoolean(arg), false),
			);
		});
		it('return true when argument is a boolean', () => {
			assert.equal(isBoolean(false), true);
		});
	});

	describe('isString helper', () => {
		it('return false when argument is not a string', () => {
			[3, NaN, [], {test: 1}, null, undefined].forEach((arg) => assert.equal(isString(arg), false));
		});
		it('return true when argument is a string', () => {
			assert.equal(isString('2'), true);
		});
	});

	describe('isObject helper', () => {
		it('return false when argument is not a object', () => {
			[3, NaN, [], '', 'Janis', null, undefined].forEach((arg) =>
				assert.equal(isObject(arg), false),
			);
		});
		it('return true when argument is a object', () => {
			assert.equal(isObject({client: 'Janis'}), true);
		});
	});

	describe('isArray helper', () => {
		it('return false when argument is not a array', () => {
			[3, NaN, {}, '', 'Janis', null, undefined].forEach((arg) =>
				assert.equal(isArray(arg), false),
			);
		});
		it('return true when argument is a array', () => {
			assert.equal(isArray(['Janis']), true);
		});
	});

	describe('isNumber helper', () => {
		it('return false when argument is not a number', () => {
			[() => false, NaN, {}, '', 'Janis', null, undefined].forEach((arg) =>
				assert.equal(isNumber(arg), false),
			);
		});
		it('return true when argument is a number', () => {
			assert.equal(isNumber(7), true);
		});
	});

	describe('isFunction helper', () => {
		it('return false when argument is not a function', () => {
			[false, NaN, {}, '', 'Janis', null, undefined].forEach((arg) =>
				assert.equal(isFunction(arg), false),
			);
		});
		it('return true when argument is a function', () => {
			assert.equal(
				isFunction(() => {}),
				true,
			);
		});
	});

	describe('promiseWrapper helper', () => {
		it('return error when function throw error', async () => {
			const prom = await promiseWrapper(Promise.reject('arg is not valid'));
			await assert.deepEqual(prom, [null, 'arg is not valid']);
		});

		it('return data when function is resolved', async () => {
			const prom = await promiseWrapper(Promise.resolve({client: 'Janis'}));
			await assert.deepEqual(prom, [{client: 'Janis'}, null]);
		});
	});

	describe('parsePathParams helper', () => {
		it('return empty string when not receive a valid array as argument', () => {
			const invalidArg = ['', 3, [], null];

			invalidArg.forEach((argument) => {
				const response = parsePathParams(argument);
				expect(response).toStrictEqual('');
			});
		});

		it('return a formatted pathParams when receive a valid array as argument', () => {
			const response = parsePathParams(['sprint', 3, '1234', 'movement']);

			expect(response).toStrictEqual('sprint/1234/movement');
		});
	});

	describe('URLMaker helper', () => {
		const validParams = {
			service: 'delivery',
			environment: 'janisdev',
			namespace: 'route',
			pathParams: 'routeId/driver/driverId',
			action: 'finish',
			id: '123456789',
		};
		it('returns empty string if not receive valid params', () => {
			const response = URLMaker({});

			expect(response).toStrictEqual('');
		});

		it('return parsed url when receive an object with valid strings argument', () => {
			const response = URLMaker(validParams);

			expect(response).toStrictEqual(
				'https://delivery.janisdev.in/api/route/routeId/driver/driverId/123456789/finish',
			);
		});

		it('return parsed url when receive an object with valid strings argument, and valid queryParams', () => {
			const response = URLMaker({...validParams, queryParams: '?filters[id]=123&'});

			expect(response).toStrictEqual(
				'https://delivery.janisdev.in/api/route/routeId/driver/driverId/123456789/finish?filters[id]=123&',
			);
		});
	});
});
