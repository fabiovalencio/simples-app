import React, {PureComponent} from 'react';
import {Text, View} from 'react-native';
import {Cell} from 'react-native-tableview-simple';

// import { Container } from './styles';

export default class CCell extends PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Cell
        {...this.props}
        cellContentView={
          <View
            style={{
              alignItems: 'center',
              flexDirection: 'row',
              flex: 1,
              paddingVertical: 20,
            }}>
            <Text
              allowFontScaling
              numberOfLines={1}
              style={{flex: 1, fontSize: 20, color: this.props.color}}>
              {this.props.title}
            </Text>
          </View>
        }
      />
    );
  }
}
