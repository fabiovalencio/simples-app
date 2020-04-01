import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {ScrollView, StyleSheet, Switch} from 'react-native';
import {Section, TableView, Separator} from 'react-native-tableview-simple';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation-locker';
import OneSignal from 'react-native-onesignal';

import Background from '~/components/Background';
import {signOut} from '~/store/modules/auth/actions';
import CCell from '~/components/CCell';
import {Container, Border} from './styles';

export default function Config({navigation}) {
  const user = useSelector((state) => state.user.profile);
  const [isEnabled, setIsEnabled] = useState(false);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

  useEffect(() => {
    this._willFocusSubscription = navigation.addListener(
      'willFocus',
      (payload) => {
        // lock to portrait when this screen is about to appear
        Orientation.lockToPortrait();
      },
    );

    OneSignal.getPermissionSubscriptionState(async (status) => {
      if (status.subscriptionEnabled) {
        toggleSwitch();
      }
    });
  }, [navigation]);

  const dispatch = useDispatch();
  function handleLogout() {
    dispatch(signOut());
  }

  function navigationProfile() {
    navigation.navigate('Profile');
  }

  function navigationStandardList() {
    navigation.navigate('StandardList');
  }

  function dayOfWeekAsString(dayIndex) {
    return [
      'Domingo',
      'Segunda-feira',
      'Terça-feira',
      'Quarta-feira',
      'Quint-feira',
      'Sexta-feira',
      'Sábado',
    ][dayIndex];
  }

  // open the native Modal
  function setNotification() {
    OneSignal.getPermissionSubscriptionState(async (status) => {
      if (status.subscriptionEnabled) {
        OneSignal.setSubscription(false);
      } else {
        OneSignal.init('5051f00e-2545-4962-b90a-d749333b932a', {
          kOSSettingsKeyAutoPrompt: true,
        });

        OneSignal.setSubscription(true);
        const day = user.day ? user.day.toString() : null;
        OneSignal.setExternalUserId(user.id);
        OneSignal.setEmail(user.email);
        OneSignal.sendTag('day', day);
      }
    });
    toggleSwitch();
  }

  const styles = StyleSheet.create({
    table: {
      paddingTop: 50,
      paddingBottom: 20,
      margin: 30,
      borderRadius: 8,
    },
  });
  return (
    <Background>
      <Container>
        <ScrollView contentContainerStyle={styles.table} scrollEnabled={false}>
          <TableView>
            <Border>
              <Section
                header="Configurações"
                sectionTintColor="rgba(255, 255, 255, 0.1)"
                roundedCorners
                sectionPaddingTop={10}
                sectionPaddingBottom={0}
                separatorTintColor="#f4f4f4">
                <CCell
                  cellStyle="Basic"
                  title="Perfil"
                  accessory="DisclosureIndicator"
                  onPress={navigationProfile}
                />
                <Separator insetRight={15} />
                <CCell
                  cellStyle="Basic"
                  title="Meus critérios"
                  accessory="DisclosureIndicator"
                  onPress={navigationStandardList}
                />
              </Section>
              <Section
                header="Push notification"
                sectionTintColor="rgba(255, 255, 255, 0.1)"
                roundedCorners
                sectionPaddingTop={10}
                sectionPaddingBottom={0}
                separatorTintColor="#f4f4f4">
                <CCell
                  key="notification"
                  cellStyle="Basic"
                  title="Notificação"
                  cellAccessoryView={
                    <Switch
                      onValueChange={setNotification}
                      value={isEnabled}
                      trackColor={{true: '#81b0ff'}}
                    />
                  }
                />
              </Section>

              <Section
                header="Sua semana começa"
                sectionTintColor="rgba(255, 255, 255, 0.1)"
                roundedCorners
                sectionPaddingTop={10}
                sectionPaddingBottom={0}
                separatorTintColor="#f4f4f4">
                <CCell
                  key="dia"
                  cellStyle="Basic"
                  title={dayOfWeekAsString(user.day)}
                />
              </Section>

              <Section
                header=" "
                sectionTintColor="rgba(255, 255, 255, 0.1)"
                roundedCorners
                sectionPaddingTop={10}
                sectionPaddingBottom={0}
                separatorTintColor="#f4f4f4">
                <CCell
                  cellStyle="Basic"
                  title="Sobre o app"
                  accessory="DisclosureIndicator"
                  onPress={() => navigation.navigate('About')}
                />
                <Separator insetRight={15} />
                <CCell
                  cellStyle="Basic"
                  color="red"
                  title="Sair"
                  onPress={handleLogout}
                />
              </Section>
            </Border>
          </TableView>
        </ScrollView>
      </Container>
    </Background>
  );
}

Config.navigationOptions = {
  title: null,
  tabBarIcon: ({tintColor}) => (
    <Icon name="person" size={20} color={tintColor} />
  ),
};
