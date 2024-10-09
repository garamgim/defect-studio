import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getImgsList, deleteImgsFolder } from '../api/history';
import { FolderListDataType } from '../types/history';
import SearchFilter from '../components/history/SearchFilter';
import ImageFolderList from '../components/history/ImageFolderList';
import ImagesFolderDetail from '../components/history/ImageFolderDetail';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import { message } from 'antd';
import Loading from '../components/common/LoadingIndicator';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const History = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchDates, setSearchDates] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [folders, setFolders] = useState<FolderListDataType[]>([]);

  const queryClient = useQueryClient();

  // 이미지 목록 조회
  const { data, isLoading, error } = useQuery({
    queryKey: ['imageFolders'],
    queryFn: getImgsList
  });

  useEffect(() => {
    if (error) {
      message.error(`Error loading the image folder list: ${error.message}`);
    }
  }, [error]);

  // 폴더 삭제 mutation
  const { mutate: deleteFolder } = useMutation({
    mutationFn: deleteImgsFolder,
    onSuccess: () => {
      message.success('Folder deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['imageFolders'] });
    },
    onError: () => {
      message.error('Failed to delete folder');
    }
  });

  // useEffect로 데이터를 상태로 업데이트
  useEffect(() => {
    if (data) {
      setFolders(data.logs.reverse()); // 가져온 데이터를 상태에 저장
    }
  }, [data]);

  const handleModalClose = () => setSelectedFolderId(null);

  const handleDetailClick = (folder: FolderListDataType) => {
    setSelectedFolderId(folder.id);
  };

  const handleDelete = (id: string) => {
    deleteFolder(id);
  };

  if (isLoading) return <Loading />;

  // 필터링된 폴더 목록
  const filteredFolders = folders.filter((folder: FolderListDataType) => {
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
    <div className="flex flex-col items-start h-[calc(100vh-60px)] bg-gray-100 p-8  overflow-auto dark:bg-gray-800">
      <SearchFilter
        searchId={searchId}
        setSearchId={setSearchId}
        searchPrompt={searchPrompt}
        setSearchPrompt={setSearchPrompt}
        searchDates={searchDates}
        setSearchDates={setSearchDates}
      />

      <ImageFolderList folders={filteredFolders} handleDetailClick={handleDetailClick} handleDelete={handleDelete} />

      <ImagesFolderDetail folderId={selectedFolderId} onClose={handleModalClose} />
    </div>
  );
};

export default History;
