import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Slider, InputNumber, Tooltip } from 'antd';
import { GrSelect } from 'react-icons/gr';
import { VscDebugRestart } from 'react-icons/vsc';
import { IoCaretBackSharp } from 'react-icons/io5';
import { IoCaretForwardSharp } from 'react-icons/io5';
import { PiPolygonBold } from 'react-icons/pi';
import { TbArrowMoveUp } from 'react-icons/tb';
import { HiOutlinePaintBrush } from 'react-icons/hi2';
import { Stage, Layer, Line, Image as KonvaImage, Circle } from 'react-konva';
import useImage from 'use-image';
import Konva from 'konva';
import { useDispatch } from 'react-redux';
import { saveImages } from '../../../store/slices/generation/maskingSlice';

interface MaskingModalProps {
  onClose: () => void;
  imageSrc: string;
  setInitImageList: (value: string[]) => void;
  setMaskImageList: (value: string[]) => void;
}

interface LineObject {
  tool: 'brush' | 'polygon';
  points: number[];
  strokeWidth?: number;
  fill?: string;
}

const MaskingModal = ({ onClose, imageSrc, setInitImageList, setMaskImageList }: MaskingModalProps) => {
  const [tool, setTool] = useState<'brush' | 'polygon' | 'select' | null>(null);
  const [isMovingPoints, setIsMovingPoints] = useState(false);
  const [brushSize, setBrushSize] = useState<number>(10);
  const [objects, setObjects] = useState<LineObject[]>([]);
  const [undoStack, setUndoStack] = useState<LineObject[][]>([]);
  const [redoStack, setRedoStack] = useState<LineObject[][]>([]);
  const [polygonPoints, setPolygonPoints] = useState<{ x: number; y: number }[]>([]);
  const [isPolygonComplete, setIsPolygonComplete] = useState(false);
  const [selectedObjectIndex, setSelectedObjectIndex] = useState<number | null>(null);
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null);
  const isDrawing = useRef(false);
  const [scale, setScale] = useState<number>(1);
  const stageRef = useRef<Konva.Stage | null>(null);
  const [image, imageStatus] = useImage(imageSrc);

  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({ width: 512, height: 512 });
  const [imagePos, setImagePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [minImageSize, setMinImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });

  const dispatch = useDispatch();

  // 캔버스를 흑백으로 변환
  const convertCanvasToGrayscale = async (imageBase64: string): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = imageBase64;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(imageBase64);

        // 캔버스에 이미지를 그린다
        ctx.drawImage(img, 0, 0);

        // 픽셀 데이터를 가져온다
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // 알파 채널을 기준으로 투명한 부분은 검정색, 색이 있는 부분은 불투명한 흰색으로 변환
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3]; // 알파 채널(투명도)
          if (alpha > 0) {
            // 불투명한 부분은 완전한 흰색으로
            data[i] = 255; // R
            data[i + 1] = 255; // G
            data[i + 2] = 255; // B
            data[i + 3] = 255; // A (완전한 불투명)
          } else {
            // 투명한 부분은 완전한 검정색으로
            data[i] = 0; // R
            data[i + 1] = 0; // G
            data[i + 2] = 0; // B
            data[i + 3] = 255; // A (완전한 불투명)
          }
        }

        // 변경된 이미지 데이터를 다시 캔버스에 그린다
        ctx.putImageData(imageData, 0, 0);

        // 캔버스를 다시 Base64로 변환하여 반환
        resolve(canvas.toDataURL('image/png'));
      };
    });
  };
  const handleSaveImages = async () => {
    if (!stageRef.current) {
      return;
    }

    setIsMovingPoints(false); // 점 움직이는 버튼 클릭한채이면 점도 캔버스에 포함되므로 false처리함

    // const stageOriginalScale = scale; // 현재의 확대 비율 저장
    const stage = stageRef.current;

    // 1. Stage와 Canvas를 축소 상태로 설정
    stage.scale({ x: 1, y: 1 });
    stage.batchDraw(); // 축소 상태로 다시 그리기

    try {
      // 1. backgroundImg: 배경 이미지 레이어만 저장
      const imageNode = stage.findOne((node: Konva.Node) => node instanceof Konva.Image) as Konva.Image;

      if (!imageNode) {
        return; // 이미지 노드가 없으면 리턴
      }

      // 배경 이미지만 저장
      const backgroundImgBase64 = imageNode.toDataURL({
        mimeType: 'image/png',
        x: imagePos.x,
        y: imagePos.y,
        width: imageSize.width,
        height: imageSize.height,
        pixelRatio: 1 // 원래 크기로 저장
      });

      // 2. canvasImg: 투명한 캔버스를 흑백 이미지로 변환하여 저장
      const canvasLayer = stageRef.current.findOne('#canvas-layer');

      if (!canvasLayer) {
        return; // 캔버스 레이어가 없으면 리턴
      }

      // 배경 이미지 숨기고 캔버스만 보이도록 설정
      imageNode.visible(false); // 배경 이미지 비활성화
      canvasLayer.visible(true); // 캔버스만 보이게 설정
      stage.batchDraw();

      // 캔버스에서 색칠된 부분만 흑백으로 변환
      const canvasImgBase64 = await convertCanvasToGrayscale(
        canvasLayer.toDataURL({
          mimeType: 'image/png',
          x: imagePos.x,
          y: imagePos.y,
          width: imageSize.width,
          height: imageSize.height,
          pixelRatio: 1 // 축소 상태로 저장
        })
      );

      // 원래 상태로 복원
      imageNode.visible(true); // 배경 이미지 다시 보이게 설정
      canvasLayer.visible(true); // 캔버스 레이어 다시 활성화

      // 3. Combined Image: 배경과 캔버스를 합친 이미지 저장
      const combinedImgBase64 = stage.toDataURL({
        mimeType: 'image/png',
        x: imagePos.x,
        y: imagePos.y,
        width: imageSize.width,
        height: imageSize.height,
        pixelRatio: 1
      });

      // Redux에 저장
      dispatch(
        saveImages({
          backgroundImg: backgroundImgBase64, // 배경 이미지
          canvasImg: canvasImgBase64, // 캔버스 이미지 (흑백 변환 포함)
          combinedImg: combinedImgBase64 // 배경 + 캔버스 합친 이미지
        })
      );

      setInitImageList([backgroundImgBase64]);
      setMaskImageList([canvasImgBase64]);
    } catch (error) {
      console.error('Error saving images:', error);
    } finally {
      onClose();
    }
  };

  useEffect(() => {
    if (image && imageStatus === 'loaded') {
      const imgAspectRatio = image.width / image.height;
      const stageAspectRatio = stageSize.width / stageSize.height;

      let newWidth = stageSize.width;
      let newHeight = stageSize.height;

      if (imgAspectRatio > stageAspectRatio) {
        newWidth = stageSize.width;
        newHeight = newWidth / imgAspectRatio;
      } else {
        newHeight = stageSize.height;
        newWidth = newHeight * imgAspectRatio;
      }

      // 여기서 의존성 배열에 들어가는 상태를 최소화하여 무한 루프를 방지
      setImageSize((prevSize) => {
        if (prevSize.width !== newWidth || prevSize.height !== newHeight) {
          return { width: newWidth, height: newHeight };
        }
        return prevSize;
      });

      const centerX = (stageSize.width - newWidth) / 2;
      const centerY = (stageSize.height - newHeight) / 2;

      setImagePos((prevPos) => {
        if (prevPos.x !== centerX || prevPos.y !== centerY) {
          return { x: centerX, y: centerY };
        }
        return prevPos;
      });
    }
  }, [image, imageStatus, stageSize]); // 의존성 배열을 최소한의 값으로 설정

  const updateStageSize = () => {
    const modalElement = document.querySelector('.ant-modal-body');
    if (modalElement) {
      const { clientWidth, clientHeight } = modalElement;
      const modalHeight = clientHeight * 0.8;
      const modalWidth = clientWidth;

      if (image) {
        const imgAspectRatio = image.width / image.height;
        let newWidth = modalWidth;
        let newHeight = modalHeight;

        if (imgAspectRatio > modalWidth / modalHeight) {
          newWidth = modalWidth;
          newHeight = newWidth / imgAspectRatio;
        } else {
          newHeight = modalHeight;
          newWidth = newHeight * imgAspectRatio;
        }

        setStageSize({
          width: newWidth,
          height: newHeight
        });

        const centerX = (newWidth - image.width) / 2;
        const centerY = (newHeight - image.height) / 2;
        setImagePos({ x: centerX, y: centerY });
        setMinImageSize({ width: newWidth, height: newHeight });
      }
    }
  };

  useEffect(() => {
    updateStageSize();
    window.addEventListener('resize', updateStageSize);
    return () => window.removeEventListener('resize', updateStageSize);
  }, [image]); // 여기서도 의존성 배열에 필요한 최소 값만 설정

  // 상태 저장
  const saveState = (newObjects: LineObject[]) => {
    setUndoStack([...undoStack, objects]);
    setRedoStack([]);
    setObjects(newObjects);
  };

  const handleWheel = (e: Konva.KonvaEventObject<WheelEvent>) => {
    e.evt.preventDefault();
    const scaleBy = 1.05;
    const stage = stageRef.current;
    if (stage) {
      const newScale = e.evt.deltaY > 0 ? scale * scaleBy : scale / scaleBy;
      const scaledWidth = imageSize.width * newScale;
      const scaledHeight = imageSize.height * newScale;

      if (scaledWidth >= minImageSize.width && scaledHeight >= minImageSize.height) {
        setScale(newScale);
        stage.batchDraw();
      }
    }
  };

  const handlePolygonClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === 'polygon') {
      const stage = e.target.getStage();
      if (!stage) return;

      const pos = getRelativePointerPosition(stage);
      if (!pos) return;

      setPolygonPoints([...polygonPoints, pos]);

      if (
        polygonPoints.length > 0 &&
        Math.abs(pos.x - polygonPoints[0].x) < 10 &&
        Math.abs(pos.y - polygonPoints[0].y) < 10
      ) {
        const polygonPointsFlat = polygonPoints.flatMap((p) => [p.x, p.y]);
        saveState([...objects, { tool: 'polygon', points: polygonPointsFlat, fill: 'rgba(135, 206, 235, 0.5)' }]);
        setPolygonPoints([]);
        setIsPolygonComplete(true);
      } else {
        setIsPolygonComplete(false);
      }
    }
  };

  const getRelativePointerPosition = (stage: Konva.Stage | null) => {
    if (!stage) return null;
    const transform = stage.getAbsoluteTransform().copy();
    transform.invert();
    const pos = stage.getPointerPosition();
    return pos ? transform.point(pos) : null;
  };

  const handlePointDrag = (e: Konva.KonvaEventObject<DragEvent>, objIndex: number, pointIndex: number) => {
    const newObjects = [...objects];
    const newPoints = [...newObjects[objIndex].points];
    newPoints[pointIndex * 2] = e.target.x();
    newPoints[pointIndex * 2 + 1] = e.target.y();
    newObjects[objIndex] = { ...newObjects[objIndex], points: newPoints };
    saveState(newObjects);
  };

  const handleMouseMove = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === 'brush' && isDrawing.current) {
      const stage = e.target.getStage();
      if (!stage) return;

      const pos = getRelativePointerPosition(stage);
      if (!pos) return;

      const lastObject = objects[objects.length - 1];
      lastObject.points = lastObject.points.concat([pos.x, pos.y]);
      setObjects([...objects.slice(0, objects.length - 1), lastObject]);
    }

    if (tool === 'brush') {
      const pos = getRelativePointerPosition(stageRef.current);
      if (pos) {
        setCursorPosition(pos);
      }
    }
  };

  const handleMouseLeave = () => {
    setCursorPosition(null);
  };

  const handleMouseDown = (e: Konva.KonvaEventObject<MouseEvent>) => {
    if (tool === 'brush') {
      const stage = e.target.getStage();
      if (!stage) return;

      const pos = getRelativePointerPosition(stage);
      if (!pos) return;

      isDrawing.current = true;

      saveState([
        ...objects,
        { tool: 'brush', points: [pos.x, pos.y], strokeWidth: brushSize, fill: 'rgba(135, 206, 235, 0.5)' }
      ]);
    }
  };

  const handleMouseUp = () => {
    isDrawing.current = false;
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const previousState = undoStack.pop();
    if (previousState) {
      setRedoStack([objects, ...redoStack]);
      setObjects(previousState);
      setUndoStack([...undoStack]);
    }
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const nextState = redoStack.shift();
    if (nextState) {
      setUndoStack([...undoStack, objects]);
      setObjects(nextState);
      setRedoStack([...redoStack]);
    }
  };

  const handleObjectSelect = (index: number) => {
    if (tool === 'select') {
      setSelectedObjectIndex(index);
    }
  };

  const deleteSelectedObject = () => {
    if (selectedObjectIndex !== null) {
      const newObjects = objects.filter((_, index) => index !== selectedObjectIndex);
      saveState(newObjects);
      setSelectedObjectIndex(null);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedObjectIndex !== null) {
        deleteSelectedObject();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedObjectIndex, objects]);

  const clearObjects = () => {
    setObjects([]);
    setUndoStack([]);
    setRedoStack([]);
  };

  const handleToolChange = (selectedTool: 'brush' | 'polygon' | 'select' | null) => {
    setTool(selectedTool);
    setIsMovingPoints(false);
    setSelectedObjectIndex(null);
  };

  const handleMovePointsToggle = () => {
    setIsMovingPoints(!isMovingPoints);
    setTool(null);
  };

  return (
    <Modal
      open={true}
      footer={null}
      closable={false}
      centered
      styles={{ body: { height: '80vh' } }}
      width="100%"
      className="max-w-screen-sm w-full md:max-w-screen-md lg:max-w-screen-lg"
    >
      <div className="flex flex-col h-full w-full justify-center">
        <div className="flex justify-center items-center w-full h-[80%]">
          <Stage
            ref={stageRef}
            width={stageSize.width}
            height={stageSize.height}
            scaleX={scale}
            scaleY={scale}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
            onClick={handlePolygonClick}
            onWheel={handleWheel}
            draggable={false}
            className="border border-white"
          >
            <Layer id="canvas-layer">
              {image && (
                <KonvaImage
                  image={image}
                  width={imageSize.width}
                  height={imageSize.height}
                  x={imagePos.x}
                  y={imagePos.y}
                  draggable={false} // 이미지 드래그 비활성화
                />
              )}
              {tool === 'brush' && cursorPosition && (
                <Circle
                  x={cursorPosition.x}
                  y={cursorPosition.y}
                  radius={brushSize / 2}
                  fill="rgba(135, 206, 235, 0.3)"
                />
              )}
              {objects.map((obj, objIndex) => (
                <React.Fragment key={objIndex}>
                  <Line
                    points={obj.points}
                    stroke={
                      selectedObjectIndex === objIndex
                        ? 'red'
                        : obj.tool === 'brush'
                          ? 'rgba(135, 206, 235, 0.5)'
                          : undefined
                    }
                    strokeWidth={obj.strokeWidth}
                    closed={obj.tool === 'polygon'}
                    fill={obj.tool === 'polygon' ? obj.fill : undefined}
                    lineCap="round"
                    onClick={() => handleObjectSelect(objIndex)}
                  />
                  {isMovingPoints &&
                    obj.tool === 'polygon' &&
                    obj.points.map((_, pointIndex) =>
                      pointIndex % 2 === 0 ? (
                        <Circle
                          key={pointIndex}
                          x={obj.points[pointIndex]}
                          y={obj.points[pointIndex + 1]}
                          radius={5}
                          fill="blue"
                          draggable
                          onDragMove={(e) => handlePointDrag(e, objIndex, pointIndex / 2)}
                        />
                      ) : null
                    )}
                </React.Fragment>
              ))}
              {polygonPoints.length > 0 && !isPolygonComplete && (
                <>
                  {polygonPoints.map((point, i) => (
                    <Circle key={i} x={point.x} y={point.y} radius={4} fill="blue" />
                  ))}
                  <Line
                    points={polygonPoints.flatMap((p) => [p.x, p.y])}
                    stroke="blue"
                    strokeWidth={1}
                    dash={[10, 5]}
                    lineCap="round"
                  />
                </>
              )}
            </Layer>
          </Stage>
        </div>
        {/* 도구 바 */}
        <div className="mt-4 flex justify-between items-center px-12 py-2 bg-gray-100 rounded-3xl">
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
                  tool === 'polygon'
                    ? 'border-none bg-transparent text-blue-500'
                    : 'border-none bg-transparent text-blue'
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
                  tool === 'select'
                    ? 'border-none bg-transparent text-blue-500'
                    : 'border-none bg-transparent text-blue'
                }
                shape="circle"
                size="large"
              />
            </Tooltip>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex gap-4 items-center">
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
          </div>

          <div className="flex space-x-4 px-4">
            <Tooltip title="Undo">
              <Button
                className="border-none bg-transparent"
                onClick={handleUndo}
                icon={<IoCaretBackSharp size={20} />}
                disabled={undoStack.length === 0}
                shape="circle"
                size="large"
              />
            </Tooltip>
            <Tooltip title="Redo">
              <Button
                className="border-none bg-transparent"
                onClick={handleRedo}
                icon={<IoCaretForwardSharp size={20} />}
                disabled={redoStack.length === 0}
                shape="circle"
                size="large"
              />
            </Tooltip>
            <Tooltip title="Restart">
              <Button
                className="border-none bg-transparent"
                onClick={clearObjects}
                icon={<VscDebugRestart size={20} />}
                shape="circle"
                size="large"
              />
            </Tooltip>
          </div>

          <div className="flex space-x-4">
            <Button onClick={onClose} className="border-none bg-white text-blue-500">
              Cancel
            </Button>
            <Button onClick={handleSaveImages} type="primary" className="bg-blue-500 text-white">
              Apply
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MaskingModal;
