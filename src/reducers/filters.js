const initialState = {
	filters: [],
	filtersLoadingStatus: 'idle',
	filterValue: 'all',
};

const filters = (state = initialState, action) => {
	switch (action.type) {
		case 'FILTERS_FETCHING':
			return {
				...state,
				filtersLoadingStatus: 'loading',
			};
		case 'FILTERS_FETCHED':
			return {
				...state,
				filtersLoadingStatus: 'idle',
				filters: action.payload,
			};
		case 'FILTERS_FETCHING_ERROR':
			return {
				...state,
				filtersLoadingStatus: 'error',
			};
		case 'FILTER_VALUE':
			return {
				...state,
				filterValue: action.payload,
			};
		default:
			return state;
	}
};

export default filters;
