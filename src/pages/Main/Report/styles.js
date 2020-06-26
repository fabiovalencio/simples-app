import styled from 'styled-components';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const List = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  flex-direction: row;
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  border-top-left-radius: 2px;
  border-top-right-radius: 2px;
  margin-bottom: 120px;
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
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

export const View = styled.View`
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

export const ViewModal = styled.View`
  align-content: center;
  align-items: center;
  background: #fff;
`;

export const ViewTableModal = styled.View`
  background: #fff;
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
  width: 70%;
  padding-top: 12px;
  background: #fff;
  flex-direction: column;
  align-items: center;
  align-self: center;
`;

export const DateText = styled.Text`
  font-size: 14px;
  color: #3b9eff;
  margin-left: 15px;
`;

export const Title = styled.Text`
  margin: 30px 0 20px 35px;
  font-size: 16px;
  color: #333;
`;

export const Positive = styled.Text`
  margin: 25px 20px 10px 20px;
  font-size: 16px;
  color: #00ff40;
`;

export const Negative = styled.Text`
  margin: 25px 20px 10px 20px;
  font-size: 16px;
  color: #ff4b4b;
`;

export const Separator = styled.View`
  height: 1px;
  width: 250px;
  background: #ccc;
  align-self: center;
  margin: 30px 0 10px 0;
`;

export const Stretch = styled.Image`
  position: absolute;
  right: 0;
  width: 30px;
  height: 30px;
  background: transparent;
`;

export const SimpleView = styled.View`
  padding: 10px;
  margin: 10px;
  background: #fff;
  border-radius: 8px;
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const StyledButton = styled(Button)`
  margin: 1px;
`;
