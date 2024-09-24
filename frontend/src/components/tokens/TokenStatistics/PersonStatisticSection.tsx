import MemberImageUsage from '../statistics/member/MemberImageUsage';

interface PersonStatisticSectionProps {
  member_id: number;
}

const PersonStatisticSection = ({ member_id }: PersonStatisticSectionProps) => {
  return (
    <div>
      <MemberImageUsage member_id={member_id} />
    </div>
  );
};

export default PersonStatisticSection;
