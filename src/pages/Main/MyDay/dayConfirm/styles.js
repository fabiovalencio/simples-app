import styled from 'styled-components';
import Button from '~/components/Button';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const ViewText = styled.View`
  position: absolute;
  padding-top: 20px;
  flex-direction: column;
  align-self: center;
  align-content: center;
  width: 95%;
  height: 300px;
`;

export const Title = styled.Text`
  margin-top: 100px;
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
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;

  flex-direction: column;
  align-self: center;
  align-content: center;
  /* border: solid 3px; */
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  width: 95%;
  height: 300px;
  margin: 60% 10px 20px 10px;
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const TitleView = styled.Text`
  margin-top: 20px;
  font-size: 20px;
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
  margin-top: 35px;
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

export const SubmitButton = styled(Button)`
  margin: 1px;
`;
