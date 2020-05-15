import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { CrudActionServiceData, ICrudProps } from '../types';
import { Key, SorterResult } from 'antd/es/table/interface';

export function Crud<RecordType extends object = any>(
	props: ICrudProps<RecordType>,
) {
	const {
		dataSource,
		onChange,
		pagination: originPagination = {},
		paramNames,
		actions = {},
		...restProps
	} = props;

	const { loading, data, pagination } = useTableData(
		actions.$get || '',
		formatParams({
			paramNames,
			pagination: originPagination,
		}),
	);

	return (
		<Table
			loading={loading}
			dataSource={dataSource || data}
			pagination={{
				...originPagination,
				...pagination,
			}}
			{...restProps}
		/>
	);
}

function formatParams({
	paramNames = {
		page: 'page',
		size: 'size',
		sort: 'sort',
	},
	pagination,
	filters,
	sorter,
}: {
	paramNames: ICrudProps<any>['paramNames'];
	pagination?: ICrudProps<any>['pagination'];
	filters?: Record<string, Key[] | null>;
	sorter?: SorterResult<any> | SorterResult<any>[];
}) {
	const params = {};

	if (pagination) {
		const {
			current,
			defaultCurrent,
			pageSize,
			defaultPageSize,
			pageSizeOptions,
		} = pagination;
		// current page
		params[paramNames.page] = current || defaultCurrent || 1;
		// page size
		let size = pageSize || defaultPageSize || 10;
		if (!pageSize && pageSizeOptions && pageSizeOptions.length) {
			size = +pageSizeOptions[0];
		}
		params[paramNames.size] = size;
	}

	if (filters) {
		for (const k in filters) {
			if (filters[k] === null || filters[k] === undefined) continue;
			params[k] = filters[k];
		}
	}

	if (sorter) {
		if (!Array.isArray(sorter)) sorter = [sorter];
		if (!params[paramNames.sort]) params[paramNames.sort] = {};
		sorter.forEach((item) => {
			const fields = Array.isArray(item.field) ? item.field : [item.field];
			fields.forEach((f) => {
				if (!item.order) {
					if (params[paramNames.sort][f]) {
						delete params[paramNames.sort][f];
					}
				} else {
					params[paramNames.sort][f] = item.order;
				}
			});
		});
	}

	return params;
}

export function useTableData(action, params: Record<string, any> = {}) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);
	const [pagination, setPagination] = useState<ICrudProps<any>['pagination']>({
		current: 1,
		pageSize: 10,
	});

	useEffect(() => {
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
	}, [action, params]);

	return { loading, data, pagination };
}
