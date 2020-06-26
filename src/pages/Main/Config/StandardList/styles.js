import styled from 'styled-components/native';

export const Container = styled.SafeAreaView`
  flex: 1;
`;

export const Border = styled.View`
  margin-top: -50px;
  border: solid 1px;
  border-color: rgba(0, 0, 0, 0.1);
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const View = styled.View`
  flex-direction: row;
  margin: 40px 2% 20px 2%;
  align-content: center;
  align-items: center;
  background: #fff;
  border-radius: 8px;
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

export const ButtonName = styled.Text`
  font-size: 17px;
  color: #000;
  margin: 10px 10px 0 13px;
  align-self: flex-end;
`;

export const ButtonClose = styled.Text`
  font-size: 17px;
  color: #000;
  margin: -10px -10px 5px 0;
  align-self: flex-end;
`;
