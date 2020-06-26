import React, {useState, useEffect} from 'react';
import {Keyboard, Alert} from 'react-native';
import {useSelector} from 'react-redux';
import Orientation from 'react-native-orientation-locker';
import Background from '~/components/Background';
import api from '~/services/api';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  TitleView,
  SignLink,
  SignLinkText,
} from './styles';

export default function Reset({navigation}) {
  useEffect(() => {
    this._willFocusSubscription = navigation.addListener(
      'willFocus',
      (payload) => {
        // lock to portrait when this screen is about to appear
        Orientation.lockToPortrait();
      },
    );
  }, [navigation]);

  const [email, setEmail] = useState('');

  handleSubmit = async () => {
    try {
      const res = await api.post('reset-password', {
        email,
      });

      if (res) {
        Alert.alert('', res.data.message);
        navigation.navigate('Verify', {email});
      }
      Keyboard.dismiss();
    } catch (error) {
      Alert.alert('', error);
    }
  };

  return (
    <Background>
      <Container>
        <TitleView>Recuperar senha</TitleView>
        <Form>
          <FormInput
            icon="mail-outline"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            returnKeyType="send"
            onSubmitEditing={this.handleSubmit}
            value={email}
            onChangeText={setEmail}
          />

          <SubmitButton onPress={this.handleSubmit}>Enviar</SubmitButton>
          <SignLink onPress={() => navigation.navigate('SignIn')}>
            <SignLinkText>Voltar</SignLinkText>
          </SignLink>
        </Form>
      </Container>
    </Background>
  );
}
