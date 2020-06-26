import React from 'react';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';

import Icon from 'react-native-vector-icons/MaterialIcons';

import SignIn from '~/pages/SignIn';
import SignUp from '~/pages/SignUp';
import Reset from '~/pages/Reset';
import Verify from '~/pages/Reset/Verify';
import Password from '~/pages/Reset/Password';

import SelectDay from '~/pages/Main/MyDay/SelectDay';
import Week from '~/pages/Main/MyWeek/Week';
import dayConfirm from '~/pages/Main/MyDay/dayConfirm';
import weekPoints from '~/pages/Main/MyWeek/weekPoints';
import Report from '~/pages/Main/Report';
import FullScreen from '~/pages/Main/Report/FullScreen';
import Config from '~/pages/Main/Config';
import Profile from '~/pages/Main/Config/Profile';
import StandardList from '~/pages/Main/Config/StandardList';
import standardView from '~/pages/Main/Config/StandardView';
import About from '~/pages/Main/Config/About';

export default (isSigned = false) =>
  createAppContainer(
    createSwitchNavigator(
      {
        Sign: createSwitchNavigator({
          SignIn,
          SignUp,
          Reset,
          Verify,
          Password,
        }),
        App: createBottomTabNavigator(
          {
            day: {
              screen: createStackNavigator(
                {
                  SelectDay,
                  dayConfirm,
                },
                {
                  defaultNavigationOptions: {
                    headerTransparent: true,
                    headerTintColor: '#3b9eff',
                    headerLeftContainerStyle: {
                      marginLeft: 20,
                    },
                  },
                },
              ),
              navigationOptions: {
                tabBarLabel: 'Meu dia',
                tabBarIcon: ({tintColor}) => (
                  <Icon name="wb-sunny" size={20} color={tintColor} />
                ),
              },
            },
            week: {
              screen: createStackNavigator(
                {
                  Week,
                  weekPoints,
                },
                {
                  defaultNavigationOptions: {
                    headerTransparent: true,
                    headerTintColor: '#3b9eff',
                    headerLeftContainerStyle: {
                      marginLeft: 20,
                    },
                  },
                },
              ),
              navigationOptions: {
                tabBarLabel: 'Minha semana',
                tabBarIcon: ({tintColor}) => (
                  <Icon name="today" size={20} color={tintColor} />
                ),
              },
            },
            Report: {
              screen: createStackNavigator(
                {
                  Report,
                  FullScreen,
                },
                {
                  defaultNavigationOptions: {
                    headerTransparent: true,
                    headerTintColor: '#3b9eff',
                    headerLeftContainerStyle: {
                      marginLeft: 20,
                    },
                  },
                },
              ),
              navigationOptions: ({navigation}) => ({
                tabBarLabel: 'Relatórios',
                tabBarIcon: ({tintColor}) => (
                  <Icon name="show-chart" size={20} color={tintColor} />
                ),
                tabBarVisible: navigation.state.index === 0,
              }),
            },
            Cprofile: {
              screen: createStackNavigator(
                {
                  Config,
                  Profile,
                  StandardList,
                  standardView,
                  About,
                },
                {
                  defaultNavigationOptions: {
                    headerTransparent: true,
                    headerTintColor: '#3b9eff',
                    headerLeftContainerStyle: {
                      marginLeft: 20,
                    },
                  },
                },
              ),
              navigationOptions: {
                tabBarLabel: 'Configurações',
                tabBarIcon: ({tintColor}) => (
                  <Icon name="person" size={20} color={tintColor} />
                ),
              },
            },
          },
          {
            tabBarOptions: {
              keyboardHidesTabBar: true,
              activeTintColor: '#3b9eff',
              inactiveTintColor: 'rgba(59, 89, 152, 0.6)',
              style: {
                backgroundColor: '#FFF',
              },
            },
          },
        ),
      },
      {
        initialRouteName: isSigned ? 'App' : 'Sign',
      },
    ),
  );
