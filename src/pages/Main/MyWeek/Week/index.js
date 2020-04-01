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
import {format, getYear, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';
import Modal from 'react-native-modal';
import Orientation from 'react-native-orientation-locker';
import RadioButton from '~/components/RadioButton';
import api from '~/services/api';
import Background from '~/components/Background';
import Standard from '~/pages/Main/Config/Standard';

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
} from './styles';

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default class Week extends Component {
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
      user: {},
      date: new Date(),
      amor: [],
      analise: [],
      lazer: [],
      dataAmor: [],
      dataAnalise: [],
      dataLazer: [],
      amorValue: null,
      analiseValue: null,
      lazerValue: null,
      total: 0,
      buttonShow: false,
      disabled: false,
      dateFormated: '',
      firstDayWeek: '',
      lastDayWeek: '',
      week: '',
      display: 'none',
      phrase: 'como foi a sua semana?',
      dataFromApi: false,
      dataModal: null,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async getUserData() {
    const {date} = this.state;
    const res = await api.get('/user-last-week', {
      params: {
        date,
      },
    });

    const firstDayWeek = moment(res.data.week[0]).utc().format('YYYY-MM-DD');
    const lastDayWeek = moment(res.data.week[1]).utc().format('YYYY-MM-DD');
    const week = res.data.week_number;
    // const userWeekDay = res.data.week_day;
    const dateFormated = `${format(parseISO(firstDayWeek), "dd'/'MM", {
      locale: pt,
    })} a ${format(parseISO(lastDayWeek), "dd'/'MM", {
      locale: pt,
    })} - Semana ${week}`;

    await new Promise((resolve) =>
      this.setState(
        {
          dateFormated,
          lastDayWeek,
          firstDayWeek,
          week,
          year: getYear(parseISO(firstDayWeek)),
        },
        () => resolve(),
      ),
    );

    try {
      const response = await api.get(`/adjuncts/${week}`);
      this.setData(response.data);
    } catch (error) {}
  }

  componentDidMount = async () => {
    const subjects = await api.get('/week-subjects');
    this.fecthDataJson(subjects.data.subject, 'Análise');
    this.fecthDataJson(subjects.data.subject, 'Lazer ativo');
    this.fecthDataJson(subjects.data.subject, 'Vida amorosa');
    await this.getUserData();
    const persist = await AsyncStorage.getItem('persist:simples');
    const simples = JSON.parse(persist);
    const users = JSON.parse(simples.user);

    if (users) {
      this.setState({user: users.profile});
    }

    this.state.date.setHours(0, 0, 0, 0);
  };

  setTotal() {
    this.setState({
      total:
        this.state.amorValue + this.state.analiseValue + this.state.lazerValue,
    });
  }

  onButtonPress = () => {
    const {isModalVisible} = this.state;
    this.setState({isModalVisible: !isModalVisible});
  };

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

    const arramor = this.state.amor;
    const arranalise = this.state.analise;
    const arrlazer = this.state.lazer;

    this.setState((previousState) => ({
      amor: [...previousState.amor, json],
      analise: [...previousState.analise, json],
      lazer: [...previousState.lazer, json],
    }));

    this.changeamorButton(3);
    this.changeanaliseButton(3);
    this.changelazerButton(3);

    this.setState({
      amor: arramor,
      analise: arranalise,
      lazer: arrlazer,
    });

    data.data.map((item) => {
      this.setState({
        disabled: true,
        buttonShow: false,
        dataFromApi: true,
        phrase: 'veja como foi a sua semana.',
      });

      if (item.weekSubject.name === 'Análise') {
        this.changeanaliseButton(item.points / 5);
      } else if (item.weekSubject.name === 'Lazer ativo') {
        this.changelazerButton(item.points / 3);
      } else if (item.weekSubject.name === 'Vida amorosa') {
        this.changeamorButton(item.points / 3);
      }
    });
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
            length: length === 4 ? 55 : 95,
            selected: false,
          };
          arr.push(json);
        });

        if (name === 'Análise') {
          this.setState({dataAnalise: sub, analise: arr});
        } else if (name === 'Lazer ativo') {
          this.setState({dataLazer: sub, lazer: arr});
        } else if (name === 'Vida amorosa') {
          this.setState({dataAmor: sub, amor: arr});
        }
      }
    });
  }

  changeButtonState() {
    if (
      this.state.amorValue > 0 &&
      this.state.analiseValue >= 0 &&
      this.state.lazerValue > 0 &&
      !this.state.dataFromApi
    ) {
      this.state.buttonShow = true;
    }
  }

  async changeamorButton(index) {
    const {amor} = this.state;
    amor.map((item) => {
      item.selected = false;
    });

    amor[index].selected = true;
    this.state.amorValue = amor[index].value;
    this.setTotal();
    this.changeButtonState();
  }

  async changeanaliseButton(index) {
    const {analise} = this.state;
    analise.map((item) => {
      item.selected = false;
    });

    analise[index].selected = true;
    this.state.analiseValue = analise[index].value;
    this.setTotal();
    this.changeButtonState();
  }

  changelazerButton(index) {
    const {lazer} = this.state;
    lazer.map((item) => {
      item.selected = false;
    });

    lazer[index].selected = true;
    this.state.lazerValue = lazer[index].value;
    this.setTotal();
    this.changeButtonState();
  }

  async handleSubmit() {
    const {
      amorValue,
      week,
      year,
      amor,
      analiseValue,
      analise,
      lazerValue,
      lazer,
      total,
    } = this.state;

    await api.post('/adjuncts', {
      points: amorValue,
      week,
      year,
      week_subjects_id: amor[0].id,
    });

    await api.post('/adjuncts', {
      points: analiseValue,
      week,
      year,
      week_subjects_id: analise[0].id,
    });

    await api
      .post('/adjuncts', {
        points: lazerValue,
        week,
        year,
        week_subjects_id: lazer[0].id,
      })
      .then(this.setState({buttonShow: false}));

    const {navigation} = this.props;
    const points = total;

    navigation.navigate('weekPoints', {
      points,
      week,
      year,
    });
  }

  async toggleModal(t) {
    const {isModalVisible, dataAnalise, dataLazer, dataAmor} = this.state;

    const standards = await api.get('/week-standard');

    const {standard} = standards.data;
    const analise = standard.filter(function (o) {
      return o.week_subject.name === 'Análise';
    });

    const lazer = standard.filter(function (o) {
      return o.week_subject.name === 'Lazer ativo';
    });

    const amor = standard.filter(function (o) {
      return o.week_subject.name === 'Vida amorosa';
    });

    switch (t) {
      case 'analise':
        this.setState({
          dataModal: {
            data: dataAnalise,
            standard: analise,
            url: '/week-standard',
          },
        });
        break;
      case 'lazer':
        this.setState({
          dataModal: {
            data: dataLazer,
            standard: lazer,
            url: '/week-standard',
          },
        });
        break;
      case 'amor':
        this.setState({
          dataModal: {
            data: dataAmor,
            standard: amor,
            url: '/week-standard',
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
      display,
      dateFormated,
      firstDayWeek,
      lastDayWeek,
      user,
      phrase,
      analise,
      lazer,
      disabled,
      amor,
      total,
      buttonShow,
      dataModal,
      isModalVisible,
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
          {/* {dateFormated ? ( */}
          <Container>
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

            {firstDayWeek ? (
              <ViewPoint display={display}>
                <CalendarPicker
                  allowRangeSelection
                  selectedDayColor="#ccc"
                  minDate={firstDayWeek}
                  maxDate={lastDayWeek}
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
                  previousTitle=" "
                  nextTitle=" "
                  selectedStartDate={firstDayWeek}
                  selectedEndDate={lastDayWeek}
                  scaleFactor={450}
                  enableDateChange={false}
                  restrictMonthNavigation
                  enableSwipe={false}
                />
              </ViewPoint>
            ) : null}

            <List>
              <Name>
                <HelloName>Olá {user.name},</HelloName>
                {'\n'} {'\n'} {phrase}
              </Name>

              <ButtonName>
                Análise
                <Icon
                  name="help"
                  size={20}
                  style={{marginLeft: 20, marginTop: 10}}
                  color="#333"
                  onPress={this.toggleModal.bind(this, 'analise')}
                />
              </ButtonName>
              <ContainerRadio>
                {analise.map((item, key) => (
                  <RadioButton
                    disabled={disabled}
                    key={key}
                    button={item}
                    onClick={this.changeanaliseButton.bind(this, key)}
                  />
                ))}
              </ContainerRadio>

              <Separator>__ _ __</Separator>

              <ButtonName>
                lazer ativo
                <Icon
                  name="help"
                  size={20}
                  defaultStyle={{marginLeft: 20, marginTop: 10}}
                  color="#333"
                  onPress={this.toggleModal.bind(this, 'lazer')}
                />
              </ButtonName>
              <ContainerRadio>
                {lazer.map((item, key) => (
                  <RadioButton
                    disabled={disabled}
                    key={key}
                    button={item}
                    onClick={this.changelazerButton.bind(this, key)}
                  />
                ))}
              </ContainerRadio>

              <Separator>__ _ __</Separator>

              <ButtonName>
                Vida Amorosa
                <Icon
                  name="help"
                  size={20}
                  iconStyle={{marginLeft: 20, marginTop: 10}}
                  color="#333"
                  onPress={this.toggleModal.bind(this, 'amor')}
                />
              </ButtonName>
              <ContainerRadio>
                {amor.map((item, key) => (
                  <RadioButton
                    disabled={disabled}
                    key={key}
                    button={item}
                    onClick={this.changeamorButton.bind(this, key)}
                  />
                ))}
              </ContainerRadio>

              <Total>
                <TotalText>Total</TotalText>
                <TotalValue>{total}</TotalValue>
              </Total>

              {buttonShow ? (
                <SubmitButton onPress={this.handleSubmit}>Salvar</SubmitButton>
              ) : null}
            </List>
          </Container>
          {/* ) : null} */}
        </Background>
      </>
    );
  }
}

Week.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

Week.navigationOptions = {
  title: null,
  tabBarLabel: 'Minha semana',
  tabBarIcon: ({tintColor}) => (
    <Icon name="today" size={20} color={tintColor} />
  ),
};
