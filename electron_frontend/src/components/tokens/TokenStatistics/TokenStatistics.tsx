import TokenStatisticsHeader from './TokenStatisticsHeader';

interface searchType {
  category: 'department' | 'person';
  value: string | null;
}

const TokenStatistics = () => {
  return (
    <section className="flex flex-col justify-center align-middle">
      <TokenStatisticsHeader />
    </section>
  );
};

export default TokenStatistics;
