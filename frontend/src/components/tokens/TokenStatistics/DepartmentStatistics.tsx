interface DepartmentStatisticsProps {
  department_id: number;
}

const DepartmentStatistics = ({ department_id }: DepartmentStatisticsProps) => {
  return <div>{department_id}</div>;
};

export default DepartmentStatistics;
