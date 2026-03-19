import {getBundleId} from '@janiscommerce/app-device-info';

const getEnvironment = () => {
	const bundleId = (getBundleId() || '').toLowerCase();
	if (bundleId.endsWith('.beta')) return 'janisdev';
	if (bundleId.endsWith('.qa')) return 'janisqa';
	return 'janis';
};

export default getEnvironment;
