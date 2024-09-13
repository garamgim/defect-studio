import { useQuery } from '@tanstack/react-query';
import { Button, Table } from 'antd'; // 테이블
import { AxiosError, AxiosResponse } from 'axios'; // Axios요청타입
import { DepartmentPersonType } from '../../../api/department'; // 요청 성공시 받아오는 데이터 타입
import { getDepartmentPeople } from '../../../api/department'; // 요청 함수
import { ConfigProvider, theme } from 'antd'; //다크모드
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { TableRowSelection } from 'antd/es/table/interface';
import { RootState } from './../../../store/store';

type PropsType = {
  departmentsId: number;
  selectedDepartmentPeople?: number[];
  setSelectedDepartmentPeople: React.Dispatch<React.SetStateAction<number[]>>;
};

type RowSelectionType = {
  key: number;
  name: string;
  nickname: string;
  token_quantity: number;
};

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name'
  },
  {
    title: 'Nickname',
    dataIndex: 'nickname',
    key: 'nickname'
  },
  {
    title: 'Token Quantity',
    dataIndex: 'token_quantity',
    key: 'token_quantity'
  }
];

const SearchDepartmentUsageToken = ({ departmentsId, setSelectedDepartmentPeople }: PropsType) => {
  //부서 불러오기
  //컴포넌트 출력
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const { defaultAlgorithm, darkAlgorithm } = theme;
  const { data, isPending, isError, error } = useQuery<
    AxiosResponse<DepartmentPersonType[]>,
    AxiosError,
    RowSelectionType[],
    (string | number)[]
  >({
    queryKey: ['department_people', departmentsId],
    queryFn: () => getDepartmentPeople(departmentsId),
    select: (data) =>
      data.data.map((item) => ({
        key: item.member_id,
        name: item.name,
        nickname: item.nickname,
        token_quantity: item.token_quantity
      }))
  });

  const setThemeMode = useSelector((state: RootState) => state.theme.mode);

  const rowSelection: TableRowSelection<RowSelectionType> = {
    type: 'checkbox',
    selectedRowKeys,
    onChange: (NewselectedRowKeys: React.Key[], selectedRows: RowSelectionType[]) => {
      console.log(`selectedRowKeys: ${NewselectedRowKeys}`, 'selectedRows: ', selectedRows);
      setSelectedRowKeys(NewselectedRowKeys);
      setSelectedDepartmentPeople(selectedRows.map((row) => row.key));
    },
    getCheckboxProps: (record: RowSelectionType) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name
    })
  };

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

            <div>
              <Button
                onClick={() => {
                  setSelectedDepartmentPeople(data.map((row) => row.key));
                  setSelectedRowKeys(data.map((row) => row.key));
                }}
              >
                Select All
              </Button>

              <Button
                onClick={() => {
                  setSelectedDepartmentPeople([]);
                  setSelectedRowKeys([]);
                }}
              >
                UnselectAll
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default SearchDepartmentUsageToken;
