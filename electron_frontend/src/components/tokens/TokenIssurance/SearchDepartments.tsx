import "./SearchDepartments.css";
import { useQuery } from "@tanstack/react-query";
import { Input } from "antd";
import { useEffect, useState } from "react";
import { getAllDepartments } from "./../../../util/getAllDepartment";

type departmentType = {
  department_id: number;
  department_name: string;
};

const SearchDepartments = () => {
  const [searchDepartmentName, setSearchDepartmentName] = useState("");
  const { data, isPending, isError, error } = useQuery({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
  });
  useEffect(() => {}, []);

  return (
    <section className="token-issurance-department-container">
      <div>
        <p className="">
          Please select the departments you wish to grant the token to
        </p>
        <Input
          onChange={(e) => setSearchDepartmentName(e.target.value)}
          className="h-[40px] mt-2"
        />
      </div>

      <div className="">
        {isPending && <p>Loading...</p>}
        {isError && <p>{error.message}</p>}
        {data && <p>"HI"</p>}
      </div>
    </section>
  );
};

export default SearchDepartments;
