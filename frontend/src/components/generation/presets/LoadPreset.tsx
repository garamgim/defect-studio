import React, { useState, useEffect } from 'react';
import { Typography, Modal, Button, message } from 'antd';
import { getPresetList, getPresetDetail, deletePreset } from '../../../api/generation';
import moment from 'moment';
import { PresetDataType } from '../../../types/generation';
import { GrPrevious, GrNext } from 'react-icons/gr';
import { MinusSquareOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

interface LoadPresetProps {
  isModalOpen: boolean;
  closeModal: () => void;
  type: 'text_to_image' | 'image_to_image' | 'inpainting' | 'remove_background' | 'clean_up';

  setModel: (value: string) => void;
  setWidth: (value: number) => void;
  setHeight: (value: number) => void;
  setGuidanceScale: (value: number) => void;
  setNumInferenceSteps: (value: number) => void;
  setSeed: (value: number) => void;
  setPrompt: (value: string) => void;
  setNegativePrompt: (value: string) => void;
  setBatchCount: (value: number) => void;
  setBatchSize: (value: number) => void;
  setScheduler: (value: string) => void;
  setStrength?: (value: number) => void;
}

const LoadPreset = ({
  isModalOpen,
  closeModal,
  type,
  setModel,
  setWidth,
  setHeight,
  setGuidanceScale,
  setNumInferenceSteps,
  setSeed,
  setPrompt,
  setNegativePrompt,
  setBatchCount,
  setBatchSize,
  setScheduler,
  setStrength
}: LoadPresetProps) => {
  const [, setLoading] = useState(true);
  const [filteredPresets, setFilteredPresets] = useState<PresetDataType[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<PresetDataType | null>(null);

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 한 페이지에 보여줄 항목 수

  // Preset 목록 가져오기
  const fetchPresets = async () => {
    try {
      if (!isModalOpen) return;

      setLoading(true);
      const data = await getPresetList();

      // type에 맞는 프리셋만 필터링
      const filtered = data.presets.filter((preset: PresetDataType) => preset.generation_type === type);
      setFilteredPresets(filtered);
      setLoading(false);
    } catch (error) {
      message.error('Failed to load presets.');
      setLoading(false);
    }
  };

  // 모달이 열릴 때 목록을 가져오기
  useEffect(() => {
    fetchPresets();
  }, [isModalOpen]);

  // 프리셋 세부 정보 가져오기
  const fetchPresetDetail = async (preset_id: string) => {
    try {
      setLoading(true);
      const presetDetail = await getPresetDetail(preset_id);
      setSelectedPreset(presetDetail);
      setLoading(false);
    } catch (error) {
      message.error('Failed to load preset detail.');
      setLoading(false);
    }
  };

  // 프리셋 삭제
  const handleDeletePreset = async (preset_id: string) => {
    try {
      setLoading(true);
      await deletePreset(preset_id);
    } catch (error) {
      message.error('Failed to delete preset.');
      setLoading(false);
    }
  };

  // 프리셋 목록으로 돌아가기
  const backToList = () => {
    setSelectedPreset(null);
  };

  // 현재 페이지에 해당하는 Preset 목록을 필터링
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPresets = filteredPresets.slice(startIndex, endIndex);

  // 페이지 변경 함수
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // 프리셋 로드 함수
  const handleLoadPreset = () => {
    if (selectedPreset) {
      if (selectedPreset.model) {
        setModel(selectedPreset.model);
      }
      if (selectedPreset.width) {
        setWidth(selectedPreset.width);
      }
      if (selectedPreset.height) {
        setHeight(selectedPreset.height);
      }
      if (selectedPreset.guidance_scale) {
        setGuidanceScale(selectedPreset.guidance_scale);
      }
      if (selectedPreset.sampling_steps) {
        setNumInferenceSteps(selectedPreset.sampling_steps);
      }
      if (selectedPreset.seed) {
        setSeed(selectedPreset.seed);
      }
      if (selectedPreset.prompt) {
        setPrompt(selectedPreset.prompt);
      }
      if (selectedPreset.negative_prompt) {
        setNegativePrompt(selectedPreset.negative_prompt);
      }
      if (selectedPreset.batch_count) {
        setBatchCount(selectedPreset.batch_count);
      }
      if (selectedPreset.batch_size) {
        setBatchSize(selectedPreset.batch_size);
      }
      if (selectedPreset.sampling_method) {
        setScheduler(selectedPreset.sampling_method);
      }
      if (selectedPreset.strength && setStrength) {
        setStrength(selectedPreset.strength);
      }
    }
    closeModal();
  };

  return (
    <Modal
      open={isModalOpen}
      onCancel={closeModal}
      closable={false}
      footer={null}
      width={600}
      centered
      styles={{
        body: {
          height: '80vh',
          overflowY: 'auto'
        }
      }}
    >
      <div className="p-4 flex flex-col h-[70vh] justify-between">
        <div>
          <Title level={4} className="dark:text-gray-300">
            {selectedPreset ? `${selectedPreset.preset_title}` : 'Load Preset'}
          </Title>
          {!selectedPreset ? (
            <>
              <Text type="secondary" className="dark:text-gray-400">
                Select a preset from the list, review its details, and click 'Load' to apply it.
              </Text>

              {/* Preset 목록 */}
              <div className="mt-8">
                {/* 칼럼명 */}
                <div className="flex justify-between p-4 font-semibold border-t border-b border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                  <span className="w-1/12">No.</span>
                  <span className="w-7/12">Preset Name</span>
                  <span className="w-3/12">Date</span>
                  <span className="w-1/12"></span>
                </div>

                {/* 목록 */}
                <ul className="list-none border-b border-gray-200 dark:border-gray-700">
                  {currentPresets.map((preset, index) => (
                    <li
                      key={preset._id}
                      className={`p-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 dark:hover:bg-opacity-30 dark:text-gray-300 ${
                        index !== currentPresets.length - 1 ? 'border-b border-gray-200 dark:border-gray-700' : ''
                      }`}
                      onClick={() => {
                        if (preset._id) fetchPresetDetail(preset._id);
                      }}
                    >
                      <div className="flex justify-between">
                        {/* 번호 */}
                        <span className="w-1/12">{startIndex + index + 1}</span>

                        {/* Preset 이름 */}
                        <span className="w-7/12">{preset.preset_title}</span>

                        {/* 날짜 */}
                        <span className="w-3/12">{moment(preset.date).format('YYYY-MM-DD HH:mm')}</span>

                        {/* 삭제 버튼 */}
                        <button
                          className="w-1/12 text-[15px] text-gray-500 hover:text-blue-500 dark:text-gray-400 dark:hover:text-white"
                          onClick={async (event) => {
                            event.stopPropagation(); // 부모 클릭 이벤트 전파 방지
                            if (preset._id) {
                              await handleDeletePreset(preset._id); // 삭제 후
                              fetchPresets();
                            }
                          }}
                        >
                          <MinusSquareOutlined />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 페이지네이션 */}
              <div className="mt-8 flex justify-center items-center">
                <button
                  className={`border-none items-center cursor-pointer dark:text-gray-300 ${
                    currentPage === 1
                      ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                      : 'hover:text-blue-500 dark:hover:text-white'
                  }`}
                  disabled={currentPage === 1}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  <GrPrevious />
                </button>
                <span className="mx-4 dark:text-gray-300">
                  {currentPage} / {Math.ceil(filteredPresets.length / itemsPerPage)}
                </span>
                <button
                  className={`border-none items-center cursor-pointer dark:text-gray-300 ${
                    currentPage === Math.ceil(filteredPresets.length / itemsPerPage)
                      ? 'text-gray-300 dark:text-gray-700 cursor-not-allowed'
                      : 'dark:hover:text-white hover:text-blue-500'
                  }`}
                  disabled={currentPage === Math.ceil(filteredPresets.length / itemsPerPage)}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  <GrNext />
                </button>
              </div>
            </>
          ) : (
            <>
              {/* 선택된 프리셋의 세부 정보 표시 */}
              <div className="mt-8">
                <ul className="list-none space-y-4 dark:text-gray-300">
                  {selectedPreset.model && (
                    <li className="flex justify-between">
                      <span>Model:</span>
                      <span>{selectedPreset.model}</span>
                    </li>
                  )}
                  {selectedPreset.width && (
                    <li className="flex justify-between">
                      <span>Width:</span>
                      <span>{selectedPreset.width}</span>
                    </li>
                  )}
                  {selectedPreset.height && (
                    <li className="flex justify-between">
                      <span>Height:</span>
                      <span>{selectedPreset.height}</span>
                    </li>
                  )}
                  {selectedPreset.batch_count && (
                    <li className="flex justify-between">
                      <span>Batch Count:</span>
                      <span>{selectedPreset.batch_count}</span>
                    </li>
                  )}
                  {selectedPreset.batch_size && (
                    <li className="flex justify-between">
                      <span>Batch Size:</span>
                      <span>{selectedPreset.batch_size}</span>
                    </li>
                  )}
                  {selectedPreset.guidance_scale && (
                    <li className="flex justify-between">
                      <span>Guidance Scale:</span>
                      <span>{selectedPreset.guidance_scale}</span>
                    </li>
                  )}
                  {selectedPreset.sampling_steps && (
                    <li className="flex justify-between">
                      <span>Sampling Steps:</span>
                      <span>{selectedPreset.sampling_steps}</span>
                    </li>
                  )}
                  {selectedPreset.sampling_method && (
                    <li className="flex justify-between">
                      <span>Scheduler:</span>
                      <span>{selectedPreset.sampling_method}</span>
                    </li>
                  )}
                  {selectedPreset.seed && (
                    <li className="flex justify-between">
                      <span>Seed:</span>
                      <span>{selectedPreset.seed}</span>
                    </li>
                  )}
                  {selectedPreset.prompt && (
                    <li className="flex justify-between">
                      <span>Prompt:</span>
                      <span>{selectedPreset.prompt}</span>
                    </li>
                  )}
                  {selectedPreset.negative_prompt && (
                    <li className="flex justify-between">
                      <span>Negative Prompt:</span>
                      <span>{selectedPreset.negative_prompt}</span>
                    </li>
                  )}
                </ul>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="flex justify-end gap-4 p-4">
        {selectedPreset ? <Button onClick={backToList}>Back</Button> : <Button onClick={closeModal}>Cancel</Button>}
        {selectedPreset && (
          <Button type="primary" onClick={handleLoadPreset}>
            Load
          </Button>
        )}
      </div>
    </Modal>
  );
};

export default React.memo(LoadPreset);
