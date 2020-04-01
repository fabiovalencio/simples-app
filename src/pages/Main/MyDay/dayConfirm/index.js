import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Background from '~/components/Background';

import {
  Container,
  ViewText,
  ViewPoint,
  Title,
  Message,
  TitleView,
  Point,
  PoinText,
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

export default function dayConfirm({navigation}) {
  const [level, setLevel] = useState({});
  const [points, setPoints] = useState('');
  const [exercise, setExercise] = useState('');

  useEffect(() => {
    setPoints(navigation.getParam('points'));
    setExercise(navigation.getParam('exercise'));

    if (points === 9 && exercise === 0) {
      setLevel(level3);
    } else if (points >= 6) {
      setLevel(level2);
    } else if (points >= 4) {
      setLevel(level1);
    } else {
      setLevel(level0);
    }
  }, [exercise, level, navigation, points]);

  return (
    <Background>
      <Container>
        <ViewText>
          <Title>{level.title}</Title>
          <Message>{level.message}</Message>
        </ViewText>
        <ViewPoint>
          <TitleView> Pontuação do dia</TitleView>
          <Point rgb={level.rgb}>
            <PoinText color={level.color}>{points}</PoinText>
          </Point>
        </ViewPoint>
      </Container>
    </Background>
  );
}

dayConfirm.navigationOptions = {
  title: null,
  headerLeft: () => {},
  tabBarLabel: 'Meu dia',
  tabBarIcon: ({tintColor}) => <Icon name="wb-sunny" size={20} color="#333" />,
};
