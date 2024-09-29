import { useState } from 'react';
import { Button, Input, DatePicker, Modal } from 'antd';
import { DownloadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useQuery } from '@tanstack/react-query';
import moment from 'moment';
import { getImgsList } from '../api/history';
import { FolderDataType } from '../types/history';

const { RangePicker } = DatePicker;

const History = () => {
  const [searchPrompt, setSearchPrompt] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchDates, setSearchDates] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);

  const {
    data: imageFolders,
    isLoading,
    error
  } = useQuery({
    queryKey: ['imageFolders'],
    queryFn: getImgsList
  });

  const handleModalClose = () => {
    setSelectedFolder(null);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading data</div>;
  }

  // Filter folders based on search criteria
  const filteredFolders = imageFolders.logs.filter((folder: FolderDataType) => {
    console.log(folder);
    const matchesPrompt = folder.prompt?.toLowerCase().includes(searchPrompt.toLowerCase());
    const matchesId = folder.id.toLowerCase().includes(searchId.toLowerCase());
    const matchesDate =
      searchDates.length === 0 ||
      (moment(folder.date).isSameOrAfter(searchDates[0], 'day') &&
        moment(folder.date).isSameOrBefore(searchDates[1], 'day'));

    return matchesPrompt && matchesId && matchesDate;
  });

  return (
    <div className="flex flex-col items-start h-[calc(100vh-60px)] bg-gray-100 p-8 overflow-auto dark:bg-gray-800">
      {/* 검색 필터 */}
      <div className="flex flex-col w-full mb-6 space-y-4">
        <div className="flex flex-col md:flex-row items-center w-full space-y-4 md:space-y-0 md:space-x-4">
          {/* Search by ID */}
          <div className="flex-grow md:basis-1/3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search by ID</label>
            <Input
              placeholder="Enter Folder ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md"
            />
          </div>

          {/* Search by Prompt */}
          <div className="flex-grow md:basis-1/3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search by Prompt</label>
            <Input
              placeholder="Enter prompt (e.g., 'cat', 'sunset')"
              value={searchPrompt}
              onChange={(e) => setSearchPrompt(e.target.value)}
              className="w-full border border-gray-300 dark:border-gray-600 p-2 rounded-md"
            />
          </div>

          {/* Date Range */}
          <div className="flex-grow md:basis-1/3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date Range</label>
            <RangePicker
              value={searchDates}
              onChange={(dates) => setSearchDates(dates)}
              className="w-full p-2 rounded-md dark:bg-gray-700 dark:text-gray-300 dark:border-none"
              placeholder={['Start Date', 'End Date']}
            />
          </div>
        </div>
      </div>

      {/* 이미지 폴더 리스트 */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full">
        {filteredFolders.map((folder) => (
          <div
            key={folder.id}
            className="relative bg-white rounded-lg shadow-lg p-2 flex flex-col justify-between dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 h-[140px]"
          >
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">ID: {folder.id}</h3>
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {moment(folder.date).format('YYYY-MM-DD')}
                </span>
              </div>

              {/* 이미지 장수 */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                Images: {folder.num_of_generated_images}
              </div>

              {/* 최대 2줄까지 프롬프트 표시 */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{folder.prompt || 'N/A'}</p>
            </div>

            {/* Detail, Download, Delete 버튼 */}
            <div className="flex justify-end gap-2">
              <Button
                type="default"
                size="small"
                icon={<EyeOutlined />}
                className="text-xs xl:flex hidden"
                onClick={() => handleDetailClick(folder)}
              >
                Detail
              </Button>
              <Button
                type="default"
                size="small"
                icon={<EyeOutlined />}
                className="text-xs xl:hidden"
                onClick={() => handleDetailClick(folder)}
              />

              <Button
                type="primary"
                size="small"
                icon={<DownloadOutlined />}
                className="text-xs xl:flex hidden"
                onClick={() => handleDownload(folder.id)}
              >
                Download
              </Button>
              <Button
                type="primary"
                size="small"
                icon={<DownloadOutlined />}
                className="text-xs xl:hidden"
                onClick={() => handleDownload(folder.id)}
              />

              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                className="text-xs xl:flex hidden"
                onClick={() => handleDelete(folder.id)}
              >
                Delete
              </Button>
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                className="text-xs xl:hidden"
                onClick={() => handleDelete(folder.id)}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Detail 모달 */}
      <Modal title="Folder Details" open={selectedFolder !== null} onCancel={handleModalClose} footer={null}>
        {selectedFolder && <div></div>}
      </Modal>
    </div>
  );
};

export default History;
