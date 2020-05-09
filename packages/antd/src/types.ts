import { TableProps } from 'antd/es/table';
import { AxiosRequestConfig } from 'axios';

export type CrudActions = {
	api: AxiosRequestConfig;
};

export type ICrudProps<RecordType> = TableProps<RecordType> & {
	paramNames: Record<string, string>;
	actions: {
		[k: string]: CrudActions;
	};
};
