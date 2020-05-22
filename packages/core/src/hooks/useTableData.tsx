import { useEffect, useState, useReducer } from 'react';
import isEqual from 'lodash/isEqual';
import { usePrevious } from './usePrevious';
import { CrudActionServiceData } from '../types';

const initialState = {
	loading: false,
	data: [],
	pagination: {
		current: 1,
		pageSize: 10,
	},
};

function dataReducer(state, [type, payload]) {
	switch (type) {
		case 'fetchRequest':
			return {
				...state,
				loading: true,
			};
		case 'fetchSuccess':
			return {
				...state,
				loading: false,
				data: [...payload.data],
				pagination: { ...payload.pagination },
			};
		case 'fetchFailed':
			return {
				...state,
				loading: false,
			};
	}
}

export function useTableData(action, params: Record<string, any> = {}) {
	// const [loading, setLoading] = useState(false);
	// const [data, setData] = useState([]);
	// const [pagination, setPagination] = useState<ICrudProps<any>['pagination']>({
	// 	current: 1,
	// 	pageSize: 10,
	// });
	//
	// const previousAction = usePrevious(action);
	// const previousParams = usePrevious(params);
	// const isChanged =
	// 	!isEqual(action, previousAction) || !isEqual(params, previousParams);
	// useEffect(() => {
	// 	if (!isChanged) return;
	//
	// 	const { service, cancel } = action;
	// 	if (!service) return;
	// 	setLoading(true);
	// 	service(params).then((res: CrudActionServiceData<any>) => {
	// 		setLoading(false);
	// 		setData(res.data);
	// 		setPagination(res.pagination);
	// 	});
	// 	return () => {
	// 		if (cancel) cancel();
	// 	};
	// }, [isChanged]);
	const [state, dispatch] = useReducer(dataReducer, initialState);
	const { loading, data, pagination } = state;

	const previousAction = usePrevious(action);
	const previousParams = usePrevious(params);
	const isChanged =
		!isEqual(action, previousAction) || !isEqual(params, previousParams);

	const { service, cancel } = action;
	useEffect(() => {
		if (!isChanged) return;
		let unmounted = false;

		dispatch(['fetchRequest', '']);
		service(params)
			.then((res: CrudActionServiceData<any>) => {
				if (!unmounted) dispatch(['fetchSuccess', res]);
			})
			.catch((err) => {
				if (!unmounted) dispatch(['fetchFailed', err]);
			});

		return () => {
			unmounted = true;
			if (cancel) cancel();
		};
	}, [params]);

	return { loading, data, pagination };
}
