import { Tabs, TabsProps } from 'antd';
import DepartmentImageUsage from '@components/tokens/statistics/department/ImageUsage/DepartmentImageUsage';
import DepartmentToolUsage from '@components/tokens/statistics/department/ToolUsage/DepartmentToolUsage';
import DepartmentDistributionState from '@components/tokens/statistics/department/DistributeState/DistributeState';

import TokenUsage from '@components/tokens/statistics/department/TokenUsage/TokenUsage';

interface DepartmentStatisticsProps {
  department_id: number;
}

const DepartmentStatistics = ({ department_id }: DepartmentStatisticsProps) => {
  const items: TabsProps['items'] = [
    { key: 'ImageUsage', label: 'ImageUsage', children: <DepartmentImageUsage department_id={department_id} /> },
    { key: 'ToolUsage', label: 'ToolUsage', children: <DepartmentToolUsage department_id={department_id} /> },
    {
      key: 'DistributionState',
      label: 'Distribution State',
      children: <DepartmentDistributionState department_id={department_id} />
    },
    {
      key: 'TokenUsage',
      label: 'Token Usage',
      children: <TokenUsage department_id={department_id} />
    }
  ];
  return (
    <div className="token-content">
      <Tabs items={items} defaultActiveKey="ImageUage" destroyInactiveTabPane={true} />
    </div>
  );
};

export default DepartmentStatistics;
