import React, {Component} from 'react';
import Orientation from 'react-native-orientation-locker';

export class LandscapeScreen extends Component {
  constructor(props) {
    super(props);
    this._willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        // lock to landscape
        Orientation.lockToLandscape();
      },
    );
  }

  componentWillUnmount() {
    // remove subscription either
    this._willFocusSubscription.remove();
  }
}
