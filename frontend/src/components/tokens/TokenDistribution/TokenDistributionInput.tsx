// 입력에 따른 토큰 분배를 설정하는 컴포넌트

import { InputNumber } from 'antd';
import { TableTokenUsageType } from './SearchDepartmentUsageToken';

interface TokenDistributionInputProps {
  selectedPeopleNumber: number; //선택한 사람 수
  selectedTokenUsage: TableTokenUsageType; // 선택한 토큰 타입
  setDistributeTokenValue: React.Dispatch<React.SetStateAction<number>>; // 분배할 토큰 수 설정
  distributeTokenValue: number; // 분배할 토큰 수
}

// 유효성 검사 함수
const isValidInput = (value: number) => {
  return Number.isInteger(value) && value > 0;
};
const TokenDistributionInput = ({
  selectedPeopleNumber,
  selectedTokenUsage,
  setDistributeTokenValue,
  distributeTokenValue
}: TokenDistributionInputProps) => {
  const MaxAvailableTokenInput = Math.floor(selectedTokenUsage.remainingQuantity / selectedPeopleNumber);
  return (
    <section className="token-content">
      <p>Please enter the amount of tokens to distribute.</p>
      <div className="flex flex-row justify-between">
        <InputNumber
          className="w-[40%]"
          min={1}
          step={1}
          defaultValue={1}
          value={distributeTokenValue}
          onChange={(e) => {
            if (!e) {
              setDistributeTokenValue(1);
            } else {
              // 입력값이 유효한지 확인
              const value = parseInt(e.toString(), 10); // 입력값을 정수로 변환
              if (isValidInput(value) && value <= MaxAvailableTokenInput) {
                setDistributeTokenValue(value);
              } else {
                // 유효하지 않은 입력에 대한 처리 (예: 경고 메시지 표시)
                console.error('Invalid input: Only positive integers are allowed.');
              }
            }
          }}
          status={!distributeTokenValue || distributeTokenValue <= MaxAvailableTokenInput ? undefined : 'error'}
        />
        <span className="text-sm">/</span>
        <span className="text-sm">{MaxAvailableTokenInput}</span>
      </div>
    </section>
  );
};

export default TokenDistributionInput;
