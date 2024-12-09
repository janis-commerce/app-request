import {getUserInfo, getAccessToken} from '@janiscommerce/oauth-native';

const getTokenAndClient = async () => {
	try {
		const userInfo = await getUserInfo();

		const accessToken = await getAccessToken();

		const {tcode} = userInfo;

		return {accessToken, client: tcode};
	} catch (error) {
		return Promise.reject(error);
	}
};

export default getTokenAndClient;
