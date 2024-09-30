import { useQuery } from '@tanstack/react-query';
import { Select } from 'antd';
import { AxiosError, AxiosResponse } from 'axios';
import { getAllDepartments } from '../../../api/department';
import { departmentType } from '../../../api/department';
import { useGetMyInfo } from '../../../api/user';
import { useEffect } from 'react';

interface SelectOptionType {
  value: number;
  label: string;
}

interface SelectDepartmentProps {
  setSelectedDepartment: (departmentsId: number | undefined) => void;
}

const SelectDepartment = ({ setSelectedDepartment }: SelectDepartmentProps) => {
  // 내정보호출
  const { myInfo } = useGetMyInfo({
    isLoggedIn: !!localStorage.getItem('accessToken')
  });
  useEffect(() => {
    setSelectedDepartment(myInfo?.department_id);
  }, [myInfo?.department_id]);

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
          defaultValue={myInfo?.department_id ? myInfo.department_id : undefined}
          disabled={myInfo?.role !== 'super_admin'}
          options={[...data]}
        />
      )}
    </section>
  );
};

export default SelectDepartment;
