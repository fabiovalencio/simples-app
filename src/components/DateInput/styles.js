import styled from 'styled-components/native';

export const Container = styled.View`
  margin: 30px 0 30px;
  /* background: rgba(255, 255, 255, 0.1); */
  align-content: center;
  align-items: center;
`;

export const DateButton = styled.TouchableOpacity`
  padding: 0 15px;
  height: 46px;
  background: #3b9eff;
  border-radius: 8px;
  margin: 0 30px;
  flex-direction: row;
  align-items: center;
`;

export const DateText = styled.Text`
  font-size: 14px;
  color: #fff;
  margin-left: 15px;
`;

export const Picker = styled.View`
  /* background: #fff; */
  position: relative;
  justify-content: flex-end;
  width: 100%;
  height: 100%;
`;
