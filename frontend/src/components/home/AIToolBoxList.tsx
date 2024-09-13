import AIToolBoxItem from './AIToolBoxItem';

const AIToolList = [
  {
    text: 'Text To Image',
    imageUrl: '',
    linkUrl: 'generation/text-to-image'
  },
  {
    text: 'Remove Background',
    imageUrl: '',
    linkUrl: 'generation/remove-bg'
  },
  {
    text: 'Cleanup',
    imageUrl: '',
    linkUrl: 'generation/cleanup'
  },
  {
    text: 'Image To Image',
    imageUrl: '',
    linkUrl: 'generation/image-to-image'
  },
  {
    text: 'Inpainting',
    imageUrl: '',
    linkUrl: 'generation/inpainting'
  }
];

const AIToolBoxList = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 md:mt-12 px-4 md:px-10">
      {AIToolList.map((item, index) => (
        <AIToolBoxItem key={index} {...item} />
      ))}
    </div>
  );
};

export default AIToolBoxList;
