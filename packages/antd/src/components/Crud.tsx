import React from 'react';
import { Table } from 'antd';
import isEqual from 'lodash/isEqual';
import { ICrudProps, useTableData, formatParams } from '@react-crud/core';

function Crud<RecordType extends object = any>(props: ICrudProps<RecordType>) {
	const {
		dataSource,
		onChange,
		pagination: originPagination = {},
		paramNames,
		actions = {},
		...restProps
	} = props;

	const { loading, data, pagination } = useTableData(
		actions.$get,
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

export default React.memo(Crud, isEqual);
