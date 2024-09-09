// import React, {
//   createContext,
//   useContext,
//   useState,
//   useRef,
//   ReactNode,
// } from "react";

// import * as fabric from 'fabric';

// type DRAW_TYPE = "FREE_DRAW" | "LASSO_DRAW" | "OBJECT_SELECT" | "NONE";

// interface Point {
//   x: number;
//   y: number;
// }

// interface FabricContextProps {
//   drawCanvas: React.MutableRefObject<fabric.Canvas | null>;
//   originImage: fabric.Image | null;
//   setOriginImage: React.Dispatch<React.SetStateAction<fabric.Image | null>>;
//   drawType: DRAW_TYPE;
//   setDrawType: React.Dispatch<React.SetStateAction<DRAW_TYPE>>;
//   penWidth: number;
//   setPenWidth: React.Dispatch<React.SetStateAction<number>>;
//   lassos: Point[][];
//   setLassos: React.Dispatch<React.SetStateAction<Point[][]>>;
//   activeIndex: { lassoIndex: number; pointIndex: number };
//   setActiveIndex: React.Dispatch<
//     React.SetStateAction<{ lassoIndex: number; pointIndex: number }>
//   >;
//   imageDownloadUrl: string | null;
//   canvasDownloadUrl: string | null;
//   maskingResult: string | null;
//   setImageDownloadUrl: React.Dispatch<React.SetStateAction<string | null>>;
//   setCanvasDownloadUrl: React.Dispatch<React.SetStateAction<string | null>>;
//   setMaskingResult: React.Dispatch<React.SetStateAction<string | null>>;
// }

// const FabricContext = createContext<FabricContextProps | null>(null);

// export const useFabric = () => {
//   const context = useContext(FabricContext);
//   if (context === null) {
//     throw new Error("useFabric must be used within a FabricProvider");
//   }
//   return context;
// };

// interface FabricProviderProps {
//   children: ReactNode;
// }

// export const FabricProvider: React.FC<FabricProviderProps> = ({ children }) => {
//   const [drawType, setDrawType] = useState<DRAW_TYPE>("NONE");
//   const [penWidth, setPenWidth] = useState<number>(5);
//   const [lassos, setLassos] = useState<Point[][]>([]);
//   const [activeIndex, setActiveIndex] = useState<{
//     lassoIndex: number;
//     pointIndex: number;
//   }>({
//     lassoIndex: -1,
//     pointIndex: -1,
//   });
//   const [originImage, setOriginImage] = useState<fabric.Image | null>(null);
//   const [imageDownloadUrl, setImageDownloadUrl] = useState<string | null>(null);
//   const [canvasDownloadUrl, setCanvasDownloadUrl] = useState<string | null>(
//     null
//   );
//   const [maskingResult, setMaskingResult] = useState<string | null>(null);

//   const drawCanvas = useRef<fabric.Canvas | null>(null);

//   const value = {
//     drawCanvas,
//     originImage,
//     setOriginImage,
//     drawType,
//     setDrawType,
//     penWidth,
//     setPenWidth,
//     lassos,
//     setLassos,
//     activeIndex,
//     setActiveIndex,
//     imageDownloadUrl,
//     canvasDownloadUrl,
//     maskingResult,
//     setImageDownloadUrl,
//     setCanvasDownloadUrl,
//     setMaskingResult,
//   };

//   return (
//     <FabricContext.Provider value={value}>{children}</FabricContext.Provider>
//   );
// };

// export default FabricContext;
