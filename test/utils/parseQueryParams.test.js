import parseQueryParams from '../../lib/utils/parseQueryParams.js';

describe('parseQueryParams function', () => {
	it.each([10, 'test', true, [], {}, jest.fn(), undefined, null, NaN])(
		'returns an empty string if the argument is invalid',
		(queryParams) => {
			expect(parseQueryParams(queryParams)).toBe('');
		},
	);

	it('returns valid filters correctly parsed', () => {
		const queryParams = {filters: {status: 'active', id: '123'}};
		expect(parseQueryParams(queryParams)).toBe('?filters[status]=active&filters[id]=123&');
	});

	it('should return multiple filters correctly', () => {
		const queryParams = {filters: {status: ['active', 'test'], id: '123'}, sort: {}};
		expect(parseQueryParams(queryParams)).toBe(
			'?filters[status][0]=active&filters[status][1]=test&filters[id]=123&',
		);
	});

	it('should return sorting criteria correctly', () => {
		const queryParams = {sort: {sortBy: 'prioritizeManualAssignment'}};
		expect(parseQueryParams(queryParams)).toBe('?sortBy=prioritizeManualAssignment');
	});

	it('returns both filters and sorting criteria correctly', () => {
		const queryParams = {filters: {status: 'active'}, sort: {sortBy: 'createdAt'}};
		expect(parseQueryParams(queryParams)).toBe('?filters[status]=active&sortBy=createdAt');
	});

	it('returns both filters and sorting criteria correctly', () => {
		const queryParams = {
			filters: {status: 'active'},
			sort: {sortBy: 'createdAt', sortDirection: 'asc'},
		};
		expect(parseQueryParams(queryParams)).toBe(
			'?filters[status]=active&sortBy=createdAt&sortDirection=asc',
		);
	});

	it('returns an empty sort string if sort is not a valid object', () => {
		const queryParams = {sort: ['status:asc', 'createdAt:desc']};
		expect(parseQueryParams(queryParams)).toBe('');
	});

	it('returns filters with URL-encoded values', () => {
		const queryParams = {
			filters: {name: 'John Doe', role: 'Developer & Tester'},
		};
		expect(parseQueryParams(queryParams)).toBe(
			'?filters[name]=John%20Doe&filters[role]=Developer%20%26%20Tester&',
		);
	});

	it('returns both filters and sorting criteria correctly with empty values', () => {
		const queryParams = {filters: {status: '', id: '123'}, sort: {sortBy: ''}};
		expect(parseQueryParams(queryParams)).toBe('?filters[id]=123&');
	});
});
