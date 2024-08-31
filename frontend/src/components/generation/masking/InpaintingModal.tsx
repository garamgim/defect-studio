import { useCallback, useEffect, useRef } from 'react';
import { Button, Slider, Tooltip, InputNumber, Modal } from 'antd';
import { fabric } from 'fabric';
import { IoBrush } from 'react-icons/io5';
import { PiPolygonBold } from 'react-icons/pi';
import { GrSelect } from 'react-icons/gr';
import { useFabric } from '../../../contexts/FabricContext';

const RADIUS = 4;
const DEFAULT_COLOR = 'rgba(135, 206, 235, 0.5)';
const TOOLBAR_HEIGHT = 60;

interface Point {
  x: number;
  y: number;
}

// 곡선을 계산하는 함수
const calCurve = (points: number[], tension = 0.5, numOfSeg = 20, close = true): number[] => {
  tension = typeof tension === 'number' ? tension : 0.5;
  numOfSeg = numOfSeg || 20;

  let pts = points.slice(0),
    res: number[] = [],
    l = points.length,
    cache = new Float32Array((numOfSeg + 2) * 4),
    cachePtr = 4;

  if (close) {
    pts.unshift(points[l - 1], points[l - 2]);
    pts.push(points[0], points[1]);
  } else {
    pts.unshift(points[1], points[0]);
    pts.push(points[l - 2], points[l - 1]);
  }

  cache[0] = 1;

  for (let i = 1; i < numOfSeg; i++) {
    const st = i / numOfSeg,
      st2 = st * st,
      st3 = st2 * st,
      st23 = st3 * 2,
      st32 = st2 * 3;

    cache[cachePtr++] = st23 - st32 + 1;
    cache[cachePtr++] = st32 - st23;
    cache[cachePtr++] = st3 - 2 * st2 + st;
    cache[cachePtr++] = st3 - st2;
  }

  cache[++cachePtr] = 1;

  parse(pts, cache, l);

  if (close) {
    pts = [points[l - 4], points[l - 3], points[l - 2], points[l - 1], points[0], points[1], points[2], points[3]];
    parse(pts, cache, 4);
  }

  function parse(pts: number[], cache: Float32Array, l: number) {
    for (let i = 2; i < l; i += 2) {
      const pt1 = pts[i],
        pt2 = pts[i + 1],
        pt3 = pts[i + 2],
        pt4 = pts[i + 3],
        t1x = (pt3 - pts[i - 2]) * tension,
        t1y = (pt4 - pts[i - 1]) * tension,
        t2x = (pts[i + 4] - pt1) * tension,
        t2y = (pts[i + 5] - pt2) * tension;

      for (let t = 0; t <= numOfSeg; t++) {
        const c = t * 4;

        res.push(
          cache[c] * pt1 + cache[c + 1] * pt3 + cache[c + 2] * t1x + cache[c + 3] * t2x,
          cache[c] * pt2 + cache[c + 1] * pt4 + cache[c + 2] * t1y + cache[c + 3] * t2y
        );
      }
    }
  }

  return res;
};

// Point 배열을 숫자 배열로 변환하는 함수
const pointsObjToArray = (points: Point[]): number[] => {
  const flattenPoints: number[] = [];
  points.forEach((point) => {
    flattenPoints.push(point.x, point.y);
  });
  return flattenPoints;
};

// 숫자 배열을 Point 배열로 변환하는 함수
const pointsArrayToObj = (points: number[]): Point[] => {
  const curvePoints: Point[] = [];
  for (let i = 0; i <= points.length - 2; i += 2) {
    curvePoints.push({ x: points[i], y: points[i + 1] });
  }
  return curvePoints;
};

// 이전 요소들을 제거하는 함수
const clearPreviousElements = (drawCanvas: fabric.Canvas, curIndex: number): void => {
  const fabricObjects = drawCanvas.getObjects();
  fabricObjects.forEach((curElement) => {
    if ((curElement as any)?.lassoIndex === curIndex) drawCanvas.remove(curElement);
  });
};

// 윤곽선을 그리는 함수
const drawContour = (drawCanvas: fabric.Canvas, points: Point[]): void => {
  if (points.length < 2) return;
  const newPoints = calCurve(pointsObjToArray(points));
  const curvePoints = pointsArrayToObj(newPoints);
  const polygon = new fabric.Polyline(curvePoints, {
    fill: DEFAULT_COLOR,
    selectable: false
  } as any);
  drawCanvas.add(polygon);
};

// 제어 점을 그리는 함수
const drawControlPoints = (drawCanvas: fabric.Canvas, points: Point[]): void => {
  points.forEach((point) => {
    const circle = new fabric.Circle({
      top: point.y - RADIUS,
      left: point.x - RADIUS,
      radius: RADIUS,
      fill: 'rgba(56, 189, 248, 0.9)',
      selectable: false
    } as any);
    drawCanvas.add(circle);
  });
};

// InpaintingModal 컴포넌트
const InpaintingModal: React.FC<{
  imageSrc: string;
  onClose: () => void;
}> = ({ imageSrc, onClose }) => {
  const {
    drawType,
    drawCanvas,
    setDrawType,
    penWidth,
    setPenWidth,
    lassos,
    setLassos,
    activeIndex,
    setActiveIndex,
    setImageDownloadUrl,
    setCanvasDownloadUrl,
    setMaskingResult
  } = useFabric();

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // 모달 창 크기에 맞게 캔버스 크기를 조정하는 함수
  const resizeCanvasToFit = useCallback(() => {
    const modalHeight = window.innerHeight * 0.8 - TOOLBAR_HEIGHT; // 모달의 높이를 80%로 설정
    const modalWidth = window.innerWidth * 0.9;

    const img = drawCanvas.current.backgroundImage as fabric.Image; // 명시적으로 fabric.Image로 타입 캐스팅
    if (img && img.width && img.height) {
      // img가 존재하고 width와 height가 존재할 때
      const imgAspect = img.width / img.height;
      const modalAspect = modalWidth / modalHeight;

      let canvasWidth, canvasHeight;

      if (imgAspect > modalAspect) {
        canvasWidth = modalWidth;
        canvasHeight = modalWidth / imgAspect;
      } else {
        canvasHeight = modalHeight;
        canvasWidth = modalHeight * imgAspect;
      }

      drawCanvas.current.setWidth(canvasWidth);
      drawCanvas.current.setHeight(canvasHeight);
      drawCanvas.current.setZoom(canvasWidth / img.width);
    }

    drawCanvas.current.renderAll();
  }, [drawCanvas]);

  // 펜 크기가 변경될 때마다 브러쉬 크기를 조정하는 Effect
  useEffect(() => {
    if (canvasRef.current) {
      if (drawCanvas.current) {
        drawCanvas.current.dispose();
      }
      drawCanvas.current = new fabric.Canvas(canvasRef.current);

      const img = new Image();
      img.onload = () => {
        const fabricImg = new fabric.Image(img);

        // 모달 내부의 캔버스 크기를 모달 높이의 70%, 너비의 80%로 설정
        const modalHeight = window.innerHeight * 0.7; // 모달 높이의 70%
        const modalWidth = window.innerWidth * 0.8; // 모달 너비의 80%
        const imgAspectRatio = img.width / img.height;

        let canvasWidth, canvasHeight;

        if (imgAspectRatio > 1) {
          // 이미지가 가로로 더 긴 경우
          canvasWidth = modalWidth;
          canvasHeight = modalWidth / imgAspectRatio;
        } else {
          // 이미지가 세로로 더 긴 경우
          canvasHeight = modalHeight;
          canvasWidth = modalHeight * imgAspectRatio;
        }

        drawCanvas.current.setWidth(canvasWidth);
        drawCanvas.current.setHeight(canvasHeight);
        drawCanvas.current.setZoom(canvasWidth / img.width);

        drawCanvas.current.setBackgroundImage(fabricImg, drawCanvas.current.renderAll.bind(drawCanvas.current));

        // 모달이 열리면 브러쉬가 자동으로 선택되도록 호출
        handleBrushSelect();
      };
      img.src = imageSrc;

      window.addEventListener('resize', resizeCanvasToFit);

      // 키보드 이벤트 추가
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Delete' || event.key === 'Backspace') {
          const activeObjects = drawCanvas.current.getActiveObjects();
          if (activeObjects.length > 0) {
            activeObjects.forEach((obj) => {
              drawCanvas.current.remove(obj);
            });
            drawCanvas.current.discardActiveObject(); // 선택을 해제
            drawCanvas.current.renderAll();
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);

      return () => {
        window.removeEventListener('resize', resizeCanvasToFit);
      };
    }
  }, [imageSrc, drawCanvas, resizeCanvasToFit]);

  // 선택을 초기화하는 함수
  const resetSelection = useCallback(() => {
    drawCanvas.current.isDrawingMode = false;
    drawCanvas.current.selection = false;
    drawCanvas.current.off('mouse:down');

    const objectsToRemove = drawCanvas.current.getObjects().filter((obj) => {
      return obj.type === 'circle' && obj.fill === 'rgba(56, 189, 248, 0.9)';
    });

    objectsToRemove.forEach((obj) => {
      drawCanvas.current.remove(obj);
    });

    drawCanvas.current.forEachObject((obj) => {
      obj.selectable = false;
    });

    drawCanvas.current.renderAll();
  }, [drawCanvas]);

  // 폴리곤 선택 도구를 처리하는 함수
  const handlePolygonSelect = useCallback(() => {
    resetSelection();
    if (drawType !== 'LASSO_DRAW') {
      setDrawType('LASSO_DRAW');
      drawCanvas.current.isDrawingMode = false;

      drawCanvas.current.defaultCursor = 'crosshair';

      const newLassos = [...lassos];
      const curIndex = newLassos.length;
      newLassos.push([]);
      setLassos(newLassos);
      setActiveIndex({ lassoIndex: curIndex, pointIndex: -1 });

      drawCanvas.current.off('mouse:down');
      drawCanvas.current.on('mouse:down', function (options) {
        const pointer = drawCanvas.current.getPointer(options.e);
        newLassos[curIndex].push({ x: pointer.x, y: pointer.y });

        const pointIndicator = new fabric.Circle({
          left: pointer.x,
          top: pointer.y,
          radius: RADIUS,
          fill: 'rgba(56, 189, 248, 0.9)',
          selectable: false
        } as any);
        (pointIndicator as any).lassoIndex = curIndex;
        drawCanvas.current.add(pointIndicator);

        if (newLassos[curIndex].length > 2) {
          clearPreviousElements(drawCanvas.current, curIndex);
          drawContour(drawCanvas.current, newLassos[curIndex]);
          drawControlPoints(drawCanvas.current, newLassos[curIndex]);
        }

        setLassos(newLassos);
        setActiveIndex({ lassoIndex: curIndex, pointIndex: -1 });
      });
    } else {
      setDrawType('NONE');
      drawCanvas.current.defaultCursor = 'default';
      drawCanvas.current.off('mouse:down');
    }
  }, [setDrawType, drawCanvas, drawType, lassos, setLassos, setActiveIndex, resetSelection]);

  // 브러쉬 선택 도구를 처리하는 함수
  const handleBrushSelect = useCallback(() => {
    resetSelection();
    if (drawType !== 'FREE_DRAW') {
      setDrawType('FREE_DRAW');
      drawCanvas.current.isDrawingMode = true;

      const brush = new fabric.PencilBrush(drawCanvas.current);
      brush.width = penWidth;
      brush.color = DEFAULT_COLOR;

      drawCanvas.current.freeDrawingBrush = brush;
    } else {
      setDrawType('NONE');
      drawCanvas.current.isDrawingMode = false;
    }
  }, [setDrawType, drawCanvas, penWidth, drawType, resetSelection]);

  // 객체 선택 도구를 처리하는 함수
  const handleObjectSelect = useCallback(() => {
    resetSelection();
    if (drawType !== 'OBJECT_SELECT') {
      setDrawType('OBJECT_SELECT');
      drawCanvas.current.isDrawingMode = false;
      drawCanvas.current.selection = true;

      drawCanvas.current.forEachObject((obj) => {
        obj.selectable = true;
        obj.evented = true;

        obj.on('mousedown', function () {
          drawCanvas.current.defaultCursor = 'move';
        });

        obj.setControlsVisibility({
          mt: true,
          mb: true,
          ml: true,
          mr: true,
          bl: true,
          br: true,
          tl: true,
          tr: true,
          mtr: true
        });

        obj.set({
          hoverCursor: 'move',
          cornerStyle: 'circle',
          cornerColor: 'blue',
          borderColor: 'blue',
          cornerSize: 12,
          transparentCorners: false,
          rotatingPointOffset: 20
        });
      });

      drawCanvas.current.on('selection:cleared', function () {
        drawCanvas.current.defaultCursor = 'default';
      });
    } else {
      setDrawType('NONE');
      drawCanvas.current.selection = false;
      drawCanvas.current.defaultCursor = 'default';
    }
  }, [setDrawType, drawCanvas, drawType, resetSelection]);

  // 캔버스를 흑백으로 변환하는 함수
  const convertCanvasToBlackAndWhite = (canvas: fabric.Canvas): string => {
    // 임시 캔버스를 생성하여 그 위에 그림
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    const canvasWidth = canvas.getWidth();
    const canvasHeight = canvas.getHeight();

    tempCanvas.width = canvasWidth;
    tempCanvas.height = canvasHeight;

    // 임시 캔버스를 검은색으로 채움
    tempCtx.fillStyle = 'black';
    tempCtx.fillRect(0, 0, canvasWidth, canvasHeight);

    // 원래 캔버스에서 객체들을 임시 캔버스에 흰색으로 그림
    canvas.getObjects().forEach((obj) => {
      const clone = fabric.util.object.clone(obj);
      clone.set({
        fill: 'white',
        stroke: 'white',
        strokeWidth: obj.strokeWidth || 0,
        opacity: obj.opacity || 1,
        globalCompositeOperation: 'source-atop'
      });

      // 임시 캔버스에 클론을 렌더링
      const cloneCanvas = document.createElement('canvas');
      cloneCanvas.width = canvasWidth;
      cloneCanvas.height = canvasHeight;
      const cloneCtx = cloneCanvas.getContext('2d')!;

      clone.render(cloneCtx);
      tempCtx.drawImage(cloneCanvas, 0, 0);
    });

    // 임시 캔버스의 데이터 URL을 반환
    return tempCanvas.toDataURL('image/png');
  };

  // 적용 버튼을 눌렀을 때의 처리 함수
  const handleApply = useCallback(() => {
    if (drawCanvas.current) {
      const canvasWidth = drawCanvas.current.getWidth();
      const canvasHeight = drawCanvas.current.getHeight();
      const zoom = drawCanvas.current.getZoom();

      // 최종 결과를 렌더링하기 위한 오프스크린 캔버스를 생성
      const offscreenCanvas = document.createElement('canvas');
      offscreenCanvas.width = canvasWidth;
      offscreenCanvas.height = canvasHeight;
      const offscreenCtx = offscreenCanvas.getContext('2d');

      if (offscreenCtx) {
        // 오프스크린 캔버스를 지움
        offscreenCtx.clearRect(0, 0, canvasWidth, canvasHeight);

        // 현재 줌 레벨을 임시로 적용
        offscreenCtx.scale(zoom, zoom);

        // fabric 캔버스를 오프스크린 캔버스에 렌더링
        drawCanvas.current.renderAll();

        drawCanvas.current.getObjects().forEach((obj) => {
          const clone = fabric.util.object.clone(obj);

          // 각 객체를 오프스크린 컨텍스트에 렌더링
          clone.set({
            globalCompositeOperation: 'source-over'
          });

          // 클론을 오프스크린 컨텍스트에 렌더링
          clone.render(offscreenCtx);
        });

        // 배경 이미지를 처리
        const backgroundImg = drawCanvas.current.backgroundImage as fabric.Image;
        if (backgroundImg) {
          const backgroundImgUrl = backgroundImg.getSrc();
          setImageDownloadUrl(backgroundImgUrl); // 배경 이미지 URL을 저장

          // 배경 이미지와 투명 객체를 결합하기 위한 최종 캔버스 생성
          const finalCanvas = document.createElement('canvas');
          finalCanvas.width = canvasWidth;
          finalCanvas.height = canvasHeight;
          const finalCtx = finalCanvas.getContext('2d');

          if (finalCtx) {
            const img = new Image();
            img.onload = () => {
              // 배경 이미지를 먼저 그림
              finalCtx.drawImage(img, 0, 0, canvasWidth, canvasHeight);

              // 투명 객체들을 그 위에 그림
              finalCtx.drawImage(offscreenCanvas, 0, 0);

              // 최종 캔버스를 데이터 URL로 변환하여 저장
              const finalImageDataUrl = finalCanvas.toDataURL('image/png');
              setMaskingResult(finalImageDataUrl); // 배경 이미지와 투명 객체를 결합한 이미지를 저장

              // 이제 오프스크린 캔버스를 흑백 변환 준비
              const imageData = offscreenCtx.getImageData(0, 0, canvasWidth, canvasHeight);
              const data = imageData.data;

              // 모든 픽셀을 순회하며 투명도에 따라 색상 변경
              for (let i = 0; i < data.length; i += 4) {
                const alpha = data[i + 3];

                if (alpha === 0) {
                  // 완전히 투명: 검은색으로 변경
                  data[i] = 0; // 빨간색
                  data[i + 1] = 0; // 초록색
                  data[i + 2] = 0; // 파란색
                  data[i + 3] = 255; // 완전 불투명
                } else {
                  // 불투명: 흰색으로 변경
                  data[i] = 255; // 빨간색
                  data[i + 1] = 255; // 초록색
                  data[i + 2] = 255; // 파란색
                  data[i + 3] = 255; // 완전 불투명
                }
              }

              // 수정된 이미지 데이터를 캔버스에 다시 넣음
              offscreenCtx.putImageData(imageData, 0, 0);

              // 오프스크린 캔버스를 데이터 URL로 변환하여 저장
              const canvasDataUrl = offscreenCanvas.toDataURL('image/png');
              setCanvasDownloadUrl(canvasDataUrl); // 흑백 버전을 저장 (투명 = 검은색, 색상 = 흰색)
            };
            img.src = backgroundImgUrl;
          }
        } else {
          // 배경 이미지가 없을 경우 투명 배경에 객체들만 저장
          const finalImageDataUrl = offscreenCanvas.toDataURL('image/png');
          setMaskingResult(finalImageDataUrl); // 캔버스 결과를 마스킹 결과로 저장
          setCanvasDownloadUrl(finalImageDataUrl); // 캔버스 다운로드 URL 업데이트
          setImageDownloadUrl(''); // 배경 이미지 없음
        }

        onClose(); // 모달을 닫음
      }
    }
  }, [drawCanvas, setCanvasDownloadUrl, setImageDownloadUrl, setMaskingResult, onClose]);

  // 캔버스를 초기화하는 함수
  const handleClearCanvasClick = useCallback(() => {
    const background = drawCanvas.current.backgroundImage;

    drawCanvas.current.clear();
    drawCanvas.current.setBackgroundImage(background, drawCanvas.current.renderAll.bind(drawCanvas.current));

    setLassos([]);
    setActiveIndex({ lassoIndex: -1, pointIndex: -1 });
    handleBrushSelect(); // Clear 후 브러쉬 모드 선택
  }, [drawCanvas, setLassos, setActiveIndex, handleBrushSelect]);

  // 펜 크기를 변경하는 함수
  const handlePenWidthChange = useCallback(
    (value: number) => {
      setPenWidth(value);
      if (drawCanvas.current && drawCanvas.current.isDrawingMode) {
        drawCanvas.current.freeDrawingBrush.width = value;
      }
    },
    [setPenWidth, drawCanvas]
  );

  return (
    <Modal
      open={true}
      onCancel={onClose}
      footer={null} // 기본 푸터 제거하여 추가 버튼 방지
      width="90vw"
      style={{ top: 20 }} // 필요한 경우 위치 조정을 위한 인라인 스타일 사용
      styles={{ body: { height: '85vh', padding: 0 } }} // Body 스타일로 높이 조정 포함
    >
      <div className="h-[85vh] flex flex-col py-4 px-8">
        <div className="flex-1 flex justify-center items-center">
          <canvas ref={canvasRef} className="border border-gray-300" />
        </div>
        <div className="h-[60px] flex items-center">
          {' '}
          {/* 하단 도구 영역의 높이를 60px로 고정 */}
          <div style={{ marginLeft: 10 }}>
            <div className="flex items-center mr-8">
              <p className="text-[16px]">Brush Size:</p>
              <Slider
                min={1}
                max={50}
                step={1}
                value={penWidth}
                onChange={handlePenWidthChange}
                style={{ width: 200, margin: '0 10px' }}
              />
              <InputNumber
                min={1}
                max={50}
                step={1}
                value={penWidth}
                onChange={handlePenWidthChange}
                style={{ width: 80 }}
              />
            </div>
          </div>
          <Tooltip title="Brush">
            <Button
              icon={<IoBrush className="w-[20px] h-[20px]" />}
              onClick={handleBrushSelect}
              type={drawType === 'FREE_DRAW' ? 'primary' : 'default'}
              className="ml-4 p-2 flex items-center justify-center"
            />
          </Tooltip>
          <Tooltip title="Polygon">
            <Button
              icon={<PiPolygonBold className="w-[20px] h-[20px]" />}
              onClick={handlePolygonSelect}
              type={drawType === 'LASSO_DRAW' ? 'primary' : 'default'}
              className="ml-4 p-2 flex items-center justify-center"
            />
          </Tooltip>
          <Tooltip title="Select">
            <Button
              icon={<GrSelect className="w-[20px] h-[20px]" />}
              onClick={handleObjectSelect}
              type={drawType === 'OBJECT_SELECT' ? 'primary' : 'default'}
              className="ml-4 p-2 flex items-center justify-center"
            />
          </Tooltip>
          <Button key="clear" onClick={handleClearCanvasClick} className="ml-auto text-[16px] w-[80px] h-[35px]">
            Clear
          </Button>
          <Button key="apply" type="primary" onClick={handleApply} className="ml-2 text-[16px] w-[80px] h-[35px]">
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default InpaintingModal;
