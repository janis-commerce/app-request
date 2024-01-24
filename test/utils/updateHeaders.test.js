import updateHeaders, {getDeviceData} from '../../lib/utils/updateHeaders.js';
import deviceInfoPkg from 'react-native-device-info';

const getApplicationNameSpy = jest.spyOn(deviceInfoPkg, 'getApplicationName');
const getBuildNumberSpy = jest.spyOn(deviceInfoPkg, 'getBuildNumber');
const getVersionSpy = jest.spyOn(deviceInfoPkg, 'getVersion');
const getBundleIdSpy = jest.spyOn(deviceInfoPkg, 'getBundleId');
const getSystemNameSpy = jest.spyOn(deviceInfoPkg, 'getSystemName');
const getSystemVersionSpy = jest.spyOn(deviceInfoPkg, 'getSystemVersion');
const getUniqueIdSpy = jest.spyOn(deviceInfoPkg, 'getUniqueId');
const getModelSpy = jest.spyOn(deviceInfoPkg, 'getModel');

describe('getDeviceData', () => {
	describe('when all data is available', () => {
		it('returns data from app and device', () => {
			getApplicationNameSpy.mockReturnValueOnce('AppTest');
			getBuildNumberSpy.mockReturnValueOnce('34');
			getVersionSpy.mockReturnValueOnce('1.4.0');
			getBundleIdSpy.mockReturnValueOnce('com.test.app');
			getSystemNameSpy.mockReturnValueOnce('android');
			getSystemVersionSpy.mockReturnValueOnce('21');
			getUniqueIdSpy.mockReturnValueOnce('asfj4ifal4jlag54g5534');
			getModelSpy.mockReturnValueOnce('Test 3');
			expect(getDeviceData()).toStrictEqual({
				'janis-app-name': 'AppTest',
				'janis-app-build': '34',
				'janis-app-version': '1.4.0',
				'janis-app-package-name': 'com.test.app',
				'janis-app-device-os-name': 'android',
				'janis-app-device-os-version': '21',
				'janis-app-device-id': 'asfj4ifal4jlag54g5534',
				'janis-app-device-name': 'Test 3',
			});
		});
	});
	describe('when some data is not available', () => {
		it('returns default data', () => {
			getApplicationNameSpy.mockReturnValueOnce('');
			getBuildNumberSpy.mockReturnValueOnce('');
			getVersionSpy.mockReturnValueOnce('');
			getBundleIdSpy.mockReturnValueOnce('');
			getSystemNameSpy.mockReturnValueOnce('');
			getSystemVersionSpy.mockReturnValueOnce('');
			getUniqueIdSpy.mockReturnValueOnce('');
			getModelSpy.mockReturnValueOnce('');
			expect(getDeviceData()).toStrictEqual({
				'janis-app-name': '',
				'janis-app-build': '',
				'janis-app-version': '',
				'janis-app-package-name': '',
				'janis-app-device-os-name': '',
				'janis-app-device-os-version': '',
				'janis-app-device-id': '',
				'janis-app-device-name': '',
			});
		});
	});
});

describe('updateHeaders', () => {
	describe('updateHeaders function', () => {
		getApplicationNameSpy.mockReturnValue('MyApp');
		getBuildNumberSpy.mockReturnValue('1');
		getVersionSpy.mockReturnValue('1.0.0');
		getBundleIdSpy.mockReturnValue('janis.beta.app');
		getSystemNameSpy.mockReturnValue('iOS');
		getSystemVersionSpy.mockReturnValue('14.5');
		getUniqueIdSpy.mockReturnValue('123456789');
		getModelSpy.mockReturnValue('iPhone 12');

		const baseHeaders = {
			'content-Type': 'application/json',
			'janis-api-key': 'Bearer',
			'janis-app-name': 'MyApp',
			'janis-app-build': '1',
			'janis-app-version': '1.0.0',
			'janis-app-package-name': 'janis.beta.app',
			'janis-app-device-os-name': 'iOS',
			'janis-app-device-os-version': '14.5',
			'janis-app-device-id': '123456789',
			'janis-app-device-name': 'iPhone 12',
			'user-agent': 'janis.beta.app/1.0.0 (MyApp; 1) iOS/14.5 (123456789; iPhone 12)',
		};
		describe('returns baseHeaders because params are invalid', () => {
			it('empty param', () => {
				const headers = updateHeaders();
				const headersObj = updateHeaders({});
				const headersArr = updateHeaders([]);
				const headersNum = updateHeaders(6);
				const headersStr = updateHeaders('4');
				const headersNaN = updateHeaders(NaN);

				expect(headers).toEqual(baseHeaders);
				expect(headersObj).toEqual(baseHeaders);
				expect(headersArr).toEqual(baseHeaders);
				expect(headersNum).toEqual(baseHeaders);
				expect(headersStr).toEqual(baseHeaders);
				expect(headersNaN).toEqual(baseHeaders);
			});
		});

		describe('returns baseHeader with params', () => {
			it('should include custom client header', () => {
				const params = {
					client: 'my-client',
				};
				const expectedHeaders = {
					...baseHeaders,
					'janis-client': 'my-client',
				};
				expect(updateHeaders(params)).toEqual(expectedHeaders);
			});
		});
	});
});
