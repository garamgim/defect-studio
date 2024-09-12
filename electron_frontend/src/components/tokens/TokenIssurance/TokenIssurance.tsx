import SearchDepartments from './SearchDepartments';
import TokenIssueInput from './TokenIssueInput';
import { convertDateToString } from '../../../util/covertDateToString';
import { useState } from 'react';
import { createTokenIssue, TokenIssueRequestType } from '../../../api/token';
import { message } from 'antd';
import { useMutation } from '@tanstack/react-query';

const readyReqeusetToekn = (endDate: string, quantity: number, departmentsId: number[]): TokenIssueRequestType => {
  return {
    end_date: endDate + 'T23:59:59.000Z',
    quantity: quantity,
    department_ids: departmentsId
  };
};

const checkRequestTokenIssue = (endDate: string, quantity: number, departmentsId: number[]): boolean => {
  if (endDate === '' || quantity <= 0 || departmentsId.length === 0) {
    return false;
  }
  return true;
};

const TokenIssurance = () => {
  // 마감일 변경
  const [endDate, setEndDate] = useState<string>(convertDateToString(new Date()));
  const [quantity, setQuantity] = useState<number>(0);
  const [departmentsId, setDepartmentsId] = useState<number[]>([]);
  const { mutate, isPending } = useMutation({
    mutationFn: createTokenIssue,
    onSuccess: () => {
      message.success('Token issuance was successful.');
    },
    onError: () => {
      alert('Token issuance failed.');
    }
  });
  return (
    <section className="flex flex-col justify-center align-middle">
      <SearchDepartments departmentsId={departmentsId} setDepartmentsId={setDepartmentsId} />
      <TokenIssueInput quantity={quantity} setQuantity={setQuantity} endDate={endDate} setEndDate={setEndDate} />

      {/* 조건 만족시 요청 버튼  */}
      {endDate && quantity && departmentsId && checkRequestTokenIssue(endDate, quantity, departmentsId) ? (
        <div className="flex justify-end mt-4">
          <button
            className="text-black dark:text-white px-4 py-2 rounded-md hover:scale-105 transition-transform duration-200 active:scale-95"
            onClick={() => {
              mutate(readyReqeusetToekn(endDate, quantity, departmentsId));
            }}
            disabled={isPending}
          >
            {isPending ? 'Loading...' : 'Issue Token'}
          </button>
        </div>
      ) : null}
    </section>
  );
};

export default TokenIssurance;
