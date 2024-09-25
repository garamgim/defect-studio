import { Button, Progress } from 'antd';

interface Training {
  name: string;
  progress: number;
}

interface CurrentTrainingsProps {
  trainProgress: Training[];
  handleStopTraining: (modelName: string) => void;
}

const CurrentTrainings = ({ trainProgress, handleStopTraining }: CurrentTrainingsProps) => {
  return (
    <div className="h-full bg-white rounded-lg p-4 shadow-lg border border-gray-300 dark:bg-gray-600 dark:border-none">
      <h3 className="text-lg font-bold mb-4 dark:text-gray-300">Current Trainings</h3>
      {trainProgress.map((training) => (
        <div key={training.name} className="mb-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-medium">{training.name}</p>
              <Progress percent={training.progress} />
            </div>
            <Button type="link" danger onClick={() => handleStopTraining(training.name)}>
              Stop
            </Button>
          </div>
          <Button type="default" className="mt-2 w-full dark:bg-gray-500 dark:border-none dark:text-gray-300">
            View Details
          </Button>
        </div>
      ))}
    </div>
  );
};

export default CurrentTrainings;