import { Tabs, TabsProps } from 'antd';
import { lazy, Suspense } from 'react';
const MemberImageUsage = lazy(() => import('@components/tokens/statistics/member/ImageUsage/MemberImageUsage'));
const MemberToolUsage = lazy(() => import('@components/tokens/statistics/member/ToolUsage/MemberToolUsage'));
const MemberModelUsage = lazy(() => import('@components/tokens/statistics/member/ModelUsage/MemberModelUsage'));
const MemberTokenUsage = lazy(() => import('../statistics/member/TokenUsage/MemberTokenUsage'));

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
      <Suspense fallback={<div>Loading...</div>}>
        <Tabs items={items} defaultActiveKey="ImageUage" />
      </Suspense>
    </div>
  );
};

export default PersonStatisticSection;
