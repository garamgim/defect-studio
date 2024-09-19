import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { DepartmentPersonType, getDepartmentPeople } from '../../../api/department';
import { Select, Space } from 'antd';
import { useState } from 'react';
import PersonStatisticSection from './PersonStatisticSection';

interface DepartmentPersonStatisticsProps {
  departmentId: number;
}

interface SelectOptionType {
  key: number;
  value: number;
  label: string;
  name: string;
  nickname: string;
}

const DepartmentPersonStatistics = ({ departmentId }: DepartmentPersonStatisticsProps) => {
  // 선택된 사람
  const [selectedMember, setSelectedMember] = useState<number | undefined>(undefined);

  // 부서 내 사람들 목록 불러오기
  const { data, isPending, isError, error } = useQuery<
    AxiosResponse<DepartmentPersonType[]>,
    Error,
    SelectOptionType[],
    (string | number)[]
  >({
    queryKey: ['department_people', departmentId],
    queryFn: () => getDepartmentPeople(departmentId),
    select: (data) =>
      data.data.map((item) => ({
        key: item.member_id,
        name: item.name,
        nickname: item.nickname,
        value: item.member_id,
        label: `${item.name} : ${item.nickname}`
      }))
  });

  // 에러 날 경우 아에 에러 메시지 출력 , 로딩중 표시
  if (isError) {
    return <div>Error: {error?.message}</div>;
  } else if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <section>
      <div>
        <Select
          className="w-full mt-3"
          showSearch
          placeholder="Select a person"
          filterOption={(input, option) => (option?.name ?? '').toLowerCase().includes(input.toLowerCase())}
          options={data}
          labelRender={(props) => {
            return (
              <div>
                <span>{props.label}</span>
              </div>
            );
          }}
          value={selectedMember}
          onChange={(value) => setSelectedMember(value)}
          optionRender={(option) => (
            <Space>
              <span>
                {option.data.name} : {option.data.nickname}
              </span>
            </Space>
          )}
        />
      </div>
      {
        // 선택된 사람이 있을 경우
        selectedMember && (
          <div className="token-content mt-3">
            <PersonStatisticSection member_pk={selectedMember} />
          </div>
        )
      }
    </section>
  );
};

export default DepartmentPersonStatistics;
