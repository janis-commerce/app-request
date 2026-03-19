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

jest.mock('@janiscommerce/app-device-info', () => ({
	getApplicationName: jest.fn().mockReturnValue('unknown'),
	getBuildNumber: jest.fn().mockReturnValue('unknown'),
	getVersion: jest.fn().mockReturnValue('unknown'),
	getBundleId: jest.fn().mockReturnValue('in.janis.picking'),
	getSystemName: jest.fn().mockReturnValue('unknown'),
	getSystemVersion: jest.fn().mockReturnValue('unknown'),
	getUniqueId: jest.fn().mockReturnValue('unknown'),
	getModel: jest.fn().mockReturnValue('unknown'),
}));

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

jest.mock('@janiscommerce/app-analytics', () =>
	jest.fn().mockImplementation(() => ({
		sendCustomEvent: jest.fn(),
	})),
);
