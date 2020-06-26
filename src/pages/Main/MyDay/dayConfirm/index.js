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
  SimpleView,
  StyledButton,
} from './styles';
import Button from '~/components/Button';

const level0 = {
  color: '#FF4B4B',
  rgb: 'rgba(255, 75, 75, 0.3)',
  title: 'Dia difícil?',
  message:
    'Lembre-se: o recomeço é o mais importante, você pode tirar a diferença amanhã.',
};
const level1 = {
  color: '#FF8F35',
  rgb: 'rgba(255, 143, 53, 0.3)',
  title: 'Dia na média?',
  message:
    'Ótimo, continue jogando para perceber o efeito do tempo na sua disciplina.',
};
const level2 = {
  color: '#FFD20F',
  rgb: 'rgba(255, 210, 15, 0.3)',
  title: 'Ótimo!',
  message: 'Você já conhece o caminho, continue mantendo hábitos saudáveis.',
};
const level3 = {
  color: '#00FF40',
  rgb: 'rgba(0, 255, 64, 0.3)',
  title: 'Ótimo!',
  message: 'Você já conhece o caminho, continue mantendo hábitos saudáveis.',
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
    } else if (points >= 7) {
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
        <SimpleView>
          <Button onPress={() => navigation.goBack(null)}>Fechar o dia</Button>
        </SimpleView>
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
