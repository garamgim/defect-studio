import { useEffect, useState } from 'react';
import { Button, Input, DatePicker, message, Modal } from 'antd';
import { DownloadOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'tailwindcss/tailwind.css';

const { RangePicker } = DatePicker;

const dummyFolders = [
  {
    id: 'folder1',
    type: 'text_to_image',
    date: '2024-09-26',
    prompt: 'A beautiful sunset over the mountains',
    firstImageUrl: 'https://via.placeholder.com/150',
    count: 10
  },
  {
    id: 'folder2',
    type: 'image_to_image',
    date: '2024-09-25',
    prompt:
      'A futuristic city skyline that stretches endlessly towards the horizon with tall buildings and bright neon lights illuminating the night sky.',
    firstImageUrl: 'https://via.placeholder.com/150',
    count: 8
  },
  {
    id: 'folder3',
    type: 'inpainting',
    date: '2024-09-24',
    prompt:
      'A portrait of a person with abstract background and intricate details in the clothing and facial expressions, showing a range of emotions.',
    firstImageUrl: 'https://via.placeholder.com/150',
    count: 5
  },
  {
    id: 'folder4',
    type: 'text_to_image',
    date: '2024-09-23',
    prompt:
      'A really long prompt that describes an incredibly detailed and complex scene with various elements interacting together, including people, buildings, and the environment. This scene could depict a bustling city street with pedestrians, cars, tall skyscrapers, and trees lining the sidewalks. The sky is bright blue with clouds scattered across, and the atmosphere is lively with various activities going on.',
    firstImageUrl: 'https://via.placeholder.com/150',
    count: 15
  }
];

const History = () => {
  const [imageFolders, setImageFolders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchPrompt, setSearchPrompt] = useState('');
  const [searchId, setSearchId] = useState('');
  const [searchDates, setSearchDates] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null); // 모달에서 선택된 폴더

  // 더미 데이터 로드
  const fetchImageFolders = async () => {
    try {
      setTimeout(() => {
        setImageFolders(dummyFolders);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      message.error('Failed to load image folders.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchImageFolders();
  }, []);

  const handleDownload = (id) => {
    console.log(`Download folder with ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete folder with ID: ${id}`);
  };

  const handleDetailClick = (folder) => {
    setSelectedFolder(folder); // 모달에 선택된 폴더 정보 설정
  };

  const handleModalClose = () => {
    setSelectedFolder(null); // 모달 닫기
  };

  // 검색어와 날짜로 필터링
  const filteredFolders = imageFolders.filter((folder) => {
    const matchesPrompt = folder.prompt.toLowerCase().includes(searchPrompt.toLowerCase());
    const matchesId = folder.id.toLowerCase().includes(searchId.toLowerCase());

    const matchesDate =
      searchDates.length === 0 ||
      (moment(folder.date).isSameOrAfter(searchDates[0], 'day') &&
        moment(folder.date).isSameOrBefore(searchDates[1], 'day'));

    return matchesPrompt && matchesId && matchesDate;
  });

  if (isLoading) {
    return <div>로딩중</div>;
  }

  return (
    <div className="flex flex-col items-start h-[calc(100vh-60px)] bg-gray-100 p-8 overflow-auto dark:bg-gray-800">
      {/* 검색 필터 */}
      <div className="flex flex-col w-full mb-6 space-y-4">
        <div className="flex flex-col md:flex-row items-center justify-between w-full">
          <div className="flex space-x-4 w-full md:w-2/3">
            <Input
              placeholder="Search by ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Search by prompt"
              value={searchPrompt}
              onChange={(e) => setSearchPrompt(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex w-full md:w-1/3 justify-end">
            <RangePicker
              value={searchDates}
              onChange={(dates) => setSearchDates(dates)}
              className="w-full"
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
                <span className="text-xs text-gray-500 dark:text-gray-400">{folder.date}</span>
              </div>

              {/* 이미지 장수 */}
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Images: {folder.count}</div>

              {/* 최대 2줄까지 프롬프트 표시 */}
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">Prompt: {folder.prompt}</p>
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
