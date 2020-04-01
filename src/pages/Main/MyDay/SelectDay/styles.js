import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const List = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {paddingLeft: 5},
})`
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin: 0 30px;
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const ContainerRadio = styled.View`
  flex-direction: row;
  align-self: flex-start;
  align-content: stretch;
`;

export const Name = styled.Text`
  color: #333;
  font-size: 15px;
  text-align: left;
  margin: 5px 5px 20px;
  height: auto;
  width: 100%;
  align-self: flex-start;
`;

export const HelloName = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

export const ButtonName = styled.Text`
  font-size: 17px;
  color: #000;
  margin: 10px 10px 0 13px;
`;

export const Separator = styled.Text`
  color: #333;
  text-align: center;
  margin: 20px 0 20px -20px;
`;

export const Total = styled.View`
  width: 300px;
  flex-direction: column;
  align-self: center;
  align-content: center;
  border: solid 3px;
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin: 30px;
`;

export const TotalText = styled.Text`
  color: #333;
  text-align: center;
  font-size: 20px;
  margin-top: 10px;
  font-weight: bold;
`;

export const TotalValue = styled.Text`
  color: #ffbf00;
  text-align: center;
  font-size: 50px;
  font-weight: bold;
  margin: 15px;
`;

export const SubmitButton = styled(Button)`
  margin: 5px 25px;
`;
