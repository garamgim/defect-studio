import { Modal } from 'antd';
import { FolderDataType } from '../../types/history';

interface FolderDetailsModalProps {
  folder: FolderDataType | null;
  onClose: () => void;
}

const ImageFolderDetail: React.FC<FolderDetailsModalProps> = ({ folder, onClose }) => (
  <Modal title="Folder Details" open={folder !== null} onCancel={onClose} footer={null}>
    {folder && (
      <div>
        <p>
          <strong>ID:</strong> {folder.id}
        </p>
        <p>
          <strong>Date:</strong> {folder.date}
        </p>
        <p>
          <strong>Prompt:</strong> {folder.prompt || 'N/A'}
        </p>
      </div>
    )}
  </Modal>
);

export default ImageFolderDetail;
