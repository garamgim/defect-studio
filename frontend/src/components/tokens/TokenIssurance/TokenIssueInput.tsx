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
    <div className="token-issurance-input-container">
      <p className="title">Token Issue</p>

      <div>
        <p className="sub-title">Specify the amount of tokens to be issued to the respective department</p>
        <InputNumber value={quantity} onChange={handleQuantityChange} className="input-number-container" />
      </div>

      <div>
        <p className="sub-title">Enter the token Expiration Date</p>
        <DatePicker
          inputReadOnly
          onChange={(date) => setEndDate(dayjs(date).format('YYYY-MM-DD'))}
          value={dayjs(endDate)}
          className="input-number-container"
          defaultValue={dayjs(new Date())}
          disabledDate={disabledDate}
        />
      </div>
    </div>
  );
};

export default TokenIssueInput;
