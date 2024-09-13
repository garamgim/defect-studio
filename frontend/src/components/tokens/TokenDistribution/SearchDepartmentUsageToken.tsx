import { useQuery } from '@tanstack/react-query';
import { getDepartmentTokenUsage } from '../../../api/token';
import { TokenReadResponseType } from './../../../api/token';
import { AxiosError, AxiosResponse } from 'axios';
import React, { useState } from 'react';
import { ConfigProvider, Table, TableColumnsType, theme } from 'antd';
import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';
import { TableRowSelection } from 'antd/es/table/interface';

interface PropsDataType {
  departmentsId: number;
  selectedDepartmentTokenUsage: TableTokenUsageType[];
  setSelectedDepartmentTokenUsage: React.Dispatch<React.SetStateAction<TableTokenUsageType[]>>;
}

//테이블에 사용할 것
export interface TableTokenUsageType {
  key: number; // string | number | symbol;
  startDate: string;
  endDate: string;
  originalQuantity: number;
  remainingQuantity: number;
  isActive: boolean;
}

// 테이블에 나타낼 필드 (컬럼) 설정
const columns: TableColumnsType<TableTokenUsageType> = [
  { title: 'Token ID', dataIndex: 'key', key: 'key', sorter: (a, b) => a.key - b.key },
  {
    title: 'End Date',
    dataIndex: 'endDate',
    key: 'endDate',
    sorter: (a, b) => new Date(a.endDate).getTime() - new Date(b.endDate).getTime(),
    sortDirections: ['ascend']
  },
  {
    title: 'Remaining Quantity',
    dataIndex: 'remainingQuantity',
    key: 'remainingQuantity',
    sorter: (a, b) => a.remainingQuantity - b.remainingQuantity,
    sortDirections: ['descend']
  }
];
const SearchDepartmentUsageToken = ({ departmentsId, setSelectedDepartmentTokenUsage }: PropsDataType) => {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { data, isPending, isError, error } = useQuery<
    AxiosResponse<TokenReadResponseType[]>,
    AxiosError,
    TableTokenUsageType[],
    (string | number)[]
  >({
    queryKey: ['department_tokenUage', departmentsId],
    queryFn: () => getDepartmentTokenUsage(departmentsId),
    select: (data) =>
      data.data[0].tokens
        .map((item) => ({
          key: item.token_id,
          startDate: item.start_date.substring(0, 10),
          endDate: item.end_date.substring(0, 10),
          originalQuantity: item.origin_quantity,
          remainingQuantity: item.remain_quantity,
          isActive: item.is_active
        }))
        .filter((item) => item.isActive === true)
  });

  // Table Option
  const rowSelection: TableRowSelection<TableTokenUsageType> = {
    type: 'radio',
    selectedRowKeys,
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRowKeys(selectedRowKeys);
      setSelectedDepartmentTokenUsage(selectedRows);
    },
    getCheckboxProps: (record: TableTokenUsageType) => ({
      disabled: new Date(record.endDate) < new Date()
    })
  };

  // 다크모드 판단 밑 테마용
  const setThemeMode = useSelector((state: RootState) => state.theme.mode);
  const { defaultAlgorithm, darkAlgorithm } = theme;

  return (
    <section className="token-content">
      <div>
        <p className="text-[20px] font-bold">Please choose the people to whom the tokens will be distributed.</p>
      </div>

      <div className="">
        {isPending && <p>Loading...</p>}
        {isError && <p>{error.message}</p>}
        {data && (
          <div>
            <ConfigProvider
              theme={{
                algorithm: setThemeMode === 'dark' ? darkAlgorithm : defaultAlgorithm
              }}
            >
              <Table
                className={setThemeMode === 'dark' ? 'dark-table' : 'light-table'}
                columns={columns}
                dataSource={data}
                rowSelection={rowSelection}
                pagination={{
                  defaultPageSize: 5,
                  showSizeChanger: true,
                  pageSizeOptions: ['5', '10', '15', '20']
                }}
              />
            </ConfigProvider>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchDepartmentUsageToken;
