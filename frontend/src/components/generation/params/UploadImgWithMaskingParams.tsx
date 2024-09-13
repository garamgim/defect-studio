import { Upload, Tabs, Input } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

interface UploadImgWithMaskingParamsProps {
  handleImageUpload: (file: File) => void;
  imagePreview: string | null;
  setActiveTab: (key: string) => void; 
}

const UploadImgWithMasking: React.FC<UploadImgWithMaskingParamsProps> = ({
  handleImageUpload,
  imagePreview,
  setActiveTab
}) => {
  const uploadProps = {
    accept: 'image/*',
    beforeUpload: (file: File) => {
      handleImageUpload(file);
      return false;
    },
    showUploadList: false
  };

  const items = [
    {
      key: 'manual',
      label: 'Manual mode',
      children: (
        <div>
          <Upload.Dragger {...uploadProps} className="mb-4">
            {imagePreview ? (
              <img src={imagePreview} alt="Uploaded preview" className="w-full h-full object-cover rounded-md" />
            ) : (
              <div>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined />
                </p>
                <p className="ant-upload-text">Click or drag file to this area to upload</p>
              </div>
            )}
          </Upload.Dragger>
        </div>
      )
    },
    {
      key: 'batch',
      label: 'Batch mode',
      children: (
        <div>
          <div className="mb-4">
            <label htmlFor="imagePath" className="block text-[14px] text-[#222] mb-1 dark:text-gray-300">
              Input directory
            </label>
            <Input type="text" id="imagePath" className="w-full" placeholder="Enter the image path" />
          </div>
          <div className="mb-4">
            <label htmlFor="maskPath" className="block text-[14px] text-[#222] mb-1 dark:text-gray-300">
              Masked Images directory
            </label>
            <Input type="text" id="maskPath" className="w-full" placeholder="Enter the mask path" />
          </div>
          <div className="mb-2">
            <label htmlFor="outputPath" className="block text-[14px] text-[#222] mb-1 dark:text-gray-300">
              Output directory
            </label>
            <Input type="text" id="outputPath" className="w-full" placeholder="Enter the output path" />
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="p-6">
      <p className="text-[14px] font-semibold text-[#222] mb-3 dark:text-gray-300">Upload Image</p>
      <Tabs items={items} onChange={setActiveTab} /> 
    </div>
  );
};

export default UploadImgWithMasking;
