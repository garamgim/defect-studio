import { ToolFrequency } from '@/types/statistics'; // Type
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, ChartOptions, Plugin } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { backgroundColorList } from '../../common/constance';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

const options: ChartOptions<'doughnut'> = {
  responsive: true, // 반응형
  interaction: {
    intersect: false // 정확한 위치에 hover 해야 데이터 표시
  },
  scales: {
    x: {
      display: false, // x축 자체를 표시하지 않음
      grid: {
        display: false // x축 grid 표시 안 함
      }
    },
    y: {
      display: false, // y축 자체를 표시하지 않음
      grid: {
        display: false // y축 grid 표시 안 함
      }
    }
  },
  plugins: {
    datalabels: {
      align: 'center',
      anchor: 'center',
      color: 'black',
      font: {
        size: 14,
        weight: 'bold',
        family: 'GmarketSansMedium'
      },
      formatter: (value) => {
        return `${value}`;
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
      }
    }
  }
};

interface DepartmentToolUsageGraphProps {
  data: ToolFrequency[];
}

const DepartmentToolUsageGraph = ({ data }: DepartmentToolUsageGraphProps) => {
  const memberName = data.map((item) => item.use_type);
  const usageData = data.map((item) => item.usage);

  const chartData = {
    labels: memberName,
    datasets: [
      {
        label: 'Image Usage',
        data: usageData,
        borderWidth: 2,
        tension: 0.1,
        backgroundColor: backgroundColorList
      }
    ]
  };
  return (
    <div className="dark:bg-white mt-3 rounded-[10px] p-2 w-full h-[400px] flex flex-row justify-center">
      <Doughnut options={options} data={chartData} plugins={[ChartDataLabels as Plugin<'doughnut'>]} />
    </div>
  );
};

export default DepartmentToolUsageGraph;
