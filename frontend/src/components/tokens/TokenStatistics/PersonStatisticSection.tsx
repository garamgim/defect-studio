import { Tabs, TabsProps } from 'antd';
import MemberImageUsage from '@components/tokens/statistics/member/ImageUsage/MemberImageUsage';
import MemberToolUsage from '@components/tokens/statistics/member/ToolUsage/MemberToolUsage';
import MemberModelUsage from '@components/tokens/statistics/member/ModelUsage/MemberModelUsage';
import MemberTokenUsage from '../statistics/member/TokenUsage/MemberTokenUsage';

interface PersonStatisticSectionProps {
  member_id: number;
}

const PersonStatisticSection = ({ member_id }: PersonStatisticSectionProps) => {
  const items: TabsProps['items'] = [
    { key: 'ImageUage', label: 'ImageUage', children: <MemberImageUsage member_id={member_id} /> },
    { key: 'ToolUsage', label: 'ToolUsage', children: <MemberToolUsage member_id={member_id} /> },
    { key: 'ModelUsage', label: 'ModelUsage', children: <MemberModelUsage member_id={member_id} /> },
    { key: 'TokenUsage', label: 'TokenUsage', children: <MemberTokenUsage member_id={member_id} /> }
  ];
  return (
    <div>
      <p>Displays only information about you, regardless of department selection.</p>
      <Tabs items={items} defaultActiveKey="ImageUage" destroyInactiveTabPane={true} />
    </div>
  );
};

export default PersonStatisticSection;
