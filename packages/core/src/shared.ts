import { ICrudProps } from './types';
import { Key, SorterResult } from 'antd/es/table/interface';

export function formatParams({
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
