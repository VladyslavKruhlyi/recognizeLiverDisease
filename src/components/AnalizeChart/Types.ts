import { IAnalizeChartData } from '../../Types/Common';

export interface IAnalizeChartProps {
  data: IAnalizeChartData[];
  typeResult: { [key: string]: string };
}
