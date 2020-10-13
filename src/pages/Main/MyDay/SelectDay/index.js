import React, {Component} from 'react';
import {
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import PropTypes from 'prop-types';
import CalendarPicker from 'react-native-calendar-picker';
import moment from 'moment';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {format, getYear} from 'date-fns';
import pt from 'date-fns/locale/pt';
import Modal from 'react-native-modal';
import Orientation from 'react-native-orientation-locker';
import RadioButton from '~/components/RadioButton';
import RadioForm from 'react-native-simple-radio-button';
import api from '~/services/api';
import Background from '~/components/Background';
import OneSignal from 'react-native-onesignal';
import AwesomeAlert from 'react-native-awesome-alerts';
import Standard from '~/pages/Main/Config/Standard';
import DayChart from '~/components/DayChart';
import * as json from '../../Config/Standard/text.json';
import {
  Container,
  ContainerRadio,
  View,
  DateText,
  List,
  ButtonName,
  MainView,
  Total,
  TotalText,
  TotalValue,
  SubmitButton,
  ViewPoint,
  HelloName,
  Name,
} from '../../MyWeek/Week/styles';

import {
  ViewButton,
  LeftButton,
  RightButton,
  DateButton,
  ViewModal,
  Text,
  WorkoutModal,
  ButtonClose,
} from './styles';

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

    OneSignal.setLogLevel(6, 0);

  // Replace 'YOUR_ONESIGNAL_APP_ID' with your OneSignal App ID.
    OneSignal.init('375aa12c-2930-4636-ab6f-a065bbcd19f2', {
      kOSSettingsKeyAutoPrompt: false,
      kOSSettingsKeyInAppLaunchURL: false,
      kOSSettingsKeyInFocusDisplayOption: 2,
    });
  OneSignal.inFocusDisplaying(2); // Controls what should happen if a notification is received while the app is open. 2 means that the notification will go directly to the device's notification center.

  // The promptForPushNotifications function code will show the iOS push notification prompt. We recommend removing the following code and instead using an In-App Message to prompt for notification permission (See step below)
  // OneSignal.promptForPushNotificationsWithUserResponse(myiOSPromptCallback);

   OneSignal.addEventListener('received', this.onReceived);
   OneSignal.addEventListener('opened', this.onOpened);
   OneSignal.addEventListener('ids', this.onIds);

    this.state = {
      isModalVisible: false,
      isModalWorkoutVisible: false,
      showAlert: false,
      user: {},
      date: new Date(),
      subjects: [],
      sono: [],
      alimentacao: [],
      meditacao: [],
      dataSono: [],
      weekSono: [],
      dataAlimentacao: [],
      weekAlimentacao: [],
      dataMeditacao: [],
      weekMeditacao: [],
      weekExercicio: [],
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
      week: null,
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

  onReceived(notification) {
    console.log("Notification received: ", notification);
  }

  onOpened(openResult) {
    console.log('Message: ', openResult.notification.payload.body);
    console.log('Data: ', openResult.notification.payload.additionalData);
    console.log('isActive: ', openResult.notification.isAppInFocus);
    console.log('openResult: ', openResult);
  }

  onIds(device) {
    console.log('Device info: ', device);
  }

  componentDidMount = async () => {
    const {date} = this.state;
    await this.getUserData();

    const formatted = format(date, "dd 'de' MMM 'de' yyyy", {
      locale: pt,
    });

    const subjects = await api.get('/subjects');

    this.setState({dateFormated: formatted, subjects});

    this.fecthDataJson(subjects.data.subject, 'Sono');
    this.fecthDataJson(subjects.data.subject, 'Alimentação');
    this.fecthDataJson(subjects.data.subject, 'Meditação');

    date.setHours(0, 0, 0, 0);
    this.changeDate(date);
  };

  componentWillUnmount() {
    // remove subscription when unmount
    this._willFocusSubscription.remove();
    OneSignal.removeEventListener('received', this.onReceived);
    OneSignal.removeEventListener('opened', this.onOpened);
    OneSignal.removeEventListener('ids', this.onIds);
  }

  onAcceptNotification = () => {
    const {user} = this.state;
    this.setState({
      showAlert: false,
    });

    //ONESIGNAL ANDROID: 375aa12c-2930-4636-ab6f-a065bbcd19f2
    //ONESIGNAL IOS: 5051f00e-2545-4962-b90a-d749333b932a

    OneSignal.init('375aa12c-2930-4636-ab6f-a065bbcd19f2', {
      kOSSettingsKeyAutoPrompt: true,
    });
    const day = user.day ? user.day.toString() : 1;
    OneSignal.setExternalUserId(user.id);
    OneSignal.setEmail(user.email);
    OneSignal.sendTag('day', day);
  };

  onDismissNotification = async () => {
    await AsyncStorage.setItem('notification', 'true');

    this.setState({
      showAlert: false,
    });
    OneSignal.init('375aa12c-2930-4636-ab6f-a065bbcd19f2', {
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
        this.setState(
          {
            user: userData.data.user,
            minDate: moment(userData.data.user.createdAt)
              .utc()
              .format('YYYY-MM-DD'),
          },
          () => resolve(),
        ),
      );
    }
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

  setDataWeek = (name, data) => {
    if (name === 'Sono') {
      this.setState({weekSono: data});
    } else if (name === 'Alimentação') {
      this.setState({weekAlimentacao: data});
    } else if (name === 'Meditação') {
      this.setState({weekMeditacao: data});
    }
  };

  onButtonPress = () => {
    const {isModalVisible} = this.state;
    this.setState({isModalVisible: !isModalVisible});
  };

  getWeekNoteData = async (week) => {
    const {subjects} = this.state;
    const that = this;

    subjects.data.subject.forEach(async function (v, k) {
      let colors = [];
      let dates = [];
      let points = [];
      let arr = [];

      let res = await api.get(`week/${week}/note/${v.id}`);

      res.data.data.forEach(async function (n, i) {
        let p = n.points === 0 ? 0.01 : n.points;
        points.push(p);

        let d = n.date.split('-');
        d = `${d[2]}/${d[1]}`;
        dates.push(`${d}`);
      });
      colors = v.color.split(',');

      const json = {
        points,
        dates,
        colors,
        key: v.name + week,
      };
      arr.push(json);

      that.setDataWeek(v.name, arr[0]);
    });
  };

  getWeekWorkoutData = async (week) => {
    const that = this;
    const result = await api.get(`/week/${week}/workout`);
    const {data, date} = result.data;

    let arr = [];
    let key = `workout${week}`;
    let arrColors = ['CCEEFF', '2196F3'];
    let arrDate = [];
    let arrData = [];
    var lwd = moment(date[1]);
    var today = moment();
    let dtIni = moment(date[0]).utc().format('YYYY-MM-DD');
    let dtEnd =
      lwd > today
        ? moment().utc().format('YYYY-MM-DD')
        : moment(date[1]).utc().format('YYYY-MM-DD');
    let dtI = new Date(dtIni);
    let dtE = new Date(dtEnd);

    while (dtI <= dtE) {
      let d = new Date(dtI);
      let dc = d.toISOString().slice(0, 10);

      let ad = moment(dc).utc().format('DD/MM');
      arrDate.push(`${ad}`);

      if (Array.isArray(data)) {
        let check = data.find((x) => x.date === dc) ? 1 : 0.01;
        arrData.push(check);
      }
      dtI.setDate(dtI.getDate() + 1);
    }

    const json = {
      points: arrData,
      dates: arrDate,
      colors: arrColors,
      key,
    };

    arr.push(json);

    that.setState({weekExercicio: arr[0]});
  };

  async changeDate(dt) {
    const date = new Date(dt);

    const formatted = format(date, "dd 'de' MMM 'de' yyyy", {
      locale: pt,
    });

    this.setState({
      date,
      dateFormated: formatted,
      display: 'none',
      dataFromApi: false,
    });

    try {
      const dataWeek = await api.get('/user-week-number', {
        params: {
          date,
        },
      });

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

      if (dataWeek.data.week) {
        this.getWeekNoteData(dataWeek.data.week);
      }

      if (dataWeek.data.week) {
        this.getWeekWorkoutData(dataWeek.data.week);
      }

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

  navigationDayLeft = () => {
    const {date, minDate} = this.state;

    let dt = moment(date).add(-1, 'days');

    if (dt <= minDate) {
      return;
    }
    this.changeDate(dt);
  };

  navigationDayRight = () => {
    const {date} = this.state;
    let dt = moment(date).add(1, 'days');

    if (dt > new Date()) {
      return;
    }
    this.changeDate(dt);
  };

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

  toggleWorkoutModal = () => {
    const {isModalWorkoutVisible} = this.state;
    this.setState({isModalWorkoutVisible: !isModalWorkoutVisible});
  };

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
      weekSono,
      weekAlimentacao,
      weekMeditacao,
      weekExercicio,
      isModalWorkoutVisible,
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
                <Button title="X" onPress={this.onButtonPress} />
                <ViewModal style={{flex: 1}}>
                  <Standard data={dataModal} onPress={this.handleSubmit} />
                </ViewModal>
              </ScrollView>
            </KeyboardAvoidingView>
          </Modal>
        )}
        <Background>
          <Container>
            {/* <DateInput date={this.state.date} onChange={this.changeDate} /> */}
            <ViewButton>
              <LeftButton onPress={this.navigationDayLeft}>
                <Icon name="chevron-left" color="#3b9eff" size={20} />
              </LeftButton>
              <DateButton
                onPress={() => {
                  this.setState({
                    display: display === 'none' ? 'flex' : 'none',
                  });
                }}>
                {/* <Icon name="event" color="#3b9eff" size={20} /> */}
                <DateText>{dateFormated}</DateText>
              </DateButton>
              <RightButton onPress={this.navigationDayRight}>
                <Icon name="chevron-right" color="#3b9eff" size={20} />
              </RightButton>
            </ViewButton>

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

            <MainView>
              <List bounces={false}>
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
                {weekSono && weekSono.points && (
                  <DayChart
                    key={weekSono.key}
                    days={weekSono.dates}
                    points={weekSono.points}
                    colors={weekSono.colors}
                  />
                )}

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

                {weekAlimentacao.points && weekAlimentacao.dates && (
                  <DayChart
                    key={weekAlimentacao.key}
                    days={weekAlimentacao.dates}
                    points={weekAlimentacao.points}
                    colors={weekAlimentacao.colors}
                  />
                )}

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

                {weekMeditacao && weekMeditacao.points && (
                  <DayChart
                    key={weekMeditacao.key}
                    days={weekMeditacao.dates}
                    points={weekMeditacao.points}
                    colors={weekMeditacao.colors}
                  />
                )}

                <ButtonName>
                  Exercício
                  <Icon
                    name="help"
                    size={20}
                    defaultStyle={{marginLeft: 20, marginTop: 10}}
                    color="#333"
                    onPress={this.toggleWorkoutModal}
                  />
                </ButtonName>
                <RadioForm
                  ref={(child) => {
                    this.child = child;
                  }}
                  {...this.props}
                  animation={false}
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
                {weekExercicio && weekExercicio.points && (
                  <DayChart
                    key={weekExercicio.key}
                    days={weekExercicio.dates}
                    points={weekExercicio.points}
                    colors={weekExercicio.colors}
                  />
                )}

                <Total>
                  <TotalText>Total</TotalText>
                  <TotalValue>{this.state.total}</TotalValue>
                </Total>

                {this.state.buttonShow ? (
                  <SubmitButton onPress={this.handleSubmit}>
                    Salvar
                  </SubmitButton>
                ) : null}
              </List>
            </MainView>
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
        <Modal
          isVisible={isModalWorkoutVisible}
          onPress={this.toggleWorkoutModal}>
          <KeyboardAvoidingView
            enabled
            behavior={Platform.OS === 'android' ? undefined : 'position'}>
            <ScrollView
              scrollEnabled={false}
              keyboardShouldPersistTaps="handled">
              <WorkoutModal>
                <ButtonClose>
                  <Icon
                    name="close"
                    size={20}
                    color="#333"
                    onPress={this.toggleWorkoutModal}
                  />
                </ButtonClose>
                <Text>{json['Exercício']}</Text>
              </WorkoutModal>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
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
