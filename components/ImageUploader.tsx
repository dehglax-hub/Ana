import React, { useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  label: string;
  subLabel?: string;
  image: ImageFile | null;
  onUpload: (file: File) => void;
  onRemove: () => void;
  id: string;
  required?: boolean;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  label,
  subLabel,
  image,
  onUpload,
  onRemove,
  id,
  required
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  const triggerUpload = () => {
    inputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="flex justify-between items-baseline">
        <label htmlFor={id} className="text-sm font-semibold text-slate-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {subLabel && <span className="text-xs text-slate-500">{subLabel}</span>}
      </div>
      
      <input
        type="file"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/jpg, image/webp"
        id={id}
      />

      {!image ? (
        <div 
          onClick={triggerUpload}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className="border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all h-64 group bg-white shadow-sm"
        >
          <div className="bg-indigo-50 group-hover:bg-white p-4 rounded-full mb-3 transition-colors duration-300 shadow-sm">
            <Upload className="w-8 h-8 text-indigo-600" />
          </div>
          <p className="text-sm font-medium text-slate-700 text-center">Click to upload or drag & drop</p>
          <p className="text-xs text-slate-400 mt-2 text-center">PNG, JPG (Max 5MB)</p>
        </div>
      ) : (
        <div className="relative rounded-xl overflow-hidden border border-slate-200 h-64 bg-slate-50 group shadow-md">
          <img 
            src={image.previewUrl} 
            alt="Preview" 
            className="w-full h-full object-contain p-4"
          />
          <div className="absolute inset-0 bg-slate-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-full backdrop-blur-md border border-white/20 transition-all hover:scale-110 active:scale-95"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};