import { Link } from 'react-router-dom';
import { SelectBoxProps } from '../../types/home';

const AIToolBoxItem = ({ text, imageUrl, linkUrl }: SelectBoxProps) => {
  if (imageUrl && imageUrl !== '') {
  }
  return (
    <Link to={linkUrl}>
      <div className="relative bg-gray-600 rounded-md p-6 h-48 flex items-center justify-center">
        {imageUrl && imageUrl !== '' && (
          <img src={imageUrl} className="w-full h-full object-cover absolute inset-0 rounded-md" />
        )}
        <p className="text-white text-xl font-bold z-10 relative">{text}</p>
      </div>
    </Link>
  );
};

export default AIToolBoxItem;
