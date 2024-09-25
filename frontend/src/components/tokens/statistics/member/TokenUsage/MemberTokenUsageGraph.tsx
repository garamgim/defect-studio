import { TokenUsage, UseType } from '@/types/statistics'; // Response Type

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
import { backgroundColorList } from '../../common/constance';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MemberTokenUsageGraphProps {
  data: TokenUsage[];
}

const options = {
  spanGaps: true, // null 데이터가 있어도 선을 연결
  responsive: true, // 반응형
  grouped: true, // x축 값이 같은 것끼리 묶일지의 여부.
  interaction: {
    intersect: true // 정확한 위치에 hover 해야 데이터 표시
  },
  scales: {
    y: {
      grid: {
        display: false // y축 그리드 제거
      }
    }
  },
  elements: {
    line: {
      spanGaps: true // null 데이터가 있어도 선을 연결
    }
  }
};

const labels: UseType[] = ['text_to_image', 'image_to_image', 'inpainting', 'remove_background', 'clean_up', 'clip'];

const MemberTokenUsageGraph = ({ data }: MemberTokenUsageGraphProps) => {
  const chartData = {
    datasets: labels.map((label, index) => ({
      label: label, // 데이터셋의 라벨을 추가하여 각 사용 유형을 구분
      data: data
        .filter((item) => item.use_type === label)
        .map((item) => ({
          x: item.usage_date,
          y: item.token_quantity
        })),
      borderWidth: 2,
      tension: 0.1,
      backgroundColor: backgroundColorList[index],
      fill: false
    }))
  };
  return (
    <div className="dark:bg-white mt-3 rounded-[10px] p-2 w-full h-full">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default MemberTokenUsageGraph;
