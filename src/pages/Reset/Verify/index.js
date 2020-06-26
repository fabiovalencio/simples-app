import React, {useState, useEffect} from 'react';
import {Keyboard, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import Background from '~/components/Background';
import api from '~/services/api';

import {Container, Form, FormInput, SubmitButton, TitleView} from './styles';

export default function Verify({navigation}) {
  useEffect(() => {
    this._willFocusSubscription = navigation.addListener(
      'willFocus',
      (payload) => {
        // lock to portrait when this screen is about to appear
        Orientation.lockToPortrait();
      },
    );
  }, [navigation]);

  const [email, setEmail] = useState(navigation.getParam('email'));
  const [code, setCode] = useState('');

  handleSubmit = async () => {
    const res = await api.post('code-password', {
      email,
      code,
    });
    if (res) {
      navigation.navigate('Password', {email, code});
    }
    Keyboard.dismiss();
  };

  return (
    <Background>
      <Container>
        <TitleView>Confirme o código</TitleView>
        <Form>
          <FormInput
            icon="code"
            keyboardType="number-pad"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu código"
            returnKeyType="send"
            onSubmitEditing={this.handleSubmit}
            value={code}
            onChangeText={setCode}
          />

          <SubmitButton onPress={this.handleSubmit}>Confirmar</SubmitButton>
        </Form>
      </Container>
    </Background>
  );
}
