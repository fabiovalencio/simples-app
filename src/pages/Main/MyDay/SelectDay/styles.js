import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const List = styled.ScrollView.attrs({
  bounces: false,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {paddingLeft: 5},
  alwaysBounceVertical: false,
})`
  padding: 10px;
  margin: 10px;
  background: #fff;
  border-radius: 8px;
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
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

export const ViewButton = styled.View`
  flex-direction: row;
  margin: 30px 2% 20px 2%;
  align-content: center;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const LeftButton = styled.TouchableOpacity`
  padding: 0 20px;
  height: 46px;
  width: 15%;
  left: 0;
  margin-left: 1px;

  background: #fff;
  flex-direction: row;
  align-items: center;
  border-bottom-left-radius: 8px;
  border-top-left-radius: 8px;
`;

export const RightButton = styled.TouchableOpacity`
  padding: 0 20px;
  height: 46px;
  width: 15%;
  right: 0;
  margin-left: -1px;
  background: #fff;
  flex-direction: row;
  align-items: center;
  border-bottom-right-radius: 8px;
  border-top-right-radius: 8px;
`;

export const DateButton = styled.TouchableOpacity`
  height: 46px;
  padding-top: 12px;
  width: 70%;
  background: #fff;
  flex-direction: column;
  align-items: center;
  align-self: center;
`;

export const DateText = styled.Text`
  font-size: 14px;
  color: #3b9eff;
  margin: 0 15px;
  width: 100%;
`;

export const ViewModal = styled.View`
  margin: 0 0 20px;
  align-content: center;
  align-items: center;
`;

export const WorkoutModal = styled.View`
  margin: 0 0 20px;
  padding: 20px;
  align-content: center;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  flex: 1;
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const Text = styled.Text`
  color: #333;
  font-size: 13px;
  text-align: left;
  margin: -10px 5px;
  width: 100%;
`;

export const ButtonClose = styled.Text`
  font-size: 17px;
  color: #000;
  margin: -10px -10px 5px 0;
  align-self: flex-end;
`;
