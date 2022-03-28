import { IAnalizeChartData, IImage } from '../../Types/Common';

export interface IImageCropProps {
  data: IAnalizeChartData[] | undefined;
  id: string;
  selectedImage: IImage | undefined;
  setData: React.Dispatch<React.SetStateAction<IAnalizeChartData[] | undefined>>;
  setSelectedImage: React.Dispatch<React.SetStateAction<IImage | undefined>>;
  setSrc: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
  setType: React.Dispatch<React.SetStateAction<string>>;
  setTypeResult: React.Dispatch<React.SetStateAction<{ [key: string]: string } | undefined>>;
  setRepresentationType: React.Dispatch<React.SetStateAction<string>>;
  representationType: string;
  src: string | ArrayBuffer | null;
  type: string;
}
