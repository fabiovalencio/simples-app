import React, {Component} from 'react';
import {Button, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import PropTypes from 'prop-types';

import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation-locker';
import Background from '../../../../components/Background';
import {Container, Border} from './styles';
import Standard from '../Standard';

export default class StandardView extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this._willFocusSubscription = navigation.addListener(
      'willFocus',
      payload => {
        // lock to portrait when this screen is about to appear
        Orientation.lockToPortrait();
      },
    );

    this.state = {
      data: null,
    };
  }

  componentDidMount = async () => {
    const {navigation} = this.props;
    const {dataModal} = navigation.state.params;

    await new Promise(resolve =>
      this.setState(
        {
          data: dataModal,
        },
        () => resolve(),
      ),
    );
  };

  componentWillUnmount() {
    // remove subscription when unmount
    this._willFocusSubscription.remove();
  }

  render() {
    const {data} = this.state;
    return (
      <Background>
        <Container>
          {data && (
            <KeyboardAvoidingView
              enabled
              behavior={Platform.OS === 'android' ? undefined : 'position'}>
              <ScrollView
                scrollEnabled={false}
                keyboardShouldPersistTaps="handled">
                <Border>
                  <Standard data={data} onPress={this.handleSubmit} />
                </Border>
              </ScrollView>
            </KeyboardAvoidingView>
          )}
        </Container>
      </Background>
    );
  }
}

StandardView.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

StandardView.navigationOptions = ({navigation}) => ({
  title: null,
  headerLeft: () => (
    <Icon
      name="chevron-left"
      size={40}
      onPress={() => {
        navigation.goBack();
      }}
    />
  ),
  tabBarIcon: ({tintColor}) => (
    <Icon name="person" size={20} color={tintColor} />
  ),
});
