import { useRef } from 'react';
import { Button } from './ui/button';
import { Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  onImageSelected: (file: File) => void;
  disabled?: boolean;
}

export function ImageUploader({ onImageSelected, disabled }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageSelected(file);
    }
    // Reset value to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input type='file' accept='image/*' className='hidden' ref={fileInputRef} onChange={handleChange} disabled={disabled} />
      <Button variant='outline' size='icon' onClick={handleClick} disabled={disabled} title='Upload Image'>
        <ImageIcon className='h-4 w-4' />
      </Button>
    </>
  );
}
