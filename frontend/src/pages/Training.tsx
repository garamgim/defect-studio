import { useState, useEffect } from "react";
import { Tabs } from "antd";
import TrainingStatus from "../components/training/TrainingStatus";
import TrainingForm from "../components/training/TrainingForm";

const Training = () => {
  const [activeTab, setActiveTab] = useState("1");
  const [trainingTasks, setTrainingTasks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchTrainingTasks = async () => {
    setIsLoading(true);
    const tasks = [
      { id: 1, name: "Model 1", progress: 75 },
      { id: 2, name: "Model 2", progress: 45 },
      { id: 3, name: "Model 3", progress: 100 },
    ];
    setTrainingTasks(tasks);
    setIsLoading(false);
  };

  useEffect(() => {
    if (activeTab === "2") {
      fetchTrainingTasks();
    }
  }, [activeTab]);

  const tabsItems = [
    {
      key: "1",
      label: "Start Training",
      children: <TrainingForm />,
    },
    {
      key: "2",
      label: "Training Status",
      children: (
        <TrainingStatus isLoading={isLoading} trainingTasks={trainingTasks} />
      ),
    },
  ];

  return (
    <div className="flex justify-center items-center h-[calc(100vh-60px)] bg-gray-100 p-4 overflow-hidden dark:bg-gray-800">
      <div className="w-full max-w-5xl bg-white py-10 px-12 rounded-[20px] mx-auto border border-gray-300 shadow-md h-full overflow-y-auto custom-scrollbar dark:bg-gray-600 dark:border-none">
        <h1 className="text-[20px] font-bold mb-2 dark:text-gray-300">
          Stable Diffusion Training
        </h1>
        <Tabs
          activeKey={activeTab}
          onChange={(key) => setActiveTab(key)}
          items={tabsItems}
        />
      </div>
    </div>
  );
};

export default Training;
