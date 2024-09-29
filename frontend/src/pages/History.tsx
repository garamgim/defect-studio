import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getImgsList } from '../api/history';
import { FolderDataType } from '../types/history';
import SearchFilter from '../components/history/SearchFilter';
import ImageFolderList from '../components/history/ImageFolderList';
import ImagesFolderDetail from '../components/history/ImageFolderDetail';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const History = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchDates, setSearchDates] = useState<[Dayjs | null, Dayjs | null] | null>(null); // Dayjs[]로 설정
  const [selectedFolder, setSelectedFolder] = useState<FolderDataType | null>(null);

  const {
    data: imageFolders,
    isLoading,
    error
  } = useQuery({
    queryKey: ['imageFolders'],
    queryFn: getImgsList
  });

  const handleModalClose = () => setSelectedFolder(null);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  const filteredFolders = imageFolders.logs.filter((folder: FolderDataType) => {
    const matchesPrompt = folder.prompt?.toLowerCase().includes(searchPrompt.toLowerCase());
    const matchesId = folder.id.toLowerCase().includes(searchId.toLowerCase());
    const matchesDate =
      searchDates === null ||
      (searchDates[0] &&
        dayjs(folder.date).isSameOrAfter(searchDates[0], 'day') &&
        searchDates[1] &&
        dayjs(folder.date).isSameOrBefore(searchDates[1], 'day'));

    return matchesPrompt && matchesId && matchesDate;
  });

  return (
    <div className="flex flex-col items-start h-[calc(100vh-60px)] bg-gray-100 p-8 overflow-auto dark:bg-gray-800">
      <SearchFilter
        searchId={searchId}
        setSearchId={setSearchId}
        searchPrompt={searchPrompt}
        setSearchPrompt={setSearchPrompt}
        searchDates={searchDates}
        setSearchDates={setSearchDates}
      />

      <ImageFolderList
        folders={filteredFolders}
        handleDetailClick={setSelectedFolder}
        handleDownload={(id) => console.log(`Downloading ${id}`)}
        handleDelete={(id) => console.log(`Deleting ${id}`)}
      />

      <ImagesFolderDetail folder={selectedFolder} onClose={handleModalClose} />
    </div>
  );
};

export default History;
