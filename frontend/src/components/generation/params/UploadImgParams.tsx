import { Tabs, Upload, Input } from 'antd';
import type { UploadProps } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

interface UploadImgParamsProps {
  handleImageUpload: (file: File) => void;
  imagePreview: string | ArrayBuffer | null;
}

const UploadImgParams = ({ handleImageUpload, imagePreview }: UploadImgParamsProps) => {
  const uploadProps: UploadProps = {
    accept: 'image/*',
    beforeUpload: (file) => {
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
              <img
                src={imagePreview as string}
                alt="Uploaded preview"
                className="w-full h-full object-cover rounded-md"
              />
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

      {/* 메뉴얼 모드, 배치 모드 */}
      <Tabs items={items} />
    </div>
  );
};

export default UploadImgParams;
