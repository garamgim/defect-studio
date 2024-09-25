import { useSelector } from 'react-redux';
import { RootState } from '../../../store/store';

const CleanupDisplay = () => {
  const { output } = useSelector((state: RootState) => state.inpainting);

  return (
    <div className="h-full image-display grid gap-4 overflow-y-auto custom-scrollbar2">
      {output.outputImgs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mr-[16px]">
          {output.outputImgs.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Generated image ${index}`}
              className="w-full h-auto object-cover rounded-xl border border-gray-300 dark:border-gray-700"
            />
          ))}
        </div>
      ) : (
        <p>No images generated yet.</p>
      )}
    </div>
  );
};

export default CleanupDisplay;
