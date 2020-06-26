import {Platform} from 'react-native';
import styled from 'styled-components';
import Button from '~/components/Button';

export const Container = styled.KeyboardAvoidingView.attrs({
  enabled: Platform.OS === 'ios',
  behavior: 'padding',
})`
  flex: 1px;
  justify-content: center;
  margin: 0 10px;
`;

export const ViewText = styled.View`
  position: absolute;
  top: 10;
  flex-direction: column;
  align-self: center;
  align-content: center;
  width: 95%;
`;

export const Title = styled.Text`
  margin-top: 60px;
  font-size: 30px;
  color: #333;
`;

export const Message = styled.Text`
  margin-top: 10px;
  font-size: 16px;
  color: #333;
`;

export const ViewPoint = styled.View`
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 10px;
  padding-bottom: 30px;
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const ViewTextArea = styled.KeyboardAvoidingView.attrs({
  enabled: Platform.OS === 'ios',
  behavior: 'padding',
})`
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 0 10px;
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const Text = styled.Text`
  font-size: 15px;
  color: ${(props) => (props.color ? props.color : '#00FF40')};
  margin: 10px;
  align-self: flex-start;
`;

export const TitleView = styled.Text`
  flex-wrap: wrap;

  color: #333;
  height: 30px;
  align-self: center;
`;

export const Point = styled.View`
  background: ${(props) => (props.rgb ? props.rgb : 'rgba(255, 143, 53, 0.3)')};
  width: 150px;
  height: 150px;
  border-radius: 75px;
  align-self: center;
  margin-top: 15px;
  align-content: center;
`;

export const PoinText = styled.Text`
  margin: 0;
  padding-top: 20%;
  font-size: 60px;
  color: ${(props) => (props.color ? props.color : '#00FF40')};
  align-self: center;
  align-content: center;
  font-weight: bold;
`;

export const SubmitButton = styled(Button)`
  margin: 1px;
`;

export const Separator = styled.View`
  height: 1px;
  width: 360px;
  background: #ccc;
  margin: 30px 0 0 -10px;
`;

export const SimpleView = styled.View`
  position: absolute;
  bottom: 0;
  padding: 10px;
  margin: 10px;
  width: 95%;
  background: #fff;
  border-radius: 8px;
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const SimpleViewButton = styled.View`
  position: absolute;
  bottom: 80;
  padding: 10px;
  margin: 10px;
  width: 95%;
  background: #fff;
  border-radius: 8px;
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const ViewModal = styled.View`
  margin: 0 0 20px;
  padding: 20px;
  align-content: center;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const ButtonClose = styled.Text`
  font-size: 17px;
  color: #000;
  margin: -10px -10px 5px 0;
  align-self: flex-end;
`;
