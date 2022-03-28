import React, { Context } from 'react';
import { useObserver } from 'mobx-react-lite';

import { storeContext } from '../store/context';

import { TStore } from '../store/store';

export const useStoreData = <Selection, ContextData, Store>(
  context: Context<ContextData>,
  storeSelector: (contextData: ContextData) => Store,
  dataSelector: (store: Store) => Selection,
) => {
  const value = React.useContext(context);
  if (!value) {
    throw new Error();
  }
  const store = storeSelector(value);
  return useObserver(() => {
    return dataSelector(store);
  });
};

export const useRootData = <Selection>(dataSelector: (store: TStore) => Selection) =>
  useStoreData(storeContext, contextData => contextData!, dataSelector);
