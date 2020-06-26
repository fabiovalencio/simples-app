import React from 'react';
import {StyleSheet} from 'react-native';
import {LineChart, YAxis, XAxis} from 'react-native-svg-charts';
import {G, Line, Rect, Text} from 'react-native-svg';
import LinearGradient from 'react-native-linear-gradient';

export default class DayChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      days: props.days,
      points: props.points,
      arrP: props.points,
      colors: props.colors,
      fator: props.fator ? props.fator : 1,
      max: props.max ? props.max : 6,
    };
  }

  getAverageColor() {
    const {points, colors, fator} = this.state;
    let i = null;

    try {
      let average = points.map(Number).reduce((a, b) => a + b) / points.length;

      if (points.indexOf(0.01) !== -1 && fator === 1) {
        i = Math.round(average);
      } else if (average <= 1) {
        i = average;
      } else {
        if (fator === 1) {
          i = Math.round(average - 1);
        } else {
          i = Math.round(average / fator);
        }
      }

      let color = colors[i];

      return `#${color.replace(/ /g, '')}`;
    } catch (error) {
      return '#00FF40';
    }
  }

  getColor(index) {
    const {points, colors, fator} = this.state;

    let i = null;
    let c = null;
    try {
      if (points.indexOf(0.01) !== -1 && fator === 1) {
        i = Math.round(points[index]);
      } else if (fator === 1 && points[index] <= 1) {
        i = Math.round(points[index]);
      } else {
        if (fator === 1) {
          i = Math.round(points[index] - 1);
        } else {
          i = Math.round(points[index] / fator);
        }
      }

      c = `#${colors[i].replace(/ /g, '')}`;
    } catch (error) {
      return '#00FF40';
    }

    return c;
  }

  render() {
    const {days, points, max} = this.state;

    const Tooltip = ({x, y, data}) => {
      data = data.filter((d) => d);
      return data.map((value, index) => (
        <G x={x(index)} key={index.toString()}>
          <G>
            <Rect
              height={20}
              width={20}
              fill={'#FFF'}
              ry={10}
              rx={10}
              x={-5}
              y={y(value) - 10}
            />
            <Text
              x={+5}
              y={y(value)}
              width={1}
              fill={this.getColor(index)}
              alignmentBaseline="middle"
              textAnchor="middle">
              {Math.round(value)}
            </Text>
          </G>
        </G>
      ));
    };

    return (
      <LinearGradient style={styles.view} colors={['#FFF', '#FFF']}>
        <LineChart
          style={styles.chart}
          data={points}
          svg={{stroke: this.getAverageColor()}}
          gridMin={-2}
          gridMax={max}
          numberOfTicks={points.length}
          contentInset={{top: 0, bottom: 0, right: 15}}>
          <Tooltip />
        </LineChart>
        <XAxis
          style={styles.xaxis}
          data={days}
          formatLabel={(index) => days[index]}
          contentInset={{left: 15, right: 15}}
          svg={{fontSize: 8, fill: 'black'}}
        />
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  view: {
    flexDirection: 'row',
    marginTop: 5,
    marginRight: 15,
    marginLeft: 5,
    height: 50,
    borderColor: '#f4f4f4',
    borderWidth: 1,
    borderRadius: 3,
  },
  chart: {
    height: 45,
    width: 290,
    color: '#000',
    marginVertical: 0,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  xaxis: {
    width: 305,
    height: 10,
    marginHorizontal: -320,
    marginVertical: 40,
  },
});
