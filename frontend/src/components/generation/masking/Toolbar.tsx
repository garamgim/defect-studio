import React from 'react';
import { Button, Slider, InputNumber, Tooltip } from 'antd';
import { HiOutlinePaintBrush } from 'react-icons/hi2';
import { PiPolygonBold } from 'react-icons/pi';
import { TbArrowMoveUp } from 'react-icons/tb';
import { GrSelect } from 'react-icons/gr';

interface ToolbarProps {
  tool: 'brush' | 'polygon' | 'select' | null;
  brushSize: number;
  setBrushSize: (size: number) => void;
  handleToolChange: (tool: 'brush' | 'polygon' | 'select' | null) => void;
  handleMovePointsToggle: () => void;
  isMovingPoints: boolean;
}

const Toolbar = ({
  tool,
  brushSize,
  setBrushSize,
  handleToolChange,
  handleMovePointsToggle,
  isMovingPoints
}: ToolbarProps) => {
  return (
    <div className="flex space-x-4 items-center">
      <Tooltip title="Brush">
        <Button
          onClick={() => handleToolChange('brush')}
          icon={<HiOutlinePaintBrush size={20} />}
          className={
            tool === 'brush' ? 'border-none bg-transparent text-blue-500' : 'border-none bg-transparent text-blue'
          }
          shape="circle"
          size="large"
        />
      </Tooltip>
      <Tooltip title="Polygon">
        <Button
          onClick={() => handleToolChange('polygon')}
          icon={<PiPolygonBold size={20} />}
          className={
            tool === 'polygon' ? 'border-none bg-transparent text-blue-500' : 'border-none bg-transparent text-blue'
          }
          shape="circle"
          size="large"
        />
      </Tooltip>
      <Tooltip title="Move Polygon Points">
        <Button
          onClick={handleMovePointsToggle}
          icon={<TbArrowMoveUp size={20} />}
          className={
            isMovingPoints ? 'border-none bg-transparent text-blue-500' : 'border-none bg-transparent text-blue'
          }
          shape="circle"
          size="large"
        />
      </Tooltip>
      <Tooltip title="Select and Delete">
        <Button
          onClick={() => handleToolChange('select')}
          icon={<GrSelect size={20} />}
          className={
            tool === 'select' ? 'border-none bg-transparent text-blue-500' : 'border-none bg-transparent text-blue'
          }
          shape="circle"
          size="large"
        />
      </Tooltip>

      {tool === 'brush' && (
        <>
          <Slider
            min={1}
            max={50}
            value={brushSize}
            onChange={(value) => setBrushSize(value)}
            style={{ width: '100px' }}
          />
          <InputNumber
            className="w-[60px]"
            min={1}
            max={50}
            value={brushSize}
            onChange={(value) => setBrushSize(value ?? 1)}
          />
        </>
      )}
    </div>
  );
};

export default React.memo(Toolbar);
