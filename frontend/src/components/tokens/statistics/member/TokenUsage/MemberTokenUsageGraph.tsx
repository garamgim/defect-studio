import { TokenUsage, UseType } from '@/types/statistics'; // Response Type
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  TimeScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import { backgroundColorList } from '../../common/constance';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

interface MemberTokenUsageGraphProps {
  data: TokenUsage[];
}

const options: ChartOptions<'line'> = {
  spanGaps: true, // null 데이터가 있어도 선을 연결
  responsive: true, // 반응형
  interaction: {
    intersect: false // 정확한 위치에 hover 해야 데이터 표시
  },
  scales: {
    y: {
      grid: {
        display: false // y축 그리드 제거
      },
      title: {
        display: true,
        color: 'black',
        text: 'Tokens',
        font: {
          size: 12,
          family: 'GmarketSansMedium'
        }
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

const labels: UseType[] = [
  'text_to_image',
  'image_to_image',
  'inpainting',
  'remove_background',
  'clean_up',
  'clip',
  'Total'
];

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
    <div className="dark:bg-white mt-3 rounded-[10px] p-2 w-full h-[400px] flex flex-row justify-center">
      <Line options={options} data={chartData} />
    </div>
  );
};

export default MemberTokenUsageGraph;
