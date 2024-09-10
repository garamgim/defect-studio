// 입력에 따른 토큰 분배를 설정하는 컴포넌트

import { InputNumber } from 'antd';
import { TableTokenUsageType } from './SearchDepartmentUsageToken';

interface TokenDistributionInputProps {
  selectedPeopleNumber: number; //선택한 사람 수
  selectedTokenUsage: TableTokenUsageType; //최대 허용 토큰 최대량 -> TokenUsage에서 선택한 토큰 양에 기반
}
const TokenDistributionInput = ({ selectedPeopleNumber, selectedTokenUsage }: TokenDistributionInputProps) => {
  return (
    <section className="token-content">
      <p>Please enter the amount of tokens to distribute.</p>
      <InputNumber className="w-full" min={1} step={1} defaultValue={1} />
      {selectedPeopleNumber} <br></br>
      {selectedTokenUsage.remainingQuantity} <br></br>
    </section>
  );
};

export default TokenDistributionInput;
