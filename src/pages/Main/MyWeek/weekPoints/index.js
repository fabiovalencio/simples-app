import React, {useState, useEffect, useRef} from 'react';
import {Keyboard, TextInput} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import Background from '~/components/Background';
import api from '~/services/api';

import {
  Container,
  ViewText,
  ViewPoint,
  Title,
  Message,
  TitleView,
  Point,
  PoinText,
  SubmitButton,
  ViewTextArea,
} from './styles';

const level0 = {
  color: '#FF4B4B',
  rgb: 'rgba(255, 75, 75, 0.3)',
  title: 'Atenção',
  message: 'Não desanime, continue criando hábitos saudáveis',
};
const level1 = {
  color: '#FF8F35',
  rgb: 'rgba(255, 143, 53, 0.3)',
  title: 'Bom',
  message: 'Você está no caminho certo, continue criando hábitos saudáveis',
};
const level2 = {
  color: '#FFD20F',
  rgb: 'rgba(255, 210, 15, 0.3)',
  title: 'Muito bom',
  message: 'Você já conhece o caminho, continue criando hábitos saudáveis',
};
const level3 = {
  color: '#00FF40',
  rgb: 'rgba(0, 255, 64, 0.3)',
  title: 'Parabéns',
  message: 'Você já conhece o caminho, continue criando hábitos saudáveis',
};

export default function weekPoints({navigation}) {
  const [level, setLevel] = useState({});
  const [points, setPoints] = useState(30);
  const [positive, setPositive] = useState('');
  const [negative, setNegative] = useState('');

  const negativeRef = useRef();

  useEffect(() => {
    setPoints(navigation.getParam('points'));

    if (points === 37) {
      setLevel(level3);
    } else if (points >= 25) {
      setLevel(level2);
    } else if (points >= 15) {
      setLevel(level1);
    } else {
      setLevel(level0);
    }
  }, [level, navigation, points]);

  async function handleSubmit() {
    if (positive && negative) {
      await api.post('/associations', {
        positive,
        negative,
        week: navigation.getParam('week'),
        year: navigation.getParam('year'),
      });
    }

    navigation.navigate('Report');
    Keyboard.dismiss();
  }

  return (
    <Background>
      <Container>
        <ViewText>
          <Title>{level.title}</Title>
          <Message>{level.message}</Message>
        </ViewText>

        <ViewPoint>
          <TitleView>Pontos complementares da semana</TitleView>
          <Point rgb={level.rgb}>
            <PoinText color={level.color}>{points}</PoinText>
          </Point>
        </ViewPoint>
        <ViewTextArea>
          <TitleView>Associações significativas</TitleView>

          <TextInput
            multiline
            numberOfLines={3}
            returnKeyType="next"
            onSubmitEditing={() => negativeRef.current.focus()}
            onChangeText={(text) => setPositive(text)}
            value={positive}
            placeholder="Associações positivas da semana"
            style={{
              alignSelf: 'center',
              width: 300,
              height: 100,
              marginTop: 5,
              marginBottom: 10,
              backgroundColor: '#fff',
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: '#00FF40',
              borderRadius: 8,
              padding: 10,
            }}
          />

          <TextInput
            multiline
            numberOfLines={3}
            ref={negativeRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            onChangeText={(text) => setNegative(text)}
            value={negative}
            placeholder="Associações negativas da semana"
            style={{
              alignSelf: 'center',
              width: 300,
              height: 100,
              marginTop: 5,
              marginBottom: 10,
              backgroundColor: '#fff',
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: '#FF4B4B',
              borderRadius: 8,
              padding: 10,
            }}
          />

          <SubmitButton onPress={handleSubmit}>Fechar semana</SubmitButton>
        </ViewTextArea>
      </Container>
    </Background>
  );
}

weekPoints.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    getParam: PropTypes.func.isRequired,
  }).isRequired,
};

weekPoints.navigationOptions = {
  title: null,
  headerLeft: () => {},
  tabBarLabel: 'Meu dia',
  tabBarIcon: ({tintColor}) => (
    <Icon name="wb-sunny" size={20} color={tintColor} />
  ),
};
