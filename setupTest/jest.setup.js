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

jest.mock('react-native-fs', () => ({
	mkdir: jest.fn(),
	moveFile: jest.fn(),
	copyFile: jest.fn(),
	pathForBundle: jest.fn(),
	pathForGroup: jest.fn(),
	getFSInfo: jest.fn(),
	getAllExternalFilesDirs: jest.fn(),
	unlink: jest.fn(),
	exists: jest.fn(),
	stopDownload: jest.fn(),
	resumeDownload: jest.fn(),
	isResumable: jest.fn(),
	stopUpload: jest.fn(),
	completeHandlerIOS: jest.fn(),
	readDir: jest.fn(),
	readDirAssets: jest.fn(),
	existsAssets: jest.fn(),
	readdir: jest.fn(),
	setReadable: jest.fn(),
	stat: jest.fn(),
	readFile: jest.fn(),
	read: jest.fn(),
	readFileAssets: jest.fn(),
	hash: jest.fn(),
	copyFileAssets: jest.fn(),
	copyFileAssetsIOS: jest.fn(),
	copyAssetsVideoIOS: jest.fn(),
	writeFile: jest.fn(),
	appendFile: jest.fn(),
	write: jest.fn(),
	downloadFile: jest.fn(),
	uploadFiles: jest.fn(),
	touch: jest.fn(),
	MainBundlePath: jest.fn(),
	CachesDirectoryPath: jest.fn(),
	DocumentDirectoryPath: jest.fn(),
	ExternalDirectoryPath: jest.fn(),
	ExternalStorageDirectoryPath: jest.fn(),
	TemporaryDirectoryPath: jest.fn(),
	LibraryDirectoryPath: jest.fn(),
	PicturesDirectoryPath: jest.fn(),
}));
