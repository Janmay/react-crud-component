import { useEffect, useState } from 'react';
import isEqual from 'lodash/isEqual';
import { usePrevious } from './usePrevious';
import { CrudActionServiceData, ICrudProps } from '../types';

export function useTableData(action, params: Record<string, any> = {}) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [pagination, setPagination] = useState<ICrudProps<any>['pagination']>({
		current: 1,
		pageSize: 10,
	});

	const previousAction = usePrevious(action);
	const previousParams = usePrevious(params);
	const isChanged =
		!isEqual(action, previousAction) || !isEqual(params, previousParams);
	useEffect(() => {
		if (!isChanged) return;

		const { service, cancel } = action;
		if (!service) return;
		setLoading(true);
		service(params).then((res: CrudActionServiceData<any>) => {
			setLoading(false);
			setData(res.data);
			setPagination(res.pagination);
		});
		return () => {
			if (cancel) cancel();
		};
	}, [isChanged]);

	return { loading, data, pagination };
}
