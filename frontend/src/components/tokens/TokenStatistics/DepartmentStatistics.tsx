import { Tabs, TabsProps } from 'antd';
import DepartmentImageUsage from '@components/tokens/statistics/department/ImageUsage/DepartmentImageUsage';
import DepartmentToolUsage from '../statistics/department/ToolUsage/DepartmentToolUsage';

interface DepartmentStatisticsProps {
  department_id: number;
}

const DepartmentStatistics = ({ department_id }: DepartmentStatisticsProps) => {
  const items: TabsProps['items'] = [
    { key: 'ImageUage', label: 'ImageUage', children: <DepartmentImageUsage department_id={department_id} /> },
    { key: 'ToolUsage', label: 'ToolUsage', children: <DepartmentToolUsage department_id={department_id} /> }
  ];
  return (
    <div className="token-content">
      <Tabs items={items} defaultActiveKey="ImageUage" />
    </div>
  );
};

export default DepartmentStatistics;
