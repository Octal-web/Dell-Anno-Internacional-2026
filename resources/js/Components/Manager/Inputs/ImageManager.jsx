import { useEffect, useState } from 'react';
import { router } from '@inertiajs/react';

export default function ImageManager({ onSelectImage }) {
    const [images, setImages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [currentFolder, setCurrentFolder] = useState('/');

    useEffect(() => {
        fetchImages(currentFolder);
    }, [currentFolder]);

    const fetchImages = (folder) => {
        router.get(route('Manager.Images.index'), 
            { folder: folder }, 
            {
                preserveState: true,
                onSuccess: (page) => {
                    setImages(page.props.images);
                    setIsLoading(false);
                },
                onError: () => {
                    setIsLoading(false);
                }
            }
        );
    };

    const handleUpload = (e) => {
        const files = e.target.files;
        if (!files.length) return;

        const formData = new FormData();
        formData.append('folder', currentFolder);
        
        for (let i = 0; i < files.length; i++) {
            formData.append('images[]', files[i]);
        }

        setUploading(true);
        
        router.post(route('Manager.Images.store'), formData, {
            onSuccess: (page) => {
                setImages(page.props.images);
                setUploading(false);
            },
              onError: () => {
                setUploading(false);
            },
            preserveScroll: true,
        });
    };

    const navigateToFolder = (folder) => {
        setCurrentFolder(folder);
    };

    const createFolder = () => {
        const folderName = prompt('Digite o nome da pasta:');
        if (!folderName) return;

        router.post(route('Manager.Images.create-folder'), {
            folder: currentFolder,
            name: folderName
        }, {
            onSuccess: () => {
                fetchImages(currentFolder);
            }
        });
    };

    return (
        <div className="image-manager">
            <div className="mb-4 flex items-center">
                <button 
                    onClick={() => navigateToFolder('/')}
                    className="px-3 py-1 bg-gray-200 rounded mr-2"
                >
                    Home
                </button>
                {currentFolder !== '/' && 
                    <span className="text-gray-600">/ {currentFolder.split('/').filter(Boolean).join(' / ')}</span>
                }
            </div>

            <div className="mb-4 flex gap-2">
                <label className="inline-block px-4 py-2 bg-blue-500 text-white rounded cursor-pointer">
                    Upload Imagens
                    <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleUpload}
                        disabled={uploading}
                    />
                </label>
                {uploading && <span className="ml-2 text-blue-500">Enviando...</span>}
                
                <button
                    onClick={createFolder}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                >
                    Nova Pasta
                </button>
            </div>

            {isLoading ? (
                <div className="text-center py-4">Carregando...</div>
            ) : (
                <div className="grid grid-cols-4 gap-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative group">
                            {image.type === 'folder' ? (
                                <div 
                                    className="p-3 bg-yellow-100 rounded cursor-pointer hover:bg-yellow-200 flex items-center"
                                    onClick={() => navigateToFolder(`${currentFolder}${image.name}/`)}
                                >
                                    <span className="text-sm">📁 {image.name}</span>
                                </div>
                            ) : (
                                <div 
                                    className="cursor-pointer hover:opacity-90"
                                    onClick={() => onSelectImage(image.url)}
                                >
                                    <img 
                                        src={image.thumbnail || image.url} 
                                        alt={image.name}
                                        className="w-full h-24 object-cover rounded"
                                    />
                                    <div className="mt-1 text-xs truncate">{image.name}</div>
                                </div>
                            )}
                        </div>
                    ))}
                      
                    {images.length === 0 && (
                        <div className="col-span-4 text-center text-gray-500 py-8">
                            Nenhuma imagem encontrada nesta pasta
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}