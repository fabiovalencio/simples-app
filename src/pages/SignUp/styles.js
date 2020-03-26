import {Platform} from 'react-native';
import styled from 'styled-components/native';

import Input from '../../components/Input';
import Button from '../../components/Button';

export const Container = styled.KeyboardAvoidingView.attrs({
  enabled: Platform.OS === 'ios',
  behavior: 'padding',
})`
  flex: 1px;
  justify-content: center;
  align-items: center;
  padding: 0 30px;
`;

export const Form = styled.View`
  align-self: stretch;
  margin-top: 50px;
`;

export const FormInput = styled(Input)`
  margin-bottom: 10px;
`;

export const SubmitButton = styled(Button)`
  margin-top: 5px;
`;

export const SignLink = styled.TouchableOpacity`
  margin-top: 20px;
  align-self: center;
`;

export const SignLinkText = styled.Text`
  color: #3b5998;
  font-weight: bold;
  font-size: 16px;
`;

export const Stretch = styled.Image`
  width: 150px;
  height: 150px;
`;

export const Separator = styled.View`
  height: 1px;
  background: rgba(59, 89, 152, 0.2);
  margin: 20px 0 30px;
`;

export const DateButton = styled.TouchableOpacity`
  padding: 0 15px;
  height: 46px;
  background: rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  margin-bottom: 10px;
  flex-direction: row;
  align-items: center;
`;

export const DateText = styled.Text`
  font-size: 14px;
  color: #3b5998;
  margin-left: 15px;
  align-self: center;
`;

export const Picker = styled.View`
  background: #fff;
  position: relative;
  justify-content: flex-end;
`;
