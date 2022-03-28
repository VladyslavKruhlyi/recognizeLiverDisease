import { IMenu } from './Types';

export const ADMIN_MENU: IMenu[] = [
  {
    children: [
      { title: 'Всі лікарі', path: '/admin/docktors' },
      { title: 'Зарееструвати лікаря', path: '/admin/add-docktor' },
    ],
    icon: 'user-add',
    title: 'Лікарі',
  },
  { icon: 'team', path: '/admin/patients', title: 'Пацієнти' },
];

export const DOCKTOR_MENU: IMenu[] = [
  { icon: 'user-add', path: '/doctor/add-patient', title: 'Додати пацієнта' },
  { icon: 'team', path: '/doctor/patients', title: 'Пацієнти' },
  { icon: 'snippets', path: '/doctor/images/all', title: 'Знімки' },
];
