import { TokenUsage } from '@/types/statistics'; // Response Type

// 기존 데이터에 Total에 대한 계산해주는 것 - MemberTokenUsage.tsx에서 사용
type TotalResult = {
  [key: string]: number;
};
export const calculateTotal = (data: TokenUsage[]): TokenUsage[] => {
  const totalResult: TotalResult = {};
  //   Hash를 이용해서 날짜별로 사용량을 계산
  data.forEach((item) => {
    if (item.usage_date in totalResult) {
      totalResult[item.usage_date] += item.token_quantity;
    } else {
      totalResult[item.usage_date] = item.token_quantity;
    }
  });

  //   Total에 대한 데이터를 만들어줌
  const totalData = Object.keys(totalResult).map((key) => ({
    usage_date: key,
    use_type: 'Total' as const,
    token_quantity: totalResult[key]
  }));
  return totalData;
};

// 중복된 데이터를 합쳐주는 것 - MemberTokenUsage.tsx에서 사용
export const aggregateTokenUsage = (data: TokenUsage[]): TokenUsage[] => {
  const aggregatedData: { [key: string]: TokenUsage } = {};

  data.forEach((item) => {
    const uniqueKey = `${item.usage_date}-${item.use_type}`;

    if (aggregatedData[uniqueKey]) {
      aggregatedData[uniqueKey].token_quantity += item.token_quantity;
    } else {
      aggregatedData[uniqueKey] = { ...item };
    }
  });

  return Object.values(aggregatedData);
};
