import getTokenAndClient from '../../lib/utils/getTokenAndClient.js';
import {getUserInfo, getAccessToken} from '@janiscommerce/oauth-native';

describe('getTokenAndClient function', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should return accessToken and client when successful', async () => {
		const userInfoResponse = {tcode: 'exampleClient'};
		const accessTokenResponse = 'exampleAccessToken';

		getUserInfo.mockResolvedValue(userInfoResponse);
		getAccessToken.mockResolvedValue(accessTokenResponse);

		const result = await getTokenAndClient();

		expect(result).toEqual({
			accessToken: accessTokenResponse,
			client: 'exampleClient',
		});

		expect(getUserInfo).toHaveBeenCalled();
		expect(getAccessToken).toHaveBeenCalled();
	});

	describe('getUserInfo errors', () => {
		it('should throw an error when getUserInfo fails', async () => {
			getUserInfo.mockRejectedValue('error getting userInfo');

			await expect(getTokenAndClient()).rejects.toThrow('error getting userInfo');
		});

		it('should throw an error if userInfo is not a valid object', async () => {
			getUserInfo.mockResolvedValue('user');

			await expect(getTokenAndClient()).rejects.toThrow('error getting userInfo');
		});
	});

	it('should throw an error when getAccessToken fails', async () => {
		getUserInfo.mockResolvedValue({tcode: 'janis'});
		getAccessToken.mockRejectedValue('error getting oauthTokens from async storages');

		await expect(getTokenAndClient()).rejects.toThrow(
			'error getting oauthTokens from async storages',
		);
	});

	//   it("should throw an error when an unexpected error occurs", async () => {
	//     // Mock getUserInfo to return an error
	//     getUserInfo.mockResolvedValue([null, new Error("getUserInfo error")]);
	//     promiseWrapper.mockImplementation(() =>
	//       Promise.reject(new Error("unexpected error"))
	//     );

	//     await expect(getTokenAndClient()).rejects.toThrow("unexpected error");
	//   });
});
