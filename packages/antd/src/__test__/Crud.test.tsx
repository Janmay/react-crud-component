import React from 'react';
import { render, act } from '@testing-library/react';

import Crud from '../components/Crud';

/* eslint-disable @typescript-eslint/camelcase */
describe('Crud', () => {
	const fakeData = [
		{
			id: 1,
			name: 'test',
			created_at: '2020-01-01',
		},
	];
	const resp = {
		code: 200,
		data: {
			records: fakeData,
			pagination: {
				current_page: 1,
				per_page: 10,
				total: fakeData.length,
			},
		},
	};

	const tableProps = {
		columns: [
			{
				dataIndex: 'id',
				title: 'ID',
			},
			{
				dataIndex: 'name',
				title: '名称',
			},
			{
				dataIndex: 'created_at',
				title: '日期',
			},
		],
		actions: {
			$get: {
				service: () => Promise.resolve(resp.data),
			},
		},
	};

	it('render remote data', async () => {
		await act(async () => {
			render(<Crud {...tableProps} />);
		});
	});
});
