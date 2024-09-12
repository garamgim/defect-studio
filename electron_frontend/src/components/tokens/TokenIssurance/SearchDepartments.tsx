import { useQuery } from '@tanstack/react-query';
import { getAllDepartments } from '../../../api/department';
import { AxiosError, AxiosResponse } from 'axios';
import { Select, Space } from 'antd';

type departmentType = {
  department_id: number;
  department_name: string;
};

type AntdSelectOptionType = {
  value: number;
  label: string;
};

type PropsType = {
  departmentsId: number[];
  setDepartmentsId: (departmentsId: number[]) => void;
};

const SearchDepartments = ({ departmentsId, setDepartmentsId }: PropsType) => {
  //부서 불러오기
  const {
    data = [],
    isPending,
    isError,
    error
  } = useQuery<AxiosResponse<departmentType[]>, AxiosError, AntdSelectOptionType[], string[]>({
    queryKey: ['departments'],
    queryFn: getAllDepartments,
    select: (response) =>
      response.data.map((department) => {
        return {
          value: department.department_id,
          label: department.department_name
        };
      })
  });
  //컴포넌트 출력
  return (
    <section className="token-content">
      <div>
        <p className="text-[20px] font-bold">Please select the departments you wish to grant the token to</p>
      </div>

      <div className="">
        {isPending && <p>Loading...</p>}
        {isError && <p>{error.message}</p>}
        {data && (
          <Select
            showSearch
            mode="multiple"
            filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
            value={departmentsId}
            onChange={setDepartmentsId}
            notFoundContent={isPending ? 'Loading...' : 'Not Found'}
            style={{ width: '100%' }}
            options={data}
            optionRender={(option) => (
              <Space>
                <span>{option.label}</span>
              </Space>
            )}
          />
        )}
      </div>
    </section>
  );
};

export default SearchDepartments;
