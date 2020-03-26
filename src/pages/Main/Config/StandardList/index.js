import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {ScrollView, StyleSheet} from 'react-native';
import {Section, TableView, Separator} from 'react-native-tableview-simple';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation-locker';
import Background from '../../../../components/Background';
import {Container, Border} from './styles';
import CCell from '../../../../components/CCell';
import api from '../../../../services/api';

const styles = StyleSheet.create({
  table: {
    paddingTop: 75,
    paddingBottom: 20,
    margin: 30,
    borderRadius: 8,
  },
});

export default class StandardList extends Component {
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
      subjects: [],
      weekSubjects: [],
    };
  }

  componentDidMount = async () => {
    const subjects = await api.get(`/subjects`);
    const weekSubjects = await api.get(`/week-subjects`);

    await new Promise(resolve =>
      this.setState(
        {
          subjects: subjects.data.subject,
          weekSubjects: weekSubjects.data.subject,
        },
        () => resolve(),
      ),
    );
  };

  componentWillUnmount() {
    // remove subscription when unmount
    this._willFocusSubscription.remove();
  }

  async navigationStandard(url, id) {
    const {subjects, weekSubjects} = this.state;
    const res = await api.get(`${url}/${id}`);
    let data = null;

    if (url.includes('/week-standard')) {
      data = weekSubjects.filter(obj => {
        return obj.id === id;
      });
    }

    if (url.includes('/standard')) {
      data = subjects.filter(obj => {
        return obj.id === id;
      });
    }
    console.tron.log(res.data);
    const dataModal = {
      data: data[0],
      standard: res.data.data,
      url,
    };

    const {navigation} = this.props;
    navigation.navigate('standardView', {dataModal});
  }

  render() {
    const {subjects, weekSubjects} = this.state;
    return (
      <Background>
        <Container>
          <ScrollView
            contentContainerStyle={styles.table}
            scrollEnabled={false}>
            <TableView>
              <Border>
                <Section
                  sectionTintColor="#f4f4f4"
                  roundedCorners
                  sectionPaddingTop={0}
                  sectionPaddingBottom={0}
                  separatorTintColor="#f4f4f4">
                  {subjects.map((v, i) => (
                    <>
                      <CCell
                        key={v.name.replace(/\s+/g, '')}
                        cellStyle="Basic"
                        title={v.name}
                        accessory="DisclosureIndicator"
                        onPress={() =>
                          this.navigationStandard('/standard', v.id)
                        }
                      />
                      <Separator
                        key={v.name.replace(/\s+/g, '') + i.toString()}
                        insetRight={15}
                      />
                    </>
                  ))}
                  {weekSubjects.map((v, i) => (
                    <>
                      <CCell
                        key={v.name.replace(/\s+/g, '')}
                        cellStyle="Basic"
                        title={v.name}
                        accessory="DisclosureIndicator"
                        onPress={() =>
                          this.navigationStandard('/week-standard', v.id)
                        }
                      />
                      <Separator
                        key={v.name.replace(/\s+/g, '') + i.toString()}
                        insetRight={15}
                      />
                    </>
                  ))}
                </Section>
              </Border>
            </TableView>
          </ScrollView>
        </Container>
      </Background>
    );
  }
}

StandardList.propTypes = {
  navigation: PropTypes.oneOfType([PropTypes.object]).isRequired,
};

StandardList.navigationOptions = ({navigation}) => ({
  title: 'Critérios',
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
