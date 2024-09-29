// ImageFolderList.tsx
import { Button } from 'antd';
import { EyeOutlined, DownloadOutlined, DeleteOutlined } from '@ant-design/icons';
import moment from 'moment';
import { FolderDataType } from '../../types/history';

interface ImageFolderListProps {
  folders: FolderDataType[];
  handleDetailClick: (folder: FolderDataType) => void;
  handleDownload: (id: string) => void;
  handleDelete: (id: string) => void;
}

const ImageFolderList: React.FC<ImageFolderListProps> = ({
  folders,
  handleDetailClick,
  handleDownload,
  handleDelete
}) => (
  <div className="grid grid-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 w-full">
    {folders.map((folder) => (
      <div
        key={folder.id}
        className="relative bg-white rounded-lg shadow-lg p-2 flex flex-col justify-between dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 h-[140px]"
      >
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">ID: {folder.id}</h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">{moment(folder.date).format('YYYY-MM-DD')}</span>
          </div>

          <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">Images: {folder.num_of_generated_images}</div>

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
);

export default ImageFolderList;
