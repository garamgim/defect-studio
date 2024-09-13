import { useState } from 'react';

interface StatisticSectionProps {
  departmentId: number;
}

type StatisticMenuType = 'Department' | 'Person';

// 부서 선택에 따라서
const StatisticSection = ({ departmentId }: StatisticSectionProps) => {
  // 선택옵션 - 부서, 개인
  const [menu, setMenu] = useState<StatisticMenuType>('Department');

  return (
    <div className="flex flex-col justify-center align-middle">
      {/* 선택해더 */}
      <section className="flex flex-col">
        <div>Loading...</div>
      </section>
      <div className="token-content mt-3"></div>
    </div>
  );
};

export default StatisticSection;
