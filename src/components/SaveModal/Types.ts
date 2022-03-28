import { IImage } from '../../Types/Common';

export interface ISaveModalProps {
  id: string;
  link: string;
  title: string;
  visible: boolean;
  onCancel?: ((e: React.MouseEvent<HTMLElement, MouseEvent>) => void) | undefined;
  openModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSelectedImage: React.Dispatch<React.SetStateAction<IImage | undefined>>;
  setSrc: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
  setType: React.Dispatch<React.SetStateAction<string>>;
  type?: string;
  isCropped?: boolean;
}
