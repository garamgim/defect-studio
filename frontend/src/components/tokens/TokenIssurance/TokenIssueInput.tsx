import './TokenIssueInput.css';
import { DatePicker, InputNumber } from 'antd';
import dayjs from 'dayjs';

type PropsType = {
  quantity: number;
  setQuantity: (quantity: number) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
};

const disabledDate = (current: dayjs.Dayjs) => {
  // 과거 날짜는 선택할 수 없도록 함 (오늘 포함)
  return current && current < dayjs().startOf('day');
};

const TokenIssueInput = ({ quantity, setQuantity, endDate, setEndDate }: PropsType) => {
  const handleQuantityChange = (value: string | number | null | undefined) => {
    const reg = /^[1-9]\d*$/;
    if (!value) setQuantity(0);
    else if (reg.test(value.toString())) {
      setQuantity(Number(value));
    }
  };
  return (
    <div className="flex flex-col p-[20px] mt-[20px] border-2 border-gray-300 rounded-lg w-full h-[360px] text-[222222] dark:text-white font-samsung;">
      <p className="text-[20px] font-bold">Token Issue</p>

      <div>
        <p className="mt-4 text-[18px]">Specify the amount of tokens to be issued to the respective department</p>
        <InputNumber
          value={quantity}
          onChange={handleQuantityChange}
          className="h-[40px] w-full mt-2 dark:bg-gray-700 dark:text-white bg-gray-100 font-samsung border-none"
        />
      </div>

      <div>
        <p className="mt-4 text-[18px]">Enter the token Expiration Date</p>
        <DatePicker
          inputReadOnly
          onChange={(date) => setEndDate(dayjs(date).format('YYYY-MM-DD'))}
          value={dayjs(endDate)}
          className="h-[40px] w-full mt-2 dark:bg-gray-700 dark:text-white bg-gray-100 font-samsung border-none"
          defaultValue={dayjs(new Date())}
          disabledDate={disabledDate}
        />
      </div>
    </div>
  );
};

export default TokenIssueInput;
