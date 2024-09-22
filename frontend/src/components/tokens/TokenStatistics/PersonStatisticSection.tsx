import dayjs from 'dayjs'; // Import the 'dayjs' library
import { getPersonTokenStatistic, PersonTokenLogType } from './../../../api/statistic_person';
import { useQuery } from '@tanstack/react-query';
import { AxiosResponse } from 'axios';
import { Table } from 'antd';
interface PersonStatisticSectionProps {
  member_pk: number;
}

const startDateObject = dayjs();
const endDateObject = dayjs();
endDateObject.subtract(7, 'day');

const columns = [
  // Table 표 표시 목록
  {
    title: 'Date',
    dataIndex: 'create_date',
    key: 'create_date'
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
    key: 'quantity'
  },
  {
    title: 'Log Type',
    dataIndex: 'log_type',
    key: 'log_type'
  }
];

const PersonStatisticSection = ({ member_pk }: PersonStatisticSectionProps) => {
  const { data, isPending, isError, error } = useQuery<
    AxiosResponse<PersonTokenLogType[]>,
    Error,
    PersonTokenLogType[],
    (string | number)[]
  >({
    queryKey: ['person_token_statistic', member_pk],
    queryFn: () =>
      getPersonTokenStatistic({
        member_id: member_pk,
        start_date: startDateObject.format('YYYY-MM-DD'),
        end_date: endDateObject.format('YYYY-MM-DD'),
        use_type: 'text_to_image'
      }),
    select: (data) => data.data
  });
  return (
    <div>
      {isPending && <div>Loading...</div>}
      {isError && <div>Error: {error?.message}</div>}
      {data && (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            defaultPageSize: 5,
            showSizeChanger: true,
            pageSizeOptions: ['5', '10', '15', '20']
          }}
        />
      )}
    </div>
  );
};

export default PersonStatisticSection;
