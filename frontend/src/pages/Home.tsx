import Header from '../components/home/Header';
import ImagesFolderDetail from '../components/history/ImageFolderDetail';
import { useState } from 'react';
import { RootState } from '../store/store';
import { useSelector } from 'react-redux';

const Home = () => {
  const folders = useSelector((state: RootState) => state.history.folders);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const openModal = (id: string) => {
    if (id) {
      setSelectedFolderId(id);
      setIsModalVisible(true);
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedFolderId(null);
  };

  return (
    <div className="bg-white dark:bg-gray-800">
      <header>
        <Header />
      </header>

      <main className="py-16 px-16 pb-32">
        <p className="mt-4 mb-4 text-[24px] font-semibold dark:text-gray-300">Assets</p>
        <p className="mb-10 text-[18px] dark:text-gray-300">Browse and Utilize Your Custom-Generated Images</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="relative w-full h-0 pt-[100%] rounded-3xl bg-cover bg-center cursor-pointer group"
              style={{
                backgroundImage: `url(${folder.firstImg})`
              }}
              onClick={() => openModal(folder.id)}
            >
              {/* 마우스 호버할 때 */}
              <div className="absolute p-8 flex justify-between inset-0 bg-black bg-opacity-60 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl p-4">
                <p className="text-white mb-12 text-[14px] font-semibold">{folder.type}</p>
                <p className="text-white text-[18px] overflow-hidden text-ellipsis line-clamp-6">{folder.prompt}</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 모달 */}
      {isModalVisible && <ImagesFolderDetail folderId={selectedFolderId} onClose={closeModal} />}
    </div>
  );
};

export default Home;
