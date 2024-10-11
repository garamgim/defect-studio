import { DailyImageCount } from '@/types/statistics'; // Resoponse Data Type
import ChartDataLabels from 'chartjs-plugin-datalabels';
import dayjs from 'dayjs';
import {
  Chart as ChartJS,
  CategoryScale,
  TimeScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions,
  Plugin
} from 'chart.js';
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, TimeScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface MeberImageUsageGraphProps {
  data: DailyImageCount[];
}

const options: ChartOptions<'line'> = {
  responsive: true, // 반응형
  interaction: {
    intersect: false // 정확한 위치에 hover 해야 데이터 표시
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        display: false // y축 그리드 제거
      },
      title: {
        display: true,
        color: 'black',
        text: 'Image Usage',
        font: {
          size: 12,
          family: 'GmarketSansMedium'
        }
      }
    },
    x: {
      type: 'time',
      time: {
        unit: 'day'
      },
      title: {
        display: true,
        text: 'Date'
      }
    }
  },
  plugins: {
    datalabels: {
      align: 'top',
      anchor: 'center',
      color: 'black',
      font: {
        size: 14,
        weight: 'bold',
        family: 'GmarketSansMedium'
      },
      formatter: (value) => {
        return `${value.y}`;
      }
    },
    tooltip: {
      // 툴팁 설정
      bodyFont: {
        size: 12, // 폰트 크기
        family: 'Arial', // 폰트 패밀리
        weight: 'bold' // 폰트 두께
      },
      titleFont: {
        size: 14, // 타이틀 폰트 크기
        family: 'Arial', // 타이틀 폰트 패밀리
        weight: 'bold' // 타이틀 폰트 두께
      },
      footerFont: {
        size: 12, // 푸터 폰트 크기
        family: 'Arial', // 푸터 폰트 패밀리
        weight: 'normal' // 푸터 폰트 두께
      },
      callbacks: {
        title: function (tooltipItems) {
          // 타이틀 사용자 정의
          return `${dayjs(tooltipItems[0].parsed.x).format('YYYY-MM-DD')}`;
        },
        label: (context) => {
          return `${context.dataset.label}: ${context.parsed.y}`;
        }
      }
    }
  }
};

const MemberImageUsageGraph = ({ data }: MeberImageUsageGraphProps) => {
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
    <div className="dark:bg-white mt-3 rounded-[10px] p-2 w-full h-[400px] flex flex-row justify-center">
      <Line options={options} data={{ datasets }} plugins={[ChartDataLabels as Plugin<'line'>]} />
    </div>
  );
};

export default MemberImageUsageGraph;
