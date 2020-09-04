import {Alert} from 'react-native';
import {takeLatest, call, put, all} from 'redux-saga/effects';

import api from '~/services/api';

import {signInSuccess, signFailure} from './actions';

export function* signIn({payload}) {
  try {
    const {email, password} = payload;

    const response = yield call(api.post, 'session', {
      email,
      password,
    });

    const {token, user} = response.data;

    if (user.provider) {
      Alert.alert('Erro', 'Usuário não pode ser um prestador de serviço');
      return;
    }

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(signInSuccess(token, user));

    // history.push('/dashboard');
  } catch (err) {
    Alert.alert('Falha na autenticação', 'verifique seus dados \n' + err);
    yield put(signFailure());
  }
}

export function* signUp({payload}) {
  try {
    const {name, email, password, city, gender, date} = payload;

    const response = yield call(api.post, 'users', {
      name,
      email,
      password,
    });
    const {token, user} = response.data;
    api.defaults.headers.Authorization = `Bearer ${token}`;

    if (date && gender && city) {
      yield call(api.post, 'user-about', {
        user_id: user.id,
        birthday: date,
        gender_id: gender,
        city_id: city,
      });
    }

    yield call(api.post, 'user-week', {
      user_id: user.id,
    });

    yield put(signInSuccess(token, user));
  } catch (err) {
    Alert.alert('Falha no cadastro', err);
    yield put(signFailure());
  }
}

export function* setPassword({payload}) {
  try {
    const {email, password, code} = payload;

    const response = yield call(api.post, 'npassword', {
      code,
      email,
      password,
    });

    const {token, user} = response.data;

    api.defaults.headers.Authorization = `Bearer ${token}`;

    yield put(signInSuccess(token, user));
  } catch (err) {
    Alert.alert('Falha ao criar a senha', err);
    yield put(signFailure());
  }
}

export function setToken({payload}) {
  if (!payload) {
    return;
  }

  const {token} = payload.auth;

  if (token) {
    api.defaults.headers.Authorization = `Bearer ${token}`;
  }
}

export default all([
  takeLatest('persist/REHYDRATE', setToken),
  takeLatest('@auth/SIGN_IN_REQUEST', signIn),
  takeLatest('@auth/SIGN_UP_PASSWORD', setPassword),
  takeLatest('@auth/SIGN_UP_REQUEST', signUp),
]);
