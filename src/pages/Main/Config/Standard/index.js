import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Button,
} from 'react-native';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Modal from 'react-native-modal';
import LinearGradient from 'react-native-linear-gradient';
import api from '~/services/api';
import * as json from './text.json';
import {
  Container,
  Title,
  SubTitle,
  View,
  VInput,
  VTitle,
  TInput,
  SubmitButton,
  Text,
  ViewModal,
  ButtonName,
  ButtonClose,
} from './styles';

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    marginStart: -10,
    marginTop: 15,
    width: 5,
  },
});

function Standard({data, bg}) {
  const dcolor = data.data.color.split(',');
  const points = data.data.point.split(',');
  const {standard} = data;

  const [phrase, setPhrase] = useState(
    `Você ainda não estabeleceu os critérios de ${data.data.name}, defina agora. Lembre-se de que eles são subjetivos, de acordo com o seu passo.`,
  );
  const [title, setTitle] = useState('Salvar');
  const [isVisible, setIsVisible] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [value0, setValue0] = useState();
  const [value1, setValue1] = useState();
  const [value2, setValue2] = useState();
  const [value3, setValue3] = useState();
  const [value4, setValue4] = useState();
  const [value5, setValue5] = useState();
  const [value6, setValue6] = useState();
  const [value10, setValue10] = useState();

  function loadDataOnlyOnce() {
    if (standard && standard.length > 0) {
      setIsVisible(false);
      setTitle('Editar');
      setPhrase(
        `Esses são os seus critérios de ${data.data.name}, você pode alterá-los a qualquer momento.`,
      );

      standard.forEach(function (v) {
        if (v.value === 0) {
          setValue0(v.description);
        } else if (v.value === 1) {
          setValue1(v.description);
        } else if (v.value === 2) {
          setValue2(v.description);
        } else if (v.value === 3) {
          setValue3(v.description);
        } else if (v.value === 4) {
          setValue4(v.description);
        } else if (v.value === 5) {
          setValue5(v.description);
        } else if (v.value === 6) {
          setValue6(v.description);
        } else if (v.value === 10) {
          setValue10(v.description);
        }
      });
    }
  }

  useEffect(loadDataOnlyOnce, []);

  const colors = [];

  dcolor.map((v) => {
    const c = `#${v.trim()}`;
    colors.push(c);
  });

  function postData(url, id, description, value) {
    if (url.includes('/week-standard')) {
      api.post(url, {
        week_subjects_id: id,
        description,
        value,
      });
    } else {
      api.post(url, {
        subjects_id: id,
        description,
        value,
      });
    }
  }

  function putData(url, id, description, value) {
    if (url.includes('/week-standard')) {
      api.put(url, {
        week_subjects_id: id,
        description,
        value,
      });
    } else {
      api.put(url, {
        subjects_id: id,
        description,
        value,
      });
    }
  }

  function SendHandler() {
    if (standard && standard.length > 0 && !isVisible) {
      setTitle('Salvar');
      setIsVisible(true);
    }

    const value = [
      value0,
      value1,
      value2,
      value3,
      value4,
      value5,
      value6,
      'value7',
      'value8',
      'value9',
      value10,
    ];

    if (isVisible && standard.length === 0) {
      points.forEach(function (v) {
        postData(data.url, data.data.id, value[parseInt(v, 0)], parseInt(v, 0));
      });

      Keyboard.dismiss();
      setTitle('Editar');
      setIsVisible(false);
    }

    if (standard && standard.length > 0 && isVisible) {
      standard.forEach(function (v) {
        putData(
          `${data.url}/${v.id}`,
          data.data.id,
          value[parseInt(v.value, 0)],
          parseInt(v.value, 0),
        );
      });

      Keyboard.dismiss();
      setTitle('Editar');
      setIsVisible(false);
    }
  }

  function toggleModal() {
    setIsModalVisible(!isModalVisible);
  }

  return (
    <Container>
      <ButtonName>
        <Icon name="info" size={20} color="#333" onPress={toggleModal} />
      </ButtonName>
      <Modal isVisible={isModalVisible} onPress={toggleModal}>
        <KeyboardAvoidingView
          enabled
          behavior={Platform.OS === 'android' ? undefined : 'position'}>
          <ScrollView scrollEnabled={false} keyboardShouldPersistTaps="handled">
            <ViewModal>
              <ButtonClose>
                <Icon
                  name="close"
                  size={20}
                  color="#333"
                  onPress={toggleModal}
                />
              </ButtonClose>
              <Text>{json[data.data.name]}</Text>
            </ViewModal>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>

      <Title>Critérios de {data.data.name}</Title>
      <SubTitle>{phrase}</SubTitle>

      <View>
        <LinearGradient
          style={[styles.gradient, {height: colors.length * 62}]}
          colors={colors}
          start={{x: 1, y: 0}}
          end={{x: 0, y: 1}}
          s
        />

        {points.map((v, i) => (
          <VInput bg={bg} key={v.toString()}>
            <VTitle>{i === 0 ? ` ${v}` : v}.</VTitle>

            {parseInt(v, 0) === 0 && (
              <TInput
                border={isVisible}
                key={v.toString()}
                multiline
                value={value0 ? value0.toString() : null}
                onChangeText={setValue0}
              />
            )}

            {parseInt(v, 0) === 1 && (
              <TInput
                border={isVisible}
                key={v.toString()}
                multiline
                value={value1 ? value1.toString() : null}
                onChangeText={setValue1}
              />
            )}

            {parseInt(v, 0) === 2 && (
              <TInput
                border={isVisible}
                key={v.toString()}
                multiline
                value={value2 ? value2.toString() : null}
                onChangeText={setValue2}
              />
            )}

            {parseInt(v, 0) === 3 && (
              <TInput
                border={isVisible}
                key={v.toString()}
                multiline
                value={value3 ? value3.toString() : null}
                onChangeText={setValue3}
              />
            )}

            {parseInt(v, 0) === 4 && (
              <TInput
                border={isVisible}
                key={v.toString()}
                multiline
                value={value4 ? value4.toString() : null}
                onChangeText={setValue4}
              />
            )}

            {parseInt(v, 0) === 5 && (
              <TInput
                border={isVisible}
                key={v.toString()}
                multiline
                value={value5 ? value5.toString() : null}
                onChangeText={setValue5}
              />
            )}

            {parseInt(v, 0) === 6 && (
              <TInput
                border={isVisible}
                key={v.toString()}
                multiline
                value={value6 ? value6.toString() : null}
                onChangeText={setValue6}
              />
            )}

            {parseInt(v, 0) === 10 && (
              <TInput
                border={isVisible}
                key={v.toString()}
                multiline
                value={value10 ? value10.toString() : null}
                onChangeText={setValue10}
              />
            )}
          </VInput>
        ))}
        <VTitle />
      </View>
      <SubmitButton onPress={SendHandler}>{title}</SubmitButton>
    </Container>
  );
}

Standard.propTypes = {
  data: PropTypes.oneOfType([PropTypes.object]),
  bg: PropTypes.oneOfType([PropTypes.bool]),
};

Standard.defaultProps = {
  data: {},
  bg: true,
};

export default Standard;
