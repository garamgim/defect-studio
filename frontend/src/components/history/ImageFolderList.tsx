import { Button } from 'antd';
import { DownloadOutlined, DeleteOutlined, FileZipOutlined } from '@ant-design/icons';
import { FaRegBookmark, FaBookmark } from 'react-icons/fa';
import moment from 'moment';
import { FolderListDataType } from '../../types/history';
import { RootState } from '../../store/store';
import { useSelector, useDispatch } from 'react-redux';
import { setFolder } from '../../store/slices/history/historySlice';
import { getImgsDetail } from '../../api/history';
import { message } from 'antd';

interface ImageFolderListProps {
  folders: FolderListDataType[];
  handleDetailClick: (folder: FolderListDataType) => void;
  handleDelete: (id: string) => void;
}

const ImageFolderList: React.FC<ImageFolderListProps> = ({ folders, handleDetailClick, handleDelete }) => {
  const dispatch = useDispatch();
  const bookmarks = useSelector((state: RootState) => state.history.folders);

  const handleBookmarkClick = (
    id: string,
    type: 'text_to_image' | 'image_to_image' | 'inpainting' | 'remove_background' | 'cleanup',
    prompt: string | null,
    firstImg: string
  ) => {
    dispatch(setFolder({ id, type, prompt, firstImg }));
  };

  const handleDownload = async (folderId: string, isZipDownload: boolean = false) => {
    try {
      // 1. API 호출로 이미지 배열 가져오기
      const folderDetails = await getImgsDetail(folderId);
      const imageUrls = folderDetails.image_url_list;

      // 2. Electron을 통해 폴더 선택 다이얼로그 열기
      const folderPath = await window.electron.selectFolder();
      if (!folderPath) {
        message.error('No folder selected.');
        return;
      }

      // 3. 선택한 폴더에 이미지 저장 또는 ZIP 파일로 저장
      const format = 'jpeg'; // settings에서 default 설정 추가
      const result = await window.electron.saveImgsWithZip(imageUrls, folderPath, format, isZipDownload);

      if (result.success) {
        message.success(isZipDownload ? 'ZIP file saved successfully!' : 'Images saved successfully!');
      } else {
        message.error(`Failed to save ${isZipDownload ? 'ZIP file' : 'images'}: ${result.error}`);
      }
    } catch (error) {
      message.error(
        `Error downloading ${isZipDownload ? 'ZIP file' : 'images'}: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 w-full">
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="relative bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between dark:bg-gray-700 border border-gray-300 dark:border-none hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 h-[180px]"
        >
          <div className="cursor-pointer" onClick={() => handleDetailClick(folder)}>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[14px] font-semibold text-gray-700 dark:text-gray-300">ID: {folder.id}</h3>

              <div
                onClick={(e) => {
                  e.stopPropagation(); // 부모 클릭이벤트 상속 안받음
                  handleBookmarkClick(folder.id, folder.generation_type, folder.prompt, folder.first_image_url);
                }}
              >
                {bookmarks.some((bookmarkedFolder) => bookmarkedFolder.id === folder.id) ? (
                  <FaBookmark className="text-[18px] text-gray-700 hover:text-black dark:hover:text-white dark:text-gray-400 transition-transform transform hover:scale-110" />
                ) : (
                  <FaRegBookmark className="text-[18px] text-gray-700 hover:text-black dark:hover:text-white dark:text-gray-400 transition-transform transform hover:scale-110" />
                )}
              </div>
            </div>

            <div className="text-[12px] text-gray-500 dark:text-gray-400 mb-2">
              Images Count: {folder.num_of_generated_images}
            </div>

            <p className="text-[12px] text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">{folder.prompt || ''}</p>
          </div>

          <div className="flex flex-col">
            <div className="text-right text-[12px] text-gray-500 dark:text-gray-400 mb-2 line-clamp-2">
              {moment(folder.date).format('YYYY-MM-DD')}
            </div>
            <div className="flex justify-end gap-2">
              {/* 일반 이미지 다운로드 버튼 */}
              <Button
                type="primary"
                size="small"
                icon={<DownloadOutlined />}
                className="text-[12px]"
                onClick={() => handleDownload(folder.id, false)}
              >
                Download
              </Button>

              {/* ZIP 파일 다운로드 버튼 */}
              <Button
                type="primary"
                size="small"
                icon={<FileZipOutlined />}
                className="text-[12px]"
                onClick={() => handleDownload(folder.id, true)}
              >
                ZIP
              </Button>

              {/* 삭제 버튼 */}
              <Button
                danger
                size="small"
                icon={<DeleteOutlined />}
                className="text-[12px]"
                onClick={() => handleDelete(folder.id)}
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageFolderList;
