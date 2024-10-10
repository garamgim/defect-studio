import { TokenDistribution } from '@/types/statistics';
// 부서 토큰 분배 중복 키 제거

export const aggregateDepartmentTokenDistribution = (data: TokenDistribution[]): TokenDistribution[] => {
  const aggregatedData: { [key: string]: TokenDistribution } = {};

  data.forEach((item) => {
    if (aggregatedData[item.distribute_date]) {
      aggregatedData[item.distribute_date].token_quantity += item.token_quantity;
    } else {
      aggregatedData[item.distribute_date] = { ...item };
    }
  });

  return Object.values(aggregatedData);
};
