import React, {useState, useEffect} from 'react';
import {Keyboard} from 'react-native';
import {useSelector, useDispatch} from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import Background from '~/components/Background';
import {signUpPassword} from '~/store/modules/auth/actions';
import {Container, Form, FormInput, SubmitButton, TitleView} from './styles';

export default function Password({navigation}) {
  useEffect(() => {
    this._willFocusSubscription = navigation.addListener(
      'willFocus',
      (payload) => {
        // lock to portrait when this screen is about to appear
        Orientation.lockToPortrait();
      },
    );
  }, [navigation]);
  const dispatch = useDispatch();
  const [email, setEmail] = useState(navigation.getParam('email'));
  const [code, setCode] = useState(navigation.getParam('code'));
  const [password, setPassword] = useState('');

  const loading = useSelector((state) => state.auth.loading);

  handleSubmit = async () => {
    dispatch(signUpPassword(email, password, code));
    Keyboard.dismiss();
  };

  return (
    <Background>
      <Container>
        <TitleView>Nova senha</TitleView>
        <Form>
          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Digite sua senha"
            returnKeyType="send"
            onSubmitEditing={this.handleSubmit}
            value={password}
            onChangeText={setPassword}
          />

          <SubmitButton loading={loading} onPress={this.handleSubmit}>
            Confirmar
          </SubmitButton>
        </Form>
      </Container>
    </Background>
  );
}
