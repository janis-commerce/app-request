import {getUserInfo, getAccessToken} from '@janiscommerce/oauth-native';
import {promiseWrapper, isObject} from './helpers.js';

const getTokenAndClient = async () => {
	try {
		const [userInfo, errorUserInfo] = await promiseWrapper(getUserInfo());
		if (!isObject(userInfo) || errorUserInfo) throw new Error('error getting userInfo');

		const [accessToken, errorAccessToken] = await promiseWrapper(getAccessToken());
		if (!accessToken || errorAccessToken)
			throw new Error('error getting oauthTokens from async storages');

		const {tcode} = userInfo;

		return {accessToken, client: tcode};
	} catch (error) {
		return Promise.reject(error);
	}
};

export default getTokenAndClient;
