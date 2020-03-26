import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Icon from 'react-native-vector-icons/MaterialIcons';
import moment from 'moment';
import {format, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';
import {StyleSheet} from 'react-native';
import {LineChart, YAxis, XAxis} from 'react-native-svg-charts';
import {G, Line, Rect, Text} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import Orientation from 'react-native-orientation-locker';
import api from '../../../services/api';
import Background from '../../../components/Background';

import rotateDevice from '../../../assets/rotatedevice.gif';

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
} from './styles';

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

export default class WeekResult extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this._willFocusSubscription = navigation.addListener(
      'willFocus',
      payload => {
        // lock to landscape
        Orientation.unlockAllOrientations();
        Orientation.addOrientationListener(this._onOrientationDidChange);
      },
    );

    this.state = {
      date: new Date(),
      week: 0,
      weeks: [],
      names: [],
      weekData: [null, 0, 0, 0, 0, null],
      weekC: [],
      positive: null,
      negative: null,
      dateFormated: '',
      last_day: null,
      next_day: null,
    };
    this.navigationDayLeft = this.navigationDayLeft.bind(this);
    this.navigationDayRight = this.navigationDayRight.bind(this);
  }

  componentDidMount = async () => {
    this.setData(new Date());
  };

  componentWillUnmount() {
    // remove subscription either
    Orientation.removeOrientationListener(this._onOrientationDidChange);
    this._willFocusSubscription.remove();
  }

  async setData(date, asc = false) {
    const weeksPoints = await api.get(`/points/weeks`, {
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

    weeksPoints.data.weeks.forEach(function(v) {
      points.push(v.points);
      names.push(`sem ${v.week}`);
      weeks.push({week: v.week, days: v.days, associations: v.associations});
      colors.push(null);
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

    await new Promise(resolve =>
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

  _onOrientationDidChange = orientation => {
    const {navigation} = this.props;
    if (orientation !== 'PORTRAIT') {
      navigation.navigate('FullScreen');
    }
  };

  formatDate = (date, week) => {
    const firstDayWeek = moment(date[0])
      .utc()
      .format('YYYY-MM-DD');
    const lastDayWeek = moment(date[1])
      .utc()
      .format('YYYY-MM-DD');

    return `${format(parseISO(firstDayWeek), "dd'/'MM", {
      locale: pt,
    })} a ${format(parseISO(lastDayWeek), "dd'/'MM", {
      locale: pt,
    })} - Semana ${week}`;
  };

  async navigationDayLeft() {
    const {week, weeks, last_day} = this.state;
    const w = weeks.filter(d => d);

    if (w[0].week === week && week > 1) {
      this.setData(last_day);
    }

    w.map((item, k) => {
      if (item.week === week - 1) {
        this.toolTipHandler(k);
      }
    });
  }

  async navigationDayRight() {
    const {week, weeks, next_day} = this.state;
    const w = weeks.filter(d => d);

    w.map((item, k) => {
      if (item.week === week + 1) {
        this.toolTipHandler(k);
      }
    });

    if (w[w.length - 1].week === week) {
      this.setData(next_day, true);
    }
  }

  toolTipHandler(i) {
    const nWeek = [];
    let positive = null;
    let negative = null;
    let dateFormated = null;
    const {weekC, weeks} = this.state;
    weekC.map((item, k) => {
      item = null;
      if (i === k) {
        item = '#3b9eff';
        const {associations, days, week} = weeks[i + 1];
        positive = associations[0] ? associations[0].positive : null;
        negative = associations[0] ? associations[0].negative : null;
        dateFormated = this.formatDate(days, week);
        this.setState({
          week,
        });
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

  render() {
    const {
      weekData,
      dateFormated,
      positive,
      negative,
      weekC,
      names,
    } = this.state;
    const label = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    const Tooltip = ({x, y, data}) => {
      data = data.filter(d => d);

      return data.map((value, index) => (
        <G
          x={x(index + 1) - 75 / 2}
          key={index.toString()}
          onPress={() => this.toolTipHandler(index)}>
          <G>
            <Rect
              height={40}
              width={40}
              stroke={weekC[index]}
              fill="white"
              ry={20}
              rx={20}
              x={19.5}
              y={y(value) - 19.5}
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
        ticks.map(tick => (
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
              gridMax={100}
              numberOfTicks={9}
              contentInset={{top: 10, bottom: 10}}>
              <Tooltip />
              <CustomGrid belowChart />
            </LineChart>
            <XAxis
              style={styles.xaxis}
              data={weekData}
              formatLabel={index => (names[index] !== null ? names[index] : '')}
              contentInset={{left: 15, right: 15}}
              svg={{fontSize: 10, fill: 'white'}}
            />
          </LinearGradient>

          <Title>Associações Significativas</Title>
          <List>
            <Positive>
              {positive ||
                'Você não criou nenhuma anotação positiva da sua semana, tudo bem, mas quando precisar deixe anotado aqui.'}
            </Positive>
            <Separator />
            <Negative>
              {negative ||
                'Você não criou nenhuma anotação negativa da sua semana, tudo bem, mas quando precisar deixe anotado aqui.'}
            </Negative>
          </List>
        </Container>
      </Background>
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
