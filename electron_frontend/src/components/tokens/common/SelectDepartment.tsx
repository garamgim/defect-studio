import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import { AxiosError, AxiosResponse } from 'axios';
import { getAllDepartments } from '../../../api/department';
import { departmentType } from '../../../api/department';

interface SelectOptionType {
  value: number;
  label: string;
}

interface SelectDepartmentProps {
  setSelectedDepartment: React.Dispatch<React.SetStateAction<number | undefined>>;
}

const SelectDepartment = ({ setSelectedDepartment }: SelectDepartmentProps) => {
  // T : AxiosResponse(즉 QueryFn의 반환값), V : SelectType(즉 최종리턴값)
  const { data, isError, error, isLoading } = useQuery<
    AxiosResponse<departmentType[]>,
    AxiosError,
    SelectOptionType[],
    string[]
  >({
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

  return (
    <section className="flex flex-col">
      {isLoading && <div>Loading...</div>}
      {isError && <div>{error?.message || 'Try again Later'}</div>}
      {data && (
        <Select
          className="align-middle"
          showSearch
          style={{ width: '100%' }}
          placeholder="Search to Select Department"
          optionFilterProp="label"
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
          }
          onChange={(value) => setSelectedDepartment(value)}
          options={[...data]}
        />
      )}
    </section>
  );
};

export default SelectDepartment;
