import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import axios from 'axios';
import { ICrudProps } from '../types';
import { AxiosRequestConfig } from 'axios';
import { Key, SorterResult } from 'antd/es/table/interface';

export function Crud<RecordType extends object = any>(
	props: ICrudProps<RecordType>,
) {
	const {
		dataSource,
		onChange,
		paramNames,
		actions = {},
		...restProps
	} = props;

	const { loading, data } = useTableData(formatRequestConfig(props));

	return (
		<Table loading={loading} dataSource={dataSource || data} {...restProps} />
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

function formatRequestConfig<T>(config: ICrudProps<T>) {
	const { pagination, paramNames, actions } = config;

	if (!actions['$get']) {
		return {};
	}
	const requestConfig = actions['$get'].api;
	if (!requestConfig.params) requestConfig.params = {};
	if (pagination) {
		const formattedParams = formatParams({
			paramNames,
			pagination,
		});
	}

	return requestConfig;
}

function useTableData(config: AxiosRequestConfig = {}) {
	const [loading, setLoading] = useState(false);
	const [data, setData] = useState([]);

	useEffect(() => {
		const { fetchAPI, cancelFetch } = fetchData(config);
		fetchAPI.then((res) => {
			setData(res.data);
		});
		return () => {
			cancelFetch();
		};
	});

	return { loading, data };
}

function fetchData(config: AxiosRequestConfig = {}) {
	if (!config.url) return null;
	let cancelFetch;
	const fetchAPI = axios({
		method: 'get',
		...config,
		cancelToken: new axios.CancelToken((c) => {
			cancelFetch = c;
		}),
	});
	return { fetchAPI, cancelFetch };
}
