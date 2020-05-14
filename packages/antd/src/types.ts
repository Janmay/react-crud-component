import { TableProps } from 'antd/es/table';

export type CrudActionServiceData<RecordType> = {
	data: Array<RecordType>;
	pagination: ICrudProps<RecordType>['pagination'];
};

export type CrudActions<RecordType> = {
	service?: (params: Record<string, any>) => CrudActionServiceData<RecordType>;
	cancel?: () => void;
};

export type ICrudProps<RecordType> = TableProps<RecordType> & {
	paramNames: Record<string, string>;
	actions: {
		[k: string]: CrudActions<RecordType>;
	};
};
