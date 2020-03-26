import AsyncStorage from '@react-native-community/async-storage';
import {persistReducer} from 'redux-persist';

export default reducers => {
  const persistedReducer = persistReducer(
    {
      key: 'simples',
      storage: AsyncStorage,
      whitelist: ['auth', 'user'], // informar apenas reducers que devem ser armazenados
    },
    reducers,
  );

  return persistedReducer;
};
