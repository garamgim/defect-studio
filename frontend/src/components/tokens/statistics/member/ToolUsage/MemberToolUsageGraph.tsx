import { ToolFrequency } from '@/types/statistics';

interface MemberToolUsageGraphProps {
  data: ToolFrequency[];
}

const MemberToolUsageGraph = ({ data }: MemberToolUsageGraphProps) => {
  return <div>{data.length}</div>;
};

export default MemberToolUsageGraph;
