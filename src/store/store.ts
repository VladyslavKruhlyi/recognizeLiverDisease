import { observable } from 'mobx';

import { IAnalize, IImage, IPatient } from '../Types/Common';

export const createStore = () => {
  const store = {
    analizes: observable.box<IAnalize[]>([]),
    images: observable.box<IImage[]>([]),
    doctorId: observable.box<string>(''),
    patients: observable.box<IPatient[]>([]),

    setAnalizes(analizes: IAnalize[]): void {
      this.analizes.set(analizes);
    },

    setImages(images: IImage[]): void {
      this.images.set(images);
    },

    setDoctor(doctor: string): void {
      this.doctorId.set(doctor);
    },

    setPatients(patients: IPatient[]): void {
      this.patients.set(patients);
    },
  };

  return store;
};

export type TStore = ReturnType<typeof createStore>;
