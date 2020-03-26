import React, {Component} from 'react';
import Orientation from 'react-native-orientation-locker';

export class LandscapeScreen extends Component {
  constructor(props) {
    super(props);
    this._willFocusSubscription = this.props.navigation.addListener(
      'willFocus',
      payload => {
        // lock to landscape
        Orientation.unlockAllOrientations();
        Orientation.addOrientationListener(this._onOrientationDidChange);
      },
    );
  }

  componentWillUnmount() {
    // remove subscription either
    Orientation.removeOrientationListener(this._onOrientationDidChange);
    this._willFocusSubscription.remove();
  }

  _onOrientationDidChange = orientation => {
    if (orientation === 'LANDSCAPE-LEFT') {
      // do something with landscape left layout
    } else {
      // do something with portrait layout
    }
  };
}
