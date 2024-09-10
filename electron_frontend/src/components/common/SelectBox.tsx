import { Select, Form } from "antd";

interface SelectBoxProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  label: string;
  labelFontWeight?: string;
}

const SelectBox = ({
  value,
  onChange,
  options,
  label,
  labelFontWeight = "font-semibold",
}: SelectBoxProps) => {
  return (
    <div className="mb-5">
      <Form.Item
        label={
          <span className={`text-[14px] ${labelFontWeight} text-[#222]`}>
            {label}
          </span>
        }
      >
        <Select
          value={value}
          onChange={onChange}
          options={options}
          className="w-full"
          placeholder="Select an option"
        />
      </Form.Item>
    </div>
  );
};

export default SelectBox;
