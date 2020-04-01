import React, {Component} from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RadioForm from 'react-native-simple-radio-button';
import {format, getYear} from 'date-fns';
import moment from 'moment';
import Modal from 'react-native-modal';
import Orientation from 'react-native-orientation-locker';
import pt from 'date-fns/locale/pt';
import CalendarPicker from 'react-native-calendar-picker';
import OneSignal from 'react-native-onesignal';
import AwesomeAlert from 'react-native-awesome-alerts';
import Standard from '~/pages/Main/Config/Standard';
import RadioButton from '~/components/RadioButton';
import api from '~/services/api';
import Background from '~/components/Background';

import {
  Container,
  ContainerRadio,
  View,
  DateButton,
  DateText,
  List,
  ButtonName,
  Separator,
  Total,
  TotalText,
  TotalValue,
  SubmitButton,
  ViewPoint,
  HelloName,
  Name,
} from '../../MyWeek/Week/styles';

export default class SelectDay extends Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func,
    }),
  };

  constructor(props) {
    super(props);

    const {navigation} = this.props;
    this._willFocusSubscription = navigation.addListener(
      'willFocus',
      (payload) => {
        // lock to portrait when this screen is about to appear
        Orientation.lockToPortrait();
      },
    );

    this.state = {
      isModalVisible: false,
      showAlert: false,
      user: {},
      date: new Date(),
      sono: [],
      alimentacao: [],
      meditacao: [],
      dataSono: [],
      dataAlimentacao: [],
      dataMeditacao: [],
      sonoValue: null,
      alimentacaoValue: null,
      meditacaoValue: null,
      total: 0,
      exercicio: [
        {label: 'Sim          ', value: 0},
        {label: 'Não   ', value: 1},
      ],
      exercicioValue: -1,
      buttonShow: false,
      disabled: false,
      display: 'none',
      dateFormated: '',
      minDate: '',
      phrase: 'como foi o seu dia?',
      dataFromApi: false,
      dataModal: null,
    };

    OneSignal.getPermissionSubscriptionState(async (status) => {
      let notification = await AsyncStorage.getItem('notification');
      notification = !!notification;

      if (!status.userId && !notification) {
        setTimeout(() => {
          this.setState({
            showAlert: true,
          });
        }, 5000);
      }
    });

    this.changeDate = this.changeDate.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
  }

  componentDidMount = async () => {
    const {date} = this.state;
    await this.getUserData();

    const formatted = format(date, "dd 'de' MMM 'de' yyyy", {
      locale: pt,
    });

    this.setState({dateFormated: formatted});

    const subjects = await api.get('/subjects');

    this.fecthDataJson(subjects.data.subject, 'Sono');
    this.fecthDataJson(subjects.data.subject, 'Alimentação');
    this.fecthDataJson(subjects.data.subject, 'Meditação');

    date.setHours(0, 0, 0, 0);
    this.changeDate(date);
  };

  componentWillUnmount() {
    // remove subscription when unmount
    this._willFocusSubscription.remove();
  }

  onAcceptNotification = () => {
    const {user} = this.state;
    this.setState({
      showAlert: false,
    });

    OneSignal.init('5051f00e-2545-4962-b90a-d749333b932a', {
      kOSSettingsKeyAutoPrompt: true,
    });
    const day = user.day ? user.day.toString() : null;
    OneSignal.setExternalUserId(user.id);
    OneSignal.setEmail(user.email);
    OneSignal.sendTag('day', day);
  };

  onDismissNotification = async () => {
    await AsyncStorage.setItem('notification', 'true');

    this.setState({
      showAlert: false,
    });
    OneSignal.init('5051f00e-2545-4962-b90a-d749333b932a', {
      kOSSettingsKeyAutoPrompt: false,
    });
  };

  async getUserData() {
    const {date, user} = this.state;
    const persist = await AsyncStorage.getItem('persist:simples');
    const simples = JSON.parse(persist);
    const users = JSON.parse(simples.user);

    if (users.profile) {
      await new Promise((resolve) =>
        this.setState({user: users.profile}, () => resolve()),
      );
    }

    if (!user.name) {
      const userData = await api.get('/user');
      await new Promise((resolve) =>
        this.setState({user: userData.data.user}, () => resolve()),
      );
    }

    const week = await api.get('/user-week-days', {
      params: {
        date,
      },
    });
    const minDate = moment(week.data.week[0]).utc().format('YYYY-MM-DD');
    this.state.minDate = minDate;
  }

  setTotal() {
    const {sonoValue, alimentacaoValue, meditacaoValue} = this.state;
    this.setState({
      total: sonoValue + alimentacaoValue + meditacaoValue,
    });
  }

  async setData(data) {
    this.setState({disabled: false});

    const json = {
      id: 5,
      label: 5,
      value: 0,
      size: 30,
      color: '#fff',
      selected: true,
    };
    const {sono, alimentacao, meditacao} = this.state;
    const arrSono = sono;
    const arrAlimentacao = alimentacao;
    const arrMeditacao = meditacao;

    this.setState((previousState) => ({
      sono: [...previousState.sono, json],
      alimentacao: [...previousState.alimentacao, json],
      meditacao: [...previousState.meditacao, json],
    }));

    this.changeSonoButton(4);
    this.changeAlimentacaoButton(3);
    this.changeMeditacaoButton(3);

    this.setState({
      sono: arrSono,
      alimentacao: arrAlimentacao,
      meditacao: arrMeditacao,
    });

    if (data) {
      data.map((item) => {
        this.setState({
          disabled: true,
          buttonShow: false,
          dataFromApi: true,
          phrase: 'veja como foi o seu dia.',
        });
        this.state.buttonShow = false;

        if (item.subject.name === 'Sono') {
          this.changeSonoButton(item.points - 1);
        } else if (item.subject.name === 'Alimentação') {
          this.changeAlimentacaoButton(item.points - 1);
        } else if (item.subject.name === 'Meditação') {
          this.changeMeditacaoButton(item.points);
        }
      });
    }
  }

  setDataWorkout(data) {
    if (data.workout[0]) {
      this.state.exercicioValue = 0;
      this.child.updateIsActiveIndex(0);
    } else {
      this.state.exercicioValue = 1;
      this.child.updateIsActiveIndex(1);
    }
  }

  onButtonPress = () => {
    const {isModalVisible} = this.state;
    this.setState({isModalVisible: !isModalVisible});
  };

  async changeDate(dt) {
    const date = new Date(dt);
    const formatted = format(date, "dd 'de' MMM 'de' yyyy", {
      locale: pt,
    });

    this.setState({date, dateFormated: formatted, display: 'none'});

    try {
      const notes = await api.get('/notes', {
        params: {
          date,
        },
      });

      const workout = await api.get('/workout', {
        params: {
          date,
        },
      });

      if (notes.data.notes) {
        this.setData(notes.data.notes);
      }

      if (workout.data) {
        this.setDataWorkout(workout.data);
      }
    } catch (error) {}
  }

  fecthDataJson(array, name) {
    const arr = [];

    array.map((sub) => {
      if (sub.name === name) {
        const point = sub.point.split(',');
        const color = sub.color.split(',');
        const {length} = point;

        point.forEach(function (v, k) {
          const json = {
            id: sub.id,
            label: v,
            value: parseInt(v, 0),
            size: 30,
            color: `#${color[k].trim()}`,
            colorEnd: length - 1 === k ? null : `#${color[k + 1].trim()}`,
            gradient: length - 1 !== k,
            length: length === 4 ? 60 : 90,
            selected: false,
          };
          arr.push(json);
        });
        if (name === 'Sono') {
          this.setState({dataSono: sub, sono: arr});
        } else if (name === 'Alimentação') {
          this.setState({dataAlimentacao: sub, alimentacao: arr});
        } else if (name === 'Meditação') {
          this.setState({dataMeditacao: sub, meditacao: arr});
        }
      }
    });
  }

  changeButtonState() {
    const {
      sonoValue,
      alimentacaoValue,
      meditacaoValue,
      dataFromApi,
    } = this.state;
    if (
      sonoValue > 0 &&
      alimentacaoValue > 0 &&
      meditacaoValue >= 0 &&
      !dataFromApi
    ) {
      this.state.buttonShow = true;
    }
  }

  changeSonoButton(index) {
    const {sono} = this.state;
    sono.map((item) => {
      item.selected = false;
    });

    sono[index].selected = true;
    this.state.sonoValue = sono[index].value;

    this.setTotal();
    this.changeButtonState();
  }

  changeAlimentacaoButton(index) {
    const {alimentacao} = this.state;
    alimentacao.map((item) => {
      item.selected = false;
    });

    alimentacao[index].selected = true;
    this.state.alimentacaoValue = alimentacao[index].value;
    this.setTotal();
    this.changeButtonState();
  }

  changeMeditacaoButton(index) {
    const {meditacao} = this.state;
    meditacao.map((item) => {
      item.selected = false;
    });

    meditacao[index].selected = true;
    this.state.meditacaoValue = meditacao[index].value;
    this.setTotal();
    this.changeButtonState();
  }

  changeExercicioButton(index) {
    this.state.exercicioValue = index;
    this.changeButtonState();
  }

  async handleSubmit() {
    const {
      date,
      sonoValue,
      sono,
      alimentacaoValue,
      alimentacao,
      meditacaoValue,
      meditacao,
      exercicioValue,
      total,
    } = this.state;
    const year = getYear(date);
    const dataWeek = await api.get('/user-week-number', {
      params: {
        date,
      },
    });
    const {week} = dataWeek.data;

    api.post('/notes', {
      points: sonoValue,
      date,
      week,
      year,
      subjects_id: sono[0].id,
    });

    api.post('/notes', {
      points: alimentacaoValue,
      date,
      week,
      year,
      subjects_id: alimentacao[0].id,
    });

    api
      .post('/notes', {
        points: meditacaoValue,
        date,
        week,
        year,
        subjects_id: meditacao[0].id,
      })
      .then(this.setState({buttonShow: false}));

    if (exercicioValue === 0) {
      api.post('/workout', {
        date,
      });
    }

    const {navigation} = this.props;
    const points = total;
    const exercise = exercicioValue;
    navigation.navigate('dayConfirm', {points, exercise});
  }

  async toggleModal(t) {
    const {
      isModalVisible,
      dataSono,
      dataAlimentacao,
      dataMeditacao,
    } = this.state;

    const standards = await api.get('/standard');

    const {standard} = standards.data;
    const sono = standard.filter(function (o) {
      return o.subject.name === 'Sono';
    });

    const alimentacao = standard.filter(function (o) {
      return o.subject.name === 'Alimentação';
    });

    const meditacao = standard.filter(function (o) {
      return o.subject.name === 'Meditação';
    });

    switch (t) {
      case 'sono':
        this.setState({
          dataModal: {
            data: dataSono,
            standard: sono,
            url: '/standard',
          },
        });
        break;
      case 'alimentacao':
        this.setState({
          dataModal: {
            data: dataAlimentacao,
            standard: alimentacao,
            url: '/standard',
          },
        });
        break;
      case 'meditacao':
        this.setState({
          dataModal: {
            data: dataMeditacao,
            standard: meditacao,
            url: '/standard',
          },
        });
        break;
      default:
        break;
    }

    this.setState({isModalVisible: !isModalVisible});
  }

  render() {
    const {
      user,
      minDate,
      date,
      display,
      dateFormated,
      disabled,
      phrase,
      isModalVisible,
      dataModal,
      showAlert,
    } = this.state;

    return (
      <>
        {dataModal && (
          <Modal
            isVisible={isModalVisible}
            style={{
              margin: 0,
              justifyContent: 'flex-end',
            }}
            customBackdrop={
              <TouchableWithoutFeedback onPress={this.onButtonPress}>
                <View
                  style={{
                    flex: 1,
                    marginTop: -10,
                    backgroundColor: 'rgba(0, 0, 0, 1)',
                  }}
                />
              </TouchableWithoutFeedback>
            }>
            <KeyboardAvoidingView
              enabled
              behavior={Platform.OS === 'android' ? undefined : 'position'}>
              <ScrollView
                scrollEnabled={false}
                keyboardShouldPersistTaps="handled">
                <View style={{flex: 1}}>
                  <Button title="X" onPress={this.onButtonPress} />
                  <Standard data={dataModal} onPress={this.handleSubmit} />
                </View>
              </ScrollView>
            </KeyboardAvoidingView>
          </Modal>
        )}
        <Background>
          <Container>
            {/* <DateInput date={this.state.date} onChange={this.changeDate} /> */}
            <View>
              <DateButton
                onPress={() => {
                  this.setState({
                    display: display === 'none' ? 'flex' : 'none',
                  });
                }}>
                <Icon name="event" color="#3b9eff" size={20} />
                <DateText>{dateFormated}</DateText>
              </DateButton>
            </View>

            {minDate ? (
              <ViewPoint display={display}>
                <CalendarPicker
                  initialDate={date}
                  selectedStartDate={date}
                  minDate={minDate}
                  maxDate={new Date()}
                  weekdays={['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']}
                  months={[
                    'Janeiro',
                    'Fevereiro',
                    'Março',
                    'Abril',
                    'Maio',
                    'Junho',
                    'Julho',
                    'Agosto',
                    'Setembro',
                    'Outubro',
                    'Novembro',
                    'Dezembro',
                  ]}
                  previousTitle="<"
                  nextTitle=">"
                  onDateChange={this.changeDate}
                  scaleFactor={450}
                  todayBackgroundColor="#fff"
                  selectedDayColor="#ccc"
                />
              </ViewPoint>
            ) : null}

            <List>
              <Name>
                <HelloName>Olá {user ? user.name : null},</HelloName>
                {'\n'} {'\n'} {phrase}
              </Name>
              <ButtonName>
                Sono
                <Icon
                  name="help"
                  size={20}
                  iconStyle={{marginLeft: 20, marginTop: 10}}
                  color="#333"
                  onPress={this.toggleModal.bind(this, 'sono')}
                />
              </ButtonName>
              <ContainerRadio>
                {this.state.sono.map((item, key) => (
                  <RadioButton
                    disabled={disabled}
                    key={key}
                    button={item}
                    onClick={this.changeSonoButton.bind(this, key)}
                  />
                ))}
              </ContainerRadio>

              <Separator>__ _ __</Separator>

              <ButtonName>
                Alimentação
                <Icon
                  name="help"
                  size={20}
                  style={{marginLeft: 20, marginTop: 10}}
                  color="#333"
                  onPress={this.toggleModal.bind(this, 'alimentacao')}
                />
              </ButtonName>
              <ContainerRadio>
                {this.state.alimentacao.map((item, key) => (
                  <RadioButton
                    disabled={this.state.disabled}
                    key={key}
                    button={item}
                    onClick={this.changeAlimentacaoButton.bind(this, key)}
                  />
                ))}
              </ContainerRadio>

              <Separator>__ _ __</Separator>

              <ButtonName>
                Meditação
                <Icon
                  name="help"
                  size={20}
                  defaultStyle={{marginLeft: 20, marginTop: 10}}
                  color="#333"
                  onPress={this.toggleModal.bind(this, 'meditacao')}
                />
              </ButtonName>
              <ContainerRadio>
                {this.state.meditacao.map((item, key) => (
                  <RadioButton
                    disabled={this.state.disabled}
                    key={key}
                    button={item}
                    onClick={this.changeMeditacaoButton.bind(this, key)}
                  />
                ))}
              </ContainerRadio>

              <Separator>__ _ __</Separator>

              <ButtonName>Exercício</ButtonName>
              <RadioForm
                ref={(child) => {
                  this.child = child;
                }}
                {...this.props}
                disabled={this.state.disabled}
                radio_props={this.state.exercicio}
                initial={this.state.exercicioValue}
                formHorizontal
                style={{
                  marginStart: 30,
                  marginTop: 20,
                }}
                onPress={this.changeExercicioButton.bind(this)}
              />

              <Total>
                <TotalText>Total</TotalText>
                <TotalValue>{this.state.total}</TotalValue>
              </Total>

              {this.state.buttonShow ? (
                <SubmitButton onPress={this.handleSubmit}>Salvar</SubmitButton>
              ) : null}
            </List>
          </Container>
        </Background>
        <AwesomeAlert
          show={showAlert}
          showProgress={false}
          title="Notificação"
          message="Queremos enviar notificações para que você não se esqueça de criar as suas notas diárias"
          closeOnTouchOutside
          closeOnHardwareBackPress={false}
          showCancelButton
          showConfirmButton
          cancelText="Não"
          confirmText="Sim, enviar notificações"
          confirmButtonColor="#2196f3"
          onCancelPressed={() => {
            this.onDismissNotification();
          }}
          onConfirmPressed={() => {
            this.onAcceptNotification();
          }}
        />
      </>
    );
  }
}

SelectDay.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

SelectDay.navigationOptions = {
  title: null,
  tabBarLabel: 'Meu dia',
  tabBarIcon: ({tintColor}) => (
    <Icon name="wb-sunny" size={20} color={tintColor} />
  ),
};
