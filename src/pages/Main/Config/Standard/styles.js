import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.View`
  padding: 10px 30px 10px 25px;
  margin-left: -15px;
  margin-right: -15px;
  margin-bottom: -20px;
  background: #fff;
  border-radius: 8px;
  flex: 1;
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const Title = styled.Text`
  font-size: 17px;
  color: #333;
  margin: 15px;
  align-self: center;
`;

export const SubTitle = styled.Text`
  font-size: 13px;
  color: #333;
  margin: 15px;
  align-self: center;
`;

export const View = styled.View`
  margin: 50px 0 0 10px;
`;

export const VInput = styled.View`
  flex-direction: row;
`;

export const VTitle = styled.Text`
  font-size: 18px;
  font-weight: bold;
  margin: 20px 0 0 10px;
  color: #333;
`;

export const TInput = styled.TextInput.attrs({
  placeholderTextColor: 'rgba(59, 89, 152, 0.8)',
})`
  padding-left: 10px;
  flex: 1;
  font-size: 15px;
  margin: 10px;
  align-self: flex-end;
  height: 50px;
  border: ${(props) => (props.border ? '1px solid #ccc' : 'none')};
`;

export const SubmitButton = styled(Button)`
  margin: 5px 25px;
`;
