import { DailyImageCount } from '@/types/statistics'; // Resoponse Data Type
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MeberImageUsageGraphProps {
  data: DailyImageCount[];
}

const options = {
  responsive: true, // 반응형
  interaction: {
    intersect: true // 정확한 위치에 hover 해야 데이터 표시
  },
  scales: {
    y: {
      grid: {
        display: false // y축 그리드 제거
      }
    }
  }
};

const MemberImageUsageGraph = ({ data }: MeberImageUsageGraphProps) => {
  console.log(data);
  const datasets = [
    {
      label: '이미지 사용량',
      data: data.map((item) => ({ x: item.create_date, y: item.image_quantity })),
      borderWidth: 2, // 선 두께
      tension: 0.1, // 곡선 부드러움
      backgroundColor: 'rgb(75, 192, 192)'
    }
  ];
  return (
    <div className="dark:bg-white mt-3 rounded-[10px] p-2 w-full h-full">
      <Line options={options} data={{ datasets }} />
    </div>
  );
};

export default MemberImageUsageGraph;
