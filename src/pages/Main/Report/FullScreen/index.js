import React, {Component} from 'react';
import PropTypes from 'prop-types';

import Orientation from 'react-native-orientation-locker';
import {StyleSheet} from 'react-native';
import {LineChart, YAxis, XAxis} from 'react-native-svg-charts';
import {G, Line, Rect, Text} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';
import api from '../../../../services/api';
import Background from '../../../../components/Background';

import {Container} from './styles';

const propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func,
  }),
};

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    marginTop: 10,
    height: 320,
    width: 825,
    borderColor: '#fff',
    borderWidth: 1,
    borderRadius: 3,
  },
  chart: {
    height: 310,
    width: 780,
    marginHorizontal: 10,
    color: '#fff',
    marginVertical: 20,
  },
  xaxis: {
    width: 800,
    height: 10,
    marginHorizontal: -820,
    marginVertical: 300,
    marginRight: 20,
  },
});

export default class FullScreen extends Component {
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

    let deviceOrientation = null;
    Orientation.getDeviceOrientation(orientation => {
      deviceOrientation = orientation;
    });

    this.state = {
      date: new Date(),
      weekData: [null, 0, 0, 0, 0, null],
      weekC: [],
      orientation: deviceOrientation,
    };
    console.tron.log(this.state.orientation);
  }

  componentDidMount = async () => {
    const {date} = this.state;
    const weeksPoints = await api.get(`/points/weeks`, {
      params: {
        date,
        limit: 20,
      },
    });

    const points = [];
    const weeks = [];
    const colors = [];
    points.push(null);
    weeks.push(null);

    weeksPoints.data.weeks.forEach(function(v) {
      points.push(v.points);
      weeks.push({week: v.week, days: v.days, associations: v.associations});
      colors.push(null);
    });
    points.push(null);
    weeks.push(null);

    await new Promise(resolve =>
      this.setState(
        {
          weekData: points,
          weekC: colors,
        },
        () => resolve(),
      ),
    );
  };

  componentWillUnmount() {
    // remove subscription either
    Orientation.removeOrientationListener(this._onOrientationDidChange);
    this._willFocusSubscription.remove();
  }

  _onOrientationDidChange = () => {
    const {navigation} = this.props;
    setTimeout(() => {
      navigation.goBack();
    }, 50);
  };

  render() {
    const {weekData, weekC} = this.state;
    const label = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    const Tooltip = ({x, y, data}) => {
      data = data.filter(d => d);

      return data.map((value, index) => (
        <G
          x={x(index + 1) - 75 / 2}
          key={index.toString()}
          // onPress={() => this.toolTipHandler(index)}
        >
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
            key={index.toString()}
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
              formatLabel={index =>
                weekData[index] !== null ? `Sem ${index}` : ''
              }
              contentInset={{left: 15, right: 15}}
              svg={{fontSize: 10, fill: 'white'}}
            />
          </LinearGradient>
        </Container>
      </Background>
    );
  }
}

FullScreen.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

FullScreen.navigationOptions = {
  title: null,
  headerLeft: () => {},
};
