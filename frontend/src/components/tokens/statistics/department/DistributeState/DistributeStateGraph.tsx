import { TokenDistribution } from '@/types/statistics'; // Response Type
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  TimeScale,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, TimeScale, PointElement, LineElement, Title, Tooltip, Legend);

interface DistributeStateGraphProps {
  data: TokenDistribution[];
}

const options: ChartOptions<'line'> = {
  spanGaps: true, // null 데이터가 있어도 선을 연결
  responsive: true, // 반응형
  interaction: {
    intersect: true // 정확한 위치에 hover 해야 데이터 표시
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false // y축 그리드 제거
      }
    },
    x: {
      type: 'time' as const, // 시간으로 고정
      time: {
        unit: 'day' // 단위
      },
      title: {
        // 제목
        display: true,
        text: 'Date'
      }
    }
  }
};

const DistributeStateGraph = ({ data }: DistributeStateGraphProps) => {
  const chartDataSets = [
    {
      label: 'Token Distribution',
      data: data.map((d) => ({ x: d.distribute_date, y: d.token_quantity })),
      borderColor: 'rgba(75, 192, 192, 1)',
      fill: false
    }
  ];
  return (
    <div className="dark:bg-white mt-3 rounded-[10px] p-2 w-full h-full">
      <Line options={options} data={{ datasets: chartDataSets }} />
    </div>
  );
};

export default DistributeStateGraph;
