interface DepartmentPersonStatisticsProps {
  departmentId: number;
}

const DepartmentPersonStatistics = ({ departmentId }: DepartmentPersonStatisticsProps) => {
  return <div>{departmentId}</div>;
};

export default DepartmentPersonStatistics;
