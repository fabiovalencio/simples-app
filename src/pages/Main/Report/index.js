import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import 'moment/locale/pt-br';
import {format, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';
import {
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Button,
  Dimensions,
} from 'react-native';
import {LineChart, YAxis, XAxis} from 'react-native-svg-charts';
import {G, Line, Rect, Text} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation-locker';
import Modal from 'react-native-modal';
import {
  Table,
  TableWrapper,
  Row,
  Rows,
  Col,
} from 'react-native-table-component';

import api from '~/services/api';
import Background from '~/components/Background';
import rotateDevice from '~/assets/rotatedevice.gif';

import {
  Container,
  Title,
  List,
  Negative,
  Positive,
  Separator,
  View,
  DateButton,
  LeftButton,
  RightButton,
  DateText,
  Stretch,
  MainView,
  SimpleView,
  StyledButton,
  ViewModal,
  ViewTableModal,
} from './styles';

// const propTypes = {
//   navigation: PropTypes.shape({
//     navigate: PropTypes.func,
//   }),
// };
const {width, height} = Dimensions.get('window');
const exercicePoints = {
  0: '0',
  1: '2',
  2: '2',
  3: '7',
  4: '7',
  5: '14',
  6: '14',
  7: '15',
};

export default class WeekResult extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this._willFocusSubscription = navigation.addListener(
      'willFocus',
      (payload) => {
        // lock to landscape
        Orientation.unlockAllOrientations();
        Orientation.addOrientationListener(this._onOrientationDidChange);
      },
    );

    this.state = {
      isModalVisible: false,
      isTableVisible: false,
      date: new Date(),
      week: 0,
      weeks: [],
      current_week: null,
      names: [],
      weekData: [null, 0, 0, 0, 0, null],
      weekC: [],
      positive: null,
      negative: null,
      dateFormated: '',
      week_days: ['S', 'T', 'Q', 'Q', 'S', 'S', 'D'],
      last_day: null,
      next_day: null,
      tableHead: ['Dimensões', 'T', 'Q', 'Q', 'S', 'S', 'D', 'S', 'T'],
      tableTitle: [
        'Sono',
        'Alimentação',
        'Meditação',
        'Exercício',
        'Análise',
        'Lazer ativo',
        'Vida amorosa',
      ],
      tableData: [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ],
    };
    this.navigationDayLeft = this.navigationDayLeft.bind(this);
    this.navigationDayRight = this.navigationDayRight.bind(this);
  }

  componentDidMount = async () => {
    this.setData(new Date());
    this.getWeekTablePoints(new Date());
    const week = await api.get('/user-week-number', {
      params: {
        date: new Date(),
      },
    });
    this.setState({current_week: week.data.week});
  };

  componentWillUnmount() {
    // remove subscription either
    Orientation.removeOrientationListener(this._onOrientationDidChange);
    this._willFocusSubscription.remove();
  }

  getWeekTablePoints = async (date, asc = false) => {
    const {tableTitle} = this.state;

    const weeksPoints = await api.get('/points/weeks', {
      params: {
        date,
        asc,
      },
    });

    const {week} = weeksPoints.data;

    const current_week = weeksPoints.data.weeks.find((w) => w.week === week);
    const dd = moment(current_week.days[0]).utc().isoWeekday();
    moment.updateLocale('pt-br', {
      week: {
        dow: dd,
      },
    });
    const days = Array.apply(null, Array(7)).map(function (_, i) {
      return moment(i, 'e').format('dd');
    });
    days.unshift('Dimensões');
    days.push('TT');

    let arr = [
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0],
      [[0]],
      [[0]],
      [[0]],
    ];

    current_week.notes.forEach(function (n) {
      let nsn = tableTitle.indexOf(n.subject.name);
      let ndw = days.indexOf(moment(n.date, 'YYYY-MM-DD').format('dd'));
      arr[nsn][ndw - 1] = n.points;
    });

    current_week.workout.forEach(function (w) {
      let wdw = days.indexOf(moment(w.date, 'YYYY-MM-DD').format('dd'));
      arr[3][wdw - 1] = 1;
    });

    current_week.adjuncts.forEach(function (a) {
      let asn = tableTitle.indexOf(a.weekSubject.name);
      arr[asn] = [a.points];
    });

    arr.map((item, k) => {
      arr[k][7] = 0;
      let tt = item.reduce(function (a, b) {
        return a + b;
      });
      if (k < 4) {
        if (k === 3) {
          tt = exercicePoints[tt];
        }
        arr[k][7] = tt;
      }
      if (k > 3) {
        arr[k].splice(7, 1);
      }
    });

    await new Promise((resolve) =>
      this.setState(
        {
          tableHead: days,
          tableData: arr,
        },
        () => resolve(),
      ),
    );
  };

  async setData(date, asc = false) {
    const weeksPoints = await api.get('/points/weeks', {
      params: {
        date,
        asc,
      },
    });

    const {week_days, week, last_day, next_day} = weeksPoints.data;

    const dateFormated = this.formatDate(week_days, week);
    const points = [];
    const weeks = [];
    const names = [];
    const colors = [];
    let positive = null;
    let negative = null;
    points.push(null);
    weeks.push(null);
    names.push(null);

    weeksPoints.data.weeks.forEach(function (v) {
      points.push(v.points);
      names.push(`sem ${v.week}`);
      weeks.push({week: v.week, days: v.days, associations: v.associations});
      colors.push('#ccc');
      if (week === v.week) {
        colors.pop();
        colors.push('#3b9eff');
        positive = v.associations[0] ? v.associations[0].positive : null;
        negative = v.associations[0] ? v.associations[0].negative : null;
      }
    });
    points.push(null);
    weeks.push(null);
    names.push(null);

    await new Promise((resolve) =>
      this.setState(
        {
          dateFormated,
          weekData: points,
          positive,
          negative,
          week,
          weeks,
          weekC: colors,
          names,
          last_day,
          next_day,
        },
        () => resolve(),
      ),
    );
  }

  _onOrientationDidChange = (orientation) => {
    const {navigation} = this.props;
    if (orientation !== 'PORTRAIT') {
      navigation.navigate('FullScreen');
    }
  };

  formatDate = (date, week) => {
    const firstDayWeek = moment(date[0]).utc().format('YYYY-MM-DD');
    const lastDayWeek = moment(date[1]).utc().format('YYYY-MM-DD');

    return `${format(parseISO(firstDayWeek), "dd'/'MM", {
      locale: pt,
    })} a ${format(parseISO(lastDayWeek), "dd'/'MM", {
      locale: pt,
    })} - Semana ${week}`;
  };

  async navigationDayLeft() {
    const {week, weeks, last_day} = this.state;
    if (week === 1) {
      return;
    }
    const w = weeks.filter((d) => d);

    if (w[0].week === week && week > 1) {
      this.setData(last_day);
      this.getWeekTablePoints(last_day);
    }

    w.map((item, k) => {
      if (item.week === week - 1) {
        this.toolTipHandler(k);
      }
    });
  }

  async navigationDayRight() {
    const {week, weeks, next_day, current_week} = this.state;
    if (week === current_week - 1) {
      return;
    }
    const w = weeks.filter((d) => d);

    w.map((item, k) => {
      if (item.week === week + 1) {
        this.toolTipHandler(k);
        this.getWeekTablePoints(item.days[0], true);
      }
    });

    if (w[w.length - 1].week === week) {
      this.setData(next_day, true);
      this.getWeekTablePoints(next_day, true);
    }
  }

  toolTipHandler(i) {
    const nWeek = [];
    let positive = null;
    let negative = null;
    let dateFormated = null;
    const {weekC, weeks} = this.state;
    weekC.map((item, k) => {
      item = '#ccc';
      if (i === k) {
        item = '#3b9eff';
        const {associations, days, week} = weeks[i + 1];
        positive = associations[0] ? associations[0].positive : null;
        negative = associations[0] ? associations[0].negative : null;
        dateFormated = this.formatDate(days, week);
        this.setState({
          week,
        });
        this.getWeekTablePoints(days[1]);
      }
      nWeek.push(item);
    });

    this.setState({
      weekC: nWeek,
      dateFormated,
      positive,
      negative,
    });
  }

  toggleModal = () => {
    const {isModalVisible} = this.state;
    this.setState({isModalVisible: !isModalVisible});
  };

  toggleTableModal = () => {
    const {isTableVisible} = this.state;
    this.setState({isTableVisible: !isTableVisible});
  };

  render() {
    const {
      isModalVisible,
      isTableVisible,
      weekData,
      dateFormated,
      positive,
      negative,
      weekC,
      names,
      tableHead,
      tableTitle,
      tableData,
    } = this.state;
    const label = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    const Tooltip = ({x, y, data}) => {
      data = data.filter((d) => d);

      return data.map((value, index) => (
        <G
          x={x(index + 1) - 80 / 2}
          key={index.toString()}
          onPress={() => this.toolTipHandler(index)}>
          <G>
            <Rect
              height={30}
              width={30}
              stroke={weekC[index]}
              fill="white"
              ry={15}
              rx={15}
              x={24.5}
              y={y(value) - 15}
            />
            <Text
              x={39}
              y={y(value)}
              alignmentBaseline="middle"
              textAnchor="middle"
              stroke={weekC[index]}>
              {value}
            </Text>
          </G>
        </G>
      ));
    };

    const CustomGrid = ({x, y, data, ticks}) => (
      <G>
        {// Horizontal grid
        ticks.map((tick) => (
          <Line
            key={tick}
            x1="0%"
            x2="100%"
            y1={y(tick)}
            y2={y(tick)}
            stroke="rgba(0,0,0,0.2)"
          />
        ))}
        {// Vertical grid
        data.map((_, index) => (
          <Line
            key={index}
            y1="0%"
            y2="100%"
            x1={x(index)}
            x2={x(index)}
            stroke="rgba(0,0,0,0.2)"
          />
        ))}
      </G>
    );
    return (
      <>
        <Background>
          <Container>
            <View>
              <LeftButton onPress={this.navigationDayLeft}>
                <Icon name="chevron-left" color="#3b9eff" size={20} />
              </LeftButton>
              <DateButton activeOpacity={1}>
                {/* <Icon name="event" color="#3b9eff" size={20} /> */}
                <DateText>{dateFormated}</DateText>
              </DateButton>
              <RightButton onPress={this.navigationDayRight}>
                <Icon name="chevron-right" color="#3b9eff" size={20} />
              </RightButton>
            </View>
            <LinearGradient
              style={styles.view}
              colors={['#00FF40', '#FFD20F', '#FF8F35', '#FF4B4B']}>
              <YAxis
                data={label}
                contentInset={{left: 10, bottom: 25, top: 30, color: '#fff'}}
                svg={{
                  fill: '#fff',
                  fontSize: 15,
                }}
                numberOfTicks={10}
              />
              <Stretch source={rotateDevice} />
              <LineChart
                style={styles.chart}
                data={weekData}
                svg={{stroke: 'rgba(255, 255, 255, 0.8)'}}
                gridMin={0}
                gridMax={102}
                numberOfTicks={9}
                contentInset={{top: 10, bottom: 10}}>
                <Tooltip />
                <CustomGrid belowChart />
              </LineChart>
              <XAxis
                style={styles.xaxis}
                data={weekData}
                formatLabel={(index) =>
                  names[index] !== null ? names[index] : ''
                }
                contentInset={{left: 15, right: 15}}
                svg={{fontSize: 10, fill: 'white'}}
              />
            </LinearGradient>
            {height > 800 && (
              <MainView>
                <Table borderStyle={{borderWidth: 1}}>
                  <Row
                    data={tableHead}
                    flexArr={[3.8, 1, 1, 1, 1, 1, 1, 1]}
                    style={styles.head}
                    textStyle={styles.text}
                  />
                  <TableWrapper style={styles.wrapper}>
                    <Col
                      data={tableTitle}
                      style={styles.title}
                      heightArr={[28, 28]}
                      textStyle={(styles.text, {textAlign: 'left'})}
                    />
                    <Rows
                      data={tableData}
                      flexArr={[1, 1, 1, 1, 1, 1, 1]}
                      style={styles.row}
                      textStyle={styles.text}
                    />
                  </TableWrapper>
                </Table>
              </MainView>
            )}

            {height <= 800 && (
              <SimpleView>
                <StyledButton onPress={this.toggleTableModal}>
                  Tabela de pontos
                </StyledButton>
              </SimpleView>
            )}
            <SimpleView>
              <StyledButton onPress={this.toggleModal}>
                Associações Significativas
              </StyledButton>
            </SimpleView>
          </Container>
        </Background>
        <Modal
          isVisible={isModalVisible}
          style={{
            margin: 0,
            justifyContent: 'flex-end',
          }}
          customBackdrop={
            <TouchableWithoutFeedback onPress={this.toggleModal}>
              <ViewModal
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
              <Button title="X" onPress={this.toggleModal} />
              <ViewModal style={{flex: 1}}>
                <Positive>
                  {positive ||
                    'Você não criou nenhuma anotação positiva da sua semana. Tudo bem, mas quando precisar deixe anotado aqui. Essa é uma forma de você se conhecer melhor'}
                </Positive>
                <Separator />
                <Negative>
                  {negative ||
                    'Você não criou nenhuma anotação negativa da sua semana. Tudo bem, mas quando precisar deixe anotado aqui. Essa é uma forma de você se conhecer melhor'}
                </Negative>
              </ViewModal>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>

        <Modal
          isVisible={isTableVisible}
          style={{
            margin: 0,
            justifyContent: 'flex-end',
          }}
          customBackdrop={
            <TouchableWithoutFeedback onPress={this.toggleTableModal}>
              <ViewModal
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
              <Button title="X" onPress={this.toggleTableModal} />
              <ViewTableModal>
                <MainView>
                  <Table borderStyle={{borderWidth: 1}}>
                    <Row
                      data={tableHead}
                      flexArr={[3, 1, 1, 1, 1, 1, 1, 1]}
                      style={styles.head}
                      textStyle={styles.text}
                    />
                    <TableWrapper style={styles.wrapper}>
                      <Col
                        data={tableTitle}
                        style={styles.title}
                        heightArr={[28, 28]}
                        textStyle={(styles.text, {textAlign: 'left'})}
                      />
                      <Rows
                        data={tableData}
                        flexArr={[1, 1, 1, 1, 1, 1, 1]}
                        style={styles.row}
                        textStyle={styles.text}
                      />
                    </TableWrapper>
                  </Table>
                </MainView>
              </ViewTableModal>
            </ScrollView>
          </KeyboardAvoidingView>
        </Modal>
      </>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    marginTop: 0,
    height: 300,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 3,
  },
  chart: {
    height: 290,
    width: 387,
    color: '#fff',
    marginVertical: 20,
  },
  xaxis: {
    width: 400,
    height: 10,
    marginHorizontal: -400,
    marginVertical: 285,
    marginRight: 20,
  },
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 30,
    backgroundColor: '#fff',
  },
  head: {height: 40, backgroundColor: '#f1f8ff'},
  wrapper: {flexDirection: 'row'},
  title: {flex: 0, backgroundColor: '#f1f8ff'},
  row: {height: 28},
  text: {textAlign: 'center'},
});

WeekResult.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

WeekResult.navigationOptions = {
  title: null,
  tabBarLabel: 'Relatórios',
  tabBarIcon: ({tintColor}) => (
    <Icon name="show-chart" size={20} color={tintColor} />
  ),
};
