import React from 'react';
import {StyleSheet} from 'react-native';
import {LineChart, YAxis, XAxis} from 'react-native-svg-charts';
import {G, Line, Rect, Text} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

export default class Chart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      week: props.week,
    };
  }

  toolTipHandler(i) {
    const nWeek = [];
    const {week} = this.state;
    week.map((item, k) => {
      item = 'gray';
      if (i === k) {
        item = 'blue';
      }
      nWeek.push(item);
    });

    this.setState({
      week: nWeek,
    });
  }

  render() {
    const label = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

    const Tooltip = ({x, y, data}) => {
      data = data.filter(d => d);
      const {week} = this.state;
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
              stroke={week[index]}
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
              stroke={week[index]}>
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
      <LinearGradient
        style={styles.view}
        colors={['#00FF40', '#FFD20F', '#FF8F35', '#FF4B4B']}
        onPress={this.props.onClick}>
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
          data={this.props.data}
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
          data={this.props.data}
          formatLabel={index =>
            this.props.data[index] !== null ? `Sem ${index}` : ''
          }
          contentInset={{left: 15, right: 15}}
          svg={{fontSize: 10, fill: 'white'}}
        />
      </LinearGradient>
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
