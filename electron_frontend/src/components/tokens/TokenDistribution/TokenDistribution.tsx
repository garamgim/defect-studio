import { useQuery } from "@tanstack/react-query";
import { Select } from "antd";
import { AxiosError, AxiosResponse } from "axios";
import { getAllDepartments } from "../../../api/getAllDepartment";
<Select
  showSearch
  style={{ width: 200 }}
  placeholder="Search to Select"
  optionFilterProp="label"
  filterSort={(optionA, optionB) =>
    (optionA?.label ?? "")
      .toLowerCase()
      .localeCompare((optionB?.label ?? "").toLowerCase())
  }
  options={[
    {
      value: "1",
      label: "Not Identified",
    },
    {
      value: "2",
      label: "Closed",
    },
    {
      value: "3",
      label: "Communicated",
    },
    {
      value: "4",
      label: "Identified",
    },
    {
      value: "5",
      label: "Resolved",
    },
    {
      value: "6",
      label: "Cancelled",
    },
  ]}
/>;

type departmentType = {
  department_id: number;
  department_name: string;
};

type SelectOptionType = {
  value: number;
  label: string;
};

const TokenDistribution = () => {
  const { data, isError, error, isLoading } = useQuery<
    AxiosResponse<departmentType[]>,
    AxiosError,
    SelectOptionType[],
    string[]
  >({
    queryKey: ["departments"],
    queryFn: getAllDepartments,
    select: (response) =>
      response.data.map((department) => {
        return {
          value: department.department_id,
          label: department.department_name,
        };
      }),
  });

  return (
    <div className="flex flex-col justify-center align-middle">
      {/* 부서 선택 */}
      <section className="flex flex-col">
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error?.message || "Try again Later"}</div>}
        {data && (
          <Select
            className="align-middle"
            showSearch
            style={{ width: "100%" }}
            placeholder="Search to Select Department"
            optionFilterProp="label"
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            options={[...data]}
          />
        )}
      </section>
    </div>
  );
};

export default TokenDistribution;
