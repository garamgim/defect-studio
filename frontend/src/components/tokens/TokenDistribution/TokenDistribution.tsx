import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Select, message } from 'antd';
import { AxiosError, AxiosResponse } from 'axios';
import { getAllDepartments } from '../../../api/department';
import SearchDepartmentPeople from './SearchDepartmentPeople';
import { useEffect, useState } from 'react';
import SearchDepartmentUsageToken from './SearchDepartmentUsageToken';
import TokenDistributionInput from './TokenDistributionInput';
import { TableTokenUsageType } from './SearchDepartmentUsageToken';
import { distributeTokenRequest } from './../../../api/token';
import { useGetMyInfo } from '@hooks/user/useGetMyInfo';

type departmentType = {
  department_id: number;
  department_name: string;
};

type SelectOptionType = {
  value: number;
  label: string;
};
const TokenDistribution = () => {
  // 로그인 유저 정보 호출
  const { myInfo, myInfoPending, myInfoLoading, isGetMyInfoError, myInfoError } = useGetMyInfo({
    isLoggedIn: localStorage.getItem('accessToken') ? true : false
  });

  // 관련 queryClient 호출
  const queryClient = useQueryClient();

  const [selectedDepartment, setSelectedDepartment] = useState<number | undefined>(myInfo?.department_id); // 부서 선택
  const [selectedDepartmentPeople, setSelectedDepartmentPeople] = useState<number[]>([]); // 분배받은 사람들 선택
  const [selectedDepartmentTokenUsage, setSelectedDepartmentTokenUsage] = useState<TableTokenUsageType[]>([]); // 부서 토큰 선택
  const [distributeTokenValue, setDistributeTokenValue] = useState<number>(0); // 분배할 토큰 값

  // ---- 만약 선택이 바뀌었으면 초기화 시키는 모든 옵션들
  useEffect(() => {
    if (!selectedDepartment) {
      setSelectedDepartmentPeople([]);
      setSelectedDepartmentTokenUsage([]);
      setDistributeTokenValue(0);
    }
  }, [selectedDepartment]);

  useEffect(() => {
    if (!selectedDepartmentPeople || selectedDepartmentPeople.length === 0) {
      setSelectedDepartmentTokenUsage([]);
      setDistributeTokenValue(0);
    }
  }, [selectedDepartmentPeople]);
  //---------------------------------------------------------------------

  // Distribute 함수. 성공시, 관련 쿼리들을 리프레시
  const { mutate, isPending } = useMutation({
    mutationFn: distributeTokenRequest,
    onSuccess: () => {
      message.success('Token distribution was successful.');
      queryClient.refetchQueries({
        queryKey: ['department_people']
      });
      queryClient.refetchQueries({
        queryKey: ['department_tokenUsage']
      });
    },
    onError: () => {
      message.error('Token distribution failed.');
    }
  });

  // 부서 리스트
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

  if (myInfoPending || myInfoLoading) {
    return <div>Loading...</div>;
  }
  if (isGetMyInfoError) {
    return <div>Error: {myInfoError?.message || 'Please login again Please'}</div>;
  }

  return (
    <div className="flex flex-col justify-center align-middle">
      {/* 부서 선택 */}
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
            onChange={(value: number) => setSelectedDepartment(value)}
            options={[...data]}
            defaultValue={myInfo?.department_id ? myInfo.department_id : undefined}
            disabled={myInfo?.role !== 'super_admin'}
          />
        )}
      </section>

      {/* 해당 인원 선택 */}
      {selectedDepartment && (
        <section className="flex flex-col mt-4">
          <SearchDepartmentPeople
            departmentsId={selectedDepartment}
            selectedDepartmentPeople={selectedDepartmentPeople}
            setSelectedDepartmentPeople={setSelectedDepartmentPeople}
          />
        </section>
      )}

      {
        //부서 사람 선택 후 분배 토큰 선택
        selectedDepartment && selectedDepartmentPeople.length > 0 && (
          <SearchDepartmentUsageToken
            departmentsId={selectedDepartment}
            selectedDepartmentTokenUsage={selectedDepartmentTokenUsage}
            setSelectedDepartmentTokenUsage={setSelectedDepartmentTokenUsage}
          />
        )
      }
      {selectedDepartment && selectedDepartmentPeople.length > 0 && selectedDepartmentTokenUsage.length > 0 && (
        <TokenDistributionInput
          selectedPeopleNumber={selectedDepartmentPeople.length}
          selectedTokenUsage={selectedDepartmentTokenUsage[0]}
          setDistributeTokenValue={setDistributeTokenValue}
          distributeTokenValue={distributeTokenValue}
        />
      )}

      {selectedDepartment &&
        selectedDepartmentPeople.length > 0 &&
        selectedDepartmentTokenUsage.length > 0 &&
        distributeTokenValue > 0 && (
          <div className="flex justify-end mt-4">
            <button
              onClick={() => {
                mutate({
                  token_id: selectedDepartmentTokenUsage[0].key,
                  data: { quantity: distributeTokenValue, member_ids: selectedDepartmentPeople }
                });
              }}
              disabled={isPending}
              className="text-black dark:text-white px-4 py-2 rounded-md hover:scale-105 transition-transform duration-200 active:scale-95"
            >
              {isPending ? 'Loading...' : 'Distribute Token'}
            </button>
          </div>
        )}
    </div>
  );
};

export default TokenDistribution;
