import { Progress, Button } from 'antd';

interface TrainingStatusTabProps {
  trainProgress: { name: string; progress: number }[];
}

const TrainingStatusTab = ({ trainProgress }: TrainingStatusTabProps) => {
  return (
    <div className="h-full bg-white rounded-lg p-6 shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Training Progress Overview</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {trainProgress.map((training) => (
          <div
            key={training.name}
            className="p-4 border border-gray-200 rounded-lg shadow-md dark:bg-gray-700 dark:border-none"
          >
            <p className="font-medium mb-2 dark:text-gray-300">{training.name}</p>
            <Progress percent={training.progress} />
            <Button type="default" className="mt-2 w-full dark:bg-gray-600 dark:border-none dark:text-gray-400">
              View Training Logs
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingStatusTab;
