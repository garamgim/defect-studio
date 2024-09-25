import { Tabs, TabsProps } from 'antd';
import MemberImageUsage from '@components/tokens/statistics/member/ImageUsage/MemberImageUsage';
import MemberToolUsage from '@components/tokens/statistics/member/ToolUsage/MemberToolUsage';

interface PersonStatisticSectionProps {
  member_id: number;
}

const PersonStatisticSection = ({ member_id }: PersonStatisticSectionProps) => {
  const items: TabsProps['items'] = [
    { key: 'ImageUage', label: 'ImageUage', children: <MemberImageUsage member_id={member_id} /> },
    { key: 'ToolUsage', label: 'ToolUsage', children: <MemberToolUsage member_id={member_id} /> }
  ];
  return (
    <div>
      <Tabs items={items} defaultActiveKey="ImageUage" />
    </div>
  );
};

export default PersonStatisticSection;
