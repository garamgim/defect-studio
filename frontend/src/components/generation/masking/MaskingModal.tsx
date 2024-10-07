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

interface MaskingModalProps {
  isModalOpen: boolean;
  closeModal: () => void;
  imageSrc: string;
  updateInitImageList: (initImgList: string[]) => void; // 배경 이미지
  updateMaskImageList: (maskImgList: string[]) => void; // 캔버스 이미지
  updateCombinedImg: (combinedImg: string) => void; // 배경+캔버스 결합이미지
}

interface LineObject {
  tool: 'brush' | 'polygon'; // 선 객체에서 브러쉬랑 폴리곤 중 선택
  points: number[]; // 점의 좌표를 배열로 저장
  strokeWidth?: number; // 브러쉬면 반지름 값을 가지고, 폴리곤일 때는 안가짐
  fill?: string; // ?
}

const MaskingModal = ({
  closeModal,
  imageSrc, // initImageList의 첫번째 배열에는 메뉴얼모드에서 업로드한 사진한장이 담김
  updateInitImageList,
  updateMaskImageList,
  updateCombinedImg,
  isModalOpen
}: MaskingModalProps) => {
  const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null); // 마우스 위치 저장 (x, y값), 이미지 벗어나면 null
  const [rgbColor, setRgbColor] = useState<string | null>(null); // RGB 스트링값, 마찬가지로 이미지 벗어나면 null

  const [, setImageScale] = useState(1); // 이미지 배율 상태관리, 초기에 1를 부여해서 처음에 렌더링 된 이미지의 상태를 1이라고 판단함

  const [tool, setTool] = useState<'brush' | 'polygon' | 'select' | null>(null); // 도구 선택은 브러쉬, 폴리곤, 점 선택, 또는 개체 선택
  const [isMovingPoints, setIsMovingPoints] = useState(false); // 점 움직이기 기능
  const [brushSize, setBrushSize] = useState<number>(10);
  const [objects, setObjects] = useState<LineObject[]>([]); // redo, undo기능을 만들기 위해 한번 작업할 때마다 한 작업을 객체로 묶어서 저장함
  const [undoStack, setUndoStack] = useState<LineObject[][]>([]); // 초기값은 빈배열, ?
  const [redoStack, setRedoStack] = useState<LineObject[][]>([]); // 여기도 위와 마찬가지로 초기값 빈배열, ?
  const [polygonPoints, setPolygonPoints] = useState<{ x: number; y: number }[]>([]); // 폴리곤 점 찍을 때 {x, y} 객체로 저장
  const [isPolygonComplete, setIsPolygonComplete] = useState(false); // 폴리곤 완성됐는지 체크
  const [selectedObjectIndex, setSelectedObjectIndex] = useState<number | null>(null); // 선택된 객체의 인덱스, 선택 안됐을 경우에는 null
  const [cursorPosition, setCursorPosition] = useState<{ x: number; y: number } | null>(null); // 커서 위치 {x, y}, 기본값은 null
  const isDrawing = useRef(false); // 그림그리고 있는 지 체크
  const [scale, setScale] = useState<number>(1); //여기도 1체크 <- 중복해서 배율 관리하고 있음
  const stageRef = useRef<Konva.Stage | null>(null); // ?
  const [image, imageStatus] = useImage(imageSrc); // useImage ?

  const [stageSize, setStageSize] = useState<{ width: number; height: number }>({ width: 512, height: 512 }); // 처음에 stageSize를 {512, 512}
  const [imagePos, setImagePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 }); // 이미지 위치도 {0,0}
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 }); // 이미지 크기도 {0,0}
  const [minImageSize, setMinImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 }); // 이미지 최소 크기?

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
  const handlesaveImgs = async () => {
    if (!stageRef.current) {
      return;
    }

    setIsMovingPoints(false); // 점 움직이는 버튼 클릭한채이면 점도 캔버스에 포함되므로 false처리함

    const stage = stageRef.current;

    // 원본 크기로 배율 복원
    const originalScaleX = stage.scaleX();
    const originalScaleY = stage.scaleY();
    stage.scale({ x: 1, y: 1 });
    stage.batchDraw(); // 배율 복원 후 다시 그리기

    try {
      // 1. 배경 이미지 저장 (원본 크기)
      const imageNode = stage.findOne((node: Konva.Node) => node instanceof Konva.Image) as Konva.Image;
      if (!imageNode) {
        return; // 이미지 노드가 없으면 리턴
      }

      const backgroundImgBase64 = imageNode.toDataURL({
        mimeType: 'image/png',
        x: imagePos.x,
        y: imagePos.y,
        width: imageSize.width, // 원본 크기 저장
        height: imageSize.height, // 원본 크기 저장
        pixelRatio: 1 // 원본 크기로 저장
      });

      // 2. 캔버스 레이어를 흑백 이미지로 변환하여 저장
      const canvasLayer = stage.findOne('#canvas-layer');
      if (!canvasLayer) {
        return; // 캔버스 레이어가 없으면 리턴
      }

      imageNode.visible(false); // 배경 이미지 비활성화
      canvasLayer.visible(true); // 캔버스만 보이게 설정
      stage.batchDraw();

      const canvasImgBase64 = await convertCanvasToGrayscale(
        canvasLayer.toDataURL({
          mimeType: 'image/png',
          x: imagePos.x,
          y: imagePos.y,
          width: imageSize.width,
          height: imageSize.height,
          pixelRatio: 1 // 축소되지 않고 원본 크기로 저장
        })
      );

      // 원래 상태로 복원
      imageNode.visible(true); // 배경 이미지 다시 보이게 설정
      canvasLayer.visible(true); // 캔버스 레이어 다시 활성화

      // 3. 결합된 이미지 저장 (배경 이미지와 캔버스 결합)
      const combinedImgBase64 = stage.toDataURL({
        mimeType: 'image/png',
        x: imagePos.x,
        y: imagePos.y,
        width: imageSize.width,
        height: imageSize.height,
        pixelRatio: 1 // 원본 크기로 결합된 이미지 저장
      });

      updateInitImageList([backgroundImgBase64]); // 원본 크기의 배경 이미지
      updateMaskImageList([canvasImgBase64]); // 흑백 이미지로 변환된 캔버스
      updateCombinedImg(combinedImgBase64); // 결합된 이미지 저장
    } catch (error) {
      console.error('Error saving images:', error);
    } finally {
      // 원래 스케일로 복원
      stage.scale({ x: originalScaleX, y: originalScaleY });
      stage.batchDraw(); // 스테이지 다시 그리기
      closeModal();
    }
  };

  useEffect(() => {
    if (image && imageStatus === 'loaded') {
      // 이미지의 원본 크기를 사용하여 스테이지에 맞는 배율을 계산
      const imgAspectRatio = image.width / image.height;
      const stageAspectRatio = stageSize.width / stageSize.height;

      let newScale = 1;
      let newWidth = image.width;
      let newHeight = image.height;

      // 스테이지 크기에 맞게 이미지의 크기와 배율을 조정
      if (imgAspectRatio > stageAspectRatio) {
        newScale = stageSize.width / image.width;
        newWidth = stageSize.width;
        newHeight = newWidth / imgAspectRatio;
      } else {
        newScale = stageSize.height / image.height;
        newHeight = stageSize.height;
        newWidth = newHeight * imgAspectRatio;
      }

      setImageScale(newScale); // 이미지 배율 설정
      setImageSize({ width: newWidth, height: newHeight }); // 이미지 크기 설정
      const centerX = (stageSize.width - newWidth) / 2;
      const centerY = (stageSize.height - newHeight) / 2;
      setImagePos({ x: centerX, y: centerY }); // 이미지 위치 설정
    }
  }, [image, imageStatus, stageSize]);

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
    const scale = stage.scaleX(); // scaleX와 scaleY가 동일하므로 하나만 사용
    return pos ? { x: pos.x / scale, y: pos.y / scale } : null;
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
    const stage = e.target.getStage();
    if (!stage) return;

    // 현재 스테이지의 scale 값을 가져옴
    const scale = stage.scaleX(); // scaleX와 scaleY가 동일하므로 하나만 사용
    const pos = stage.getPointerPosition();
    if (!pos) return;

    // 마우스 좌표를 scale에 맞게 보정
    const correctedPos = { x: pos.x / scale, y: pos.y / scale };
    setMousePosition(correctedPos);

    // 브러시 도구가 활성화되고 드로잉 중인 경우
    if (tool === 'brush' && isDrawing.current) {
      const lastObject = objects[objects.length - 1];
      lastObject.points = lastObject.points.concat([correctedPos.x, correctedPos.y]);
      setObjects([...objects.slice(0, objects.length - 1), lastObject]);
    }

    // 마우스 커서에 브러시 크기만큼 원을 표시
    if (tool === 'brush') {
      setCursorPosition(correctedPos); // 브러시 크기 원을 표시할 위치 설정
    }

    // 배경 이미지의 RGB 색상 값 얻기
    const imageNode = stage.findOne((node: Konva.Node) => node instanceof Konva.Image) as Konva.Image;
    if (imageNode) {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) return;

      // 배경 이미지가 로드되어 있으면 drawImage 수행
      const imgSource = imageNode.image();
      if (imgSource) {
        canvas.width = imageNode.width();
        canvas.height = imageNode.height();

        context.drawImage(imgSource, 0, 0);
        const imageData = context.getImageData(Math.floor(correctedPos.x), Math.floor(correctedPos.y), 1, 1).data;
        const rgb = `rgb(${imageData[0]}, ${imageData[1]}, ${imageData[2]})`;

        setRgbColor(rgb);
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
      open={isModalOpen}
      footer={null}
      onCancel={closeModal}
      closable={false}
      centered
      styles={{ body: { height: '80vh' } }}
      width="100%"
      className="max-w-screen-sm w-full md:max-w-screen-md lg:max-w-screen-lg"
    >
      <div>
        {mousePosition && (
          <p>
            Mouse Position: X: {mousePosition.x}, Y: {mousePosition.y}
          </p>
        )}
        {rgbColor && <p>RGB: {rgbColor}</p>}
      </div>
      <div className="flex items-center space-x-4 mt-3">
        <Slider
          min={1} // 최소 확대 배율
          max={3} // 최대 확대 배율
          step={0.05} // 슬라이더 단위
          value={scale} // 현재 scale 상태와 연결
          onChange={(newScale) => setScale(newScale)} // 슬라이더 값 변경 시 scale 상태 업데이트
          style={{ width: '150px' }}
        />
        <InputNumber
          min={1}
          max={3}
          step={0.05}
          value={scale}
          onChange={(newScale) => setScale(newScale ?? 1)} // 숫자 입력으로도 확대/축소 가능
          className="w-[60px]"
        />
      </div>
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
              <KonvaImage
                image={image}
                width={imageSize.width}
                height={imageSize.height}
                x={imagePos.x}
                y={imagePos.y}
                draggable={false} // 이미지 드래그 비활성화
              />

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
            <Button onClick={closeModal} className="border-none bg-white text-blue-500">
              Cancel
            </Button>
            <Button onClick={handlesaveImgs} type="primary" className="bg-blue-500 text-white">
              Apply
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default MaskingModal;
