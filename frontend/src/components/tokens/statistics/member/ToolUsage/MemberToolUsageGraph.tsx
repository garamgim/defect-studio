import { ToolFrequency } from '@/types/statistics';
import { Chart as ChartJS, ArcElement, Title, Tooltip, Legend, ChartOptions, Plugin } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { backgroundColorList } from '@components/tokens/statistics/common/constance';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface MemberToolUsageGraphProps {
  data: ToolFrequency[];
}

const options: ChartOptions<'doughnut'> = {
  responsive: true, // 반응형
  interaction: {
    intersect: true // 정확한 위치에 hover 해야 데이터 표시
  },
  scales: {
    x: {
      display: false, // x축 자체를 표시하지 않음
      grid: {
        display: false // x축 grid 표시 안 함
      }
    },
    y: {
      beginAtZero: true, // y축 0부터 시작
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

export default MemberToolUsageGraph;
