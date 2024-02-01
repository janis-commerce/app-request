import {isObject, isString, isArray} from './helpers.js';
/**
 * @name parseQueryParams
 * @description get the filters and sorting criteria parsed to send to janis api
 * @param {object} queryParams - object with the filters and sorting criteria (each filter and sort is a pair of filter: value)
 * @param {object} queryParams.filters - object with the filters (each property is a pair of filter: value)
 * @param {string} queryParams.sort - string with session sorting criteria
 * @returns {string} parsed string with the filters and sorting criteria to add to query
 * @module utils:api:utils
 * @example parseQueryParams({filters: {status: 'active'}}) => '?filters[status]=active&'
 * @example parseQueryParams({filters: {status: 'active', id='11111'}, sort: {status: 'asc'}}) => '?filters[status]=active&filters[id]=11111&sortBy[0]=status&sortDirection[0]=asc&'
 */
const parseQueryParams = (queryParams) => {
	if (!isObject(queryParams) || !Object.keys(queryParams).length) return '';

	const {filters, sort} = queryParams;
	const validFilters = isObject(filters) && Object.keys(filters);
	const validSort = !!sort && isString(sort);

	const parsedFilters = validFilters
		? Object.entries(filters)
				.map(([filter, value]) => {
					if (value && !!value.length && isArray(value))
						return value
							.map(
								(val, index) =>
									`filters[${encodeURIComponent(filter)}][${index}]=${encodeURIComponent(val)}&`,
							)
							.join('');
					if (value) return `filters[${encodeURIComponent(filter)}]=${encodeURIComponent(value)}&`;
					return '';
				})
				.filter(Boolean)
				.join('')
		: '';

	const parsedSort = validSort ? `sortBy=${encodeURIComponent(sort)}` : '';

	if (!parsedFilters && !parsedSort) return '';

	return `?${parsedFilters}${parsedSort}`;
};

export default parseQueryParams;
