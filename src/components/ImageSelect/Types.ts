import { IAnalizeChartData, IImage } from '../../Types/Common';

export interface IImageSelectProps {
  id: string;
  setData: React.Dispatch<React.SetStateAction<IAnalizeChartData[] | undefined>>;
  setSelectedImage: React.Dispatch<React.SetStateAction<IImage | undefined>>;
  setSrc: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>;
  setType: React.Dispatch<React.SetStateAction<string>>;
}
