/* eslint-disable react/destructuring-assignment */
/* eslint-disable react/prefer-stateless-function */
import React, {Component} from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

export default class RadioButton extends Component {
  // eslint-disable-next-line no-useless-constructor
  constructor() {
    super();
  }

  render() {
    return (
      <>
        <View style={[styles.view]}>
          <TouchableOpacity
            disabled={this.props.disabled}
            onPress={this.props.onClick}
            activeOpacity={0.8}
            style={styles.radioButton}>
            <Text style={[styles.label, {color: this.props.button.color}]}>
              {this.props.button.label}
            </Text>

            <View
              style={[
                styles.radioButtonHolder,
                {
                  height: this.props.button.size,
                  width: this.props.button.size,
                  borderColor: this.props.button.color,
                },
              ]}>
              {this.props.button.gradient ? (
                <LinearGradient
                  style={[styles.gradient, {width: this.props.button.length}]}
                  colors={[this.props.button.color, this.props.button.colorEnd]}
                  start={{x: 0, y: 1}}
                  end={{x: 1, y: 1}}
                />
              ) : null}
              {this.props.button.selected ? (
                <View
                  style={[
                    styles.radioIcon,
                    {
                      height: this.props.button.size / 2,
                      width: this.props.button.size / 2,
                      backgroundColor: this.props.button.color,
                    },
                  ]}
                />
              ) : null}
            </View>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}

const styles = StyleSheet.create({
  gradient: {
    position: 'absolute',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
    height: 5,
    marginStart: 26,
    marginTop: 55,
  },
  view: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },

  radioButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignSelf: 'flex-start',
  },
  radioButtonHolder: {
    borderRadius: 50,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
    backgroundColor: '#fff',
  },
  radioIcon: {
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    marginBottom: 10,
    marginRight: 20,
    fontSize: 20,
  },
});
