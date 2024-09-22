import { Progress, Button } from 'antd';

interface TrainingStatusTabProps {
  trainProgress: { name: string; progress: number }[];
}

const TrainingStatusTab = ({ trainProgress }: TrainingStatusTabProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-lg border border-gray-300 hidden md:block">
      <h3 className="text-lg font-bold mb-4">Training Progress Overview</h3>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {trainProgress.map((training) => (
          <div key={training.name} className="p-4 border border-gray-200 rounded-lg shadow-md">
            <p className="font-medium mb-2">{training.name}</p>
            <Progress percent={training.progress} />
            <Button type="default" className="mt-2 w-full">
              View Training Logs
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrainingStatusTab;
