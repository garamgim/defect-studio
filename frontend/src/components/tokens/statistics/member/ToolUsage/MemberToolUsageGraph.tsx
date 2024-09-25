import { ToolFrequency } from '@/types/statistics';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement);

interface MemberToolUsageGraphProps {
  data: ToolFrequency[];
}

const options = {
  responsive: true, // 반응형
  interaction: {
    intersect: true // 정확한 위치에 hover 해야 데이터 표시
  },
  scales: {
    x: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Use Type' // x축 제목
      }
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: 'Usage', // y축 제목
        ticks: {
          stepSize: 1 // y축 단위를 1로 설정
        }
      }
    }
  }
};

const MemberToolUsageGraph = ({ data }: MemberToolUsageGraphProps) => {
  const labels = data.map((item) => item.use_type);
  const usageData = data.map((item) => item.usage);

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Usage',
        data: usageData,
        borderWidth: 2,
        tension: 0.1,
        backgroundColor: 'rgb(75, 192, 192)'
      }
    ]
  };

  return (
    <div className="dark:bg-white mt-3 rounded-[10px] p-2 w-full h-full">
      <Bar options={options} data={chartData} />
    </div>
  );
};

export default MemberToolUsageGraph;
