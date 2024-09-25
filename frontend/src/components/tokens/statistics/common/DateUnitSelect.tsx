import { Select } from 'antd';

interface DateUnitSelectProps {
  dateUnit: 'day' | 'month';
  setDateUnit: (value: 'day' | 'month') => void;
}

const DateUnitSelect = ({ dateUnit, setDateUnit }: DateUnitSelectProps) => {
  return (
    <section className="flex flex-row  align-middle items-center">
      <p className="font-bold me-3">Date Unit :</p>
      <Select value={dateUnit} onChange={(value) => setDateUnit(value)}>
        <Select.Option value="day">Daily</Select.Option>
        <Select.Option value="month">Monthly</Select.Option>
      </Select>
    </section>
  );
};

export default DateUnitSelect;
