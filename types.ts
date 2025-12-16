export interface ImageFile {
  file: File;
  previewUrl: string;
  base64: string;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  resultImage: string | null;
}

export enum UploadType {
  MAIN_LOGO = 'MAIN_LOGO',
  FONT_REF = 'FONT_REF'
}