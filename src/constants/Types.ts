export interface IMenu {
  children?: ISubMenu[];
  icon: string;
  path?: string;
  title: string;
}

export interface ISubMenu {
  path: string;
  title: string;
}
