import { ModelFrequency } from '@/types/statistics'; // Response Type

interface MemberModelUsageGraphProps {
  data: ModelFrequency[];
}

const MemberModelUsageGraph = ({ data }: MemberModelUsageGraphProps) => {
  return <div>{data.length}</div>;
};

export default MemberModelUsageGraph;
