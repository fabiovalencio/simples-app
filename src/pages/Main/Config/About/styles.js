import styled from 'styled-components/native';

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
  margin: 105px 30px 0 30px;
  background: #fff;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
`;

export const View = styled.View`
  flex-direction: column;
`;

export const Title = styled.Text`
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  padding: 10px;

  width: 100%;
`;

export const Subtitle = styled.Text`
  color: #333;
  font-size: 15px;
  text-align: left;
  margin: 50px 5px 10px;

  width: 100%;
`;
