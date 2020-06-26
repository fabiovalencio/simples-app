import React, {useState, useEffect, useRef} from 'react';
import {
  Keyboard,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Modal from 'react-native-modal';
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
  SimpleViewButton,
  SimpleView,
  ViewModal,
  ButtonClose,
} from './styles';

const level0 = {
  color: '#FF4B4B',
  rgb: 'rgba(255, 75, 75, 0.3)',
  title: 'Semana difícil?',
  message:
    'Lembre-se: o recomeço é o mais importante, você pode tirar a diferença na próxima semana.',
};
const level1 = {
  color: '#FF8F35',
  rgb: 'rgba(255, 143, 53, 0.3)',
  title: 'Semana na média?',
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

export default function weekPoints({navigation}) {
  const [level, setLevel] = useState({});
  const [points, setPoints] = useState(30);
  const [positive, setPositive] = useState('');
  const [negative, setNegative] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);

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

    Keyboard.dismiss();
    setIsModalVisible(!isModalVisible);
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

        <SimpleViewButton>
          <SubmitButton onPress={() => setIsModalVisible(!isModalVisible)}>
            Associações Significativas
          </SubmitButton>
        </SimpleViewButton>
        <SimpleView>
          <SubmitButton onPress={() => navigation.goBack(null)}>
            Fechar semana
          </SubmitButton>
        </SimpleView>

        <Modal
          isVisible={isModalVisible}
          onPress={() => setIsModalVisible(!isModalVisible)}>
          <KeyboardAvoidingView
            enabled
            behavior={Platform.OS === 'android' ? undefined : 'position'}>
            <ScrollView
              scrollEnabled={false}
              keyboardShouldPersistTaps="handled">
              <ViewModal>
                <ButtonClose>
                  <Icon
                    name="close"
                    size={20}
                    color="#333"
                    onPress={() => setIsModalVisible(!isModalVisible)}
                  />
                </ButtonClose>

                <TitleView>Associações Significativas</TitleView>

                <TextInput
                  multiline
                  numberOfLines={4}
                  returnKeyType="next"
                  onSubmitEditing={() => negativeRef.current.focus()}
                  onChangeText={(text) => setPositive(text)}
                  value={positive}
                  placeholder="Se a sua semana teve uma boa pontuação, anote neste espaço o porquê. Pode ser uma palavra ou uma frase. Isso vai fazer você se conhecer melhor, você vai poder sempre se lembrar daquilo que te faz bem."
                  style={{
                    alignSelf: 'center',
                    width: 300,
                    height: 130,
                    marginTop: 5,
                    marginBottom: 10,
                    backgroundColor: '#fff',
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#00FF40',
                    borderRadius: 8,
                    padding: 20,
                  }}
                />

                <TextInput
                  multiline
                  numberOfLines={4}
                  ref={negativeRef}
                  returnKeyType="send"
                  onSubmitEditing={handleSubmit}
                  onChangeText={(text) => setNegative(text)}
                  value={negative}
                  placeholder="Se a sua semana teve uma pontuação ruim, anote neste espaço o porquê. Pode ser uma palavra ou uma frase. Isso vai fazer você se conhecer melhor, você vai saber o que é que não te faz bem. "
                  style={{
                    alignSelf: 'center',
                    width: 300,
                    height: 130,
                    marginTop: 5,
                    marginBottom: 10,
                    backgroundColor: '#fff',
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderTopWidth: 1,
                    borderBottomWidth: 1,
                    borderColor: '#FF4B4B',
                    borderRadius: 8,
                    padding: 20,
                  }}
                />
              </ViewModal>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
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
