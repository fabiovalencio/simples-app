import styled from 'styled-components/native';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView.attrs({
  interactivePopGestureEnabled: false,
})`
  flex: 1;
`;

export const View = styled.View`
  margin: 30px 0 20px;
  align-content: center;
  align-items: center;
  background: #fff;
  border-radius: 8px;
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const ViewModal = styled.View`
  margin: 30px 0 20px;
  align-content: center;
  align-items: center;
`;

export const DateButton = styled.TouchableOpacity`
  padding: 0 15px;
  height: 46px;
  background: #fff;
  flex-direction: row;
  align-items: center;
  border-radius: 8px;
`;

export const DateText = styled.Text`
  font-size: 14px;
  color: #3b9eff;
  margin-left: 15px;
`;

export const ViewPoint = styled.View`
  display: ${(props) => (props.display ? props.display : 'none')};
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  flex-direction: column;
  align-self: center;
  align-content: center;
  /* border: solid 3px; */
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 390px;
  height: 300px;
  margin: 0 10px;
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const Closed = styled.View`
  align-self: center;
  align-content: center;
  /* border: solid 3px; */
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 350px;
  height: 300px;
  margin: 50% 30px;
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const ClosedName = styled.Text`
  color: #333;
  font-size: 15px;
  text-align: left;
  margin: 50px 5px 20px;
  height: 100px;
  width: 100%;
  align-self: flex-start;
`;

export const ClosedHelloName = styled.Text`
  font-size: 20px;
  font-weight: bold;
`;

export const ClosedView = styled.View`
  width: 300px;
  height: 250px;
  flex-direction: column;
  align-self: center;
  align-content: center;
  border: solid 3px;
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  margin-top: 25px;
`;

export const ClosedViewText = styled.Text`
  color: #333;
  text-align: center;
  align-self: center;
  font-size: 20px;
  font-weight: bold;
  margin-top: 10px;
`;

export const ClosedViewTextWeek = styled.Text`
  color: #ffbf00;
  text-align: center;
  font-size: 40px;
  font-weight: bold;
  margin-top: -50px;
`;

export const MainView = styled.View`
  padding: 10px;
  margin: 10px;
  background: #fff;
  border-radius: 8px;
  flex: 1;
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const List = styled.ScrollView.attrs({
  bounces: false,
  alwaysBounceVertical: false,
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {paddingLeft: 5},
})``;

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
