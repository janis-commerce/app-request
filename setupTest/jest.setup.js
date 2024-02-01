jest.mock('@janiscommerce/oauth-native', () => ({
	__esModule: true, // this property makes it work
	useOauthData: jest.fn().mockReturnValue({
		oauthTokens: {
			accessToken: 'validtoken',
		},
		userData: {
			tcode: 'validtcode',
			given_name: 'User',
			timage: 'https://srcimg.com/test.jpg',
			name: 'Janis Fizzmod',
			email: 'info@janis.com',
			images: {big: 'https://test.com'},
			lang: 'es',
		},
		isLogged: true,
		loading: false,
		handleLogout: () => {},
	}),
	getUserInfo: jest.fn(),
	getAccessToken: jest.fn(),
}));

jest.mock('react-native-device-info', () => {
	const RNDeviceInfo = jest.requireActual(
		'react-native-device-info/jest/react-native-device-info-mock',
	);
	return {
		...RNDeviceInfo,
	};
});

jest.mock('@janiscommerce/app-crashlytics', () =>
	jest.fn().mockImplementation(() => ({
		crash: jest.fn(),
		log: jest.fn(),
		recordError: jest.fn(),
		setAttribute: jest.fn(),
		setAttributes: jest.fn(),
		setUserId: jest.fn(),
		setCrashlyticsCollectionEnabled: jest.fn(),
		isCrashlyticsCollectionEnabled: true,
	})),
);
