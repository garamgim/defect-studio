import { useState } from 'react';
import { Button } from 'antd';
import DepartmentStatistics from './DepartmentStatistics';

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
      <section className="flex flex-row  items-center align-middle justify-items-center ">
        <span>Unit : </span>
        <Button
          onClick={() => {
            if (menu === 'Department') return;
            setMenu('Department');
          }}
        >
          Department
        </Button>
        <Button
          onClick={() => {
            if (menu === 'Person') return;
            setMenu('Person');
          }}
        >
          Person
        </Button>
      </section>
      <section>
        {/* 선택옵션에 따라서 */}
        {menu === 'Department' ? <DepartmentStatistics departmentId={departmentId} /> : <div>Person</div>}
      </section>
    </div>
  );
};

export default StatisticSection;
