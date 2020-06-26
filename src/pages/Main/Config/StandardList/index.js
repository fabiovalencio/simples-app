import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {Section, TableView, Separator} from 'react-native-tableview-simple';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Orientation from 'react-native-orientation-locker';
import Modal from 'react-native-modal';
import Background from '~/components/Background';
import CCell from '~/components/CCell';
import api from '~/services/api';
import {
  Container,
  Border,
  Text,
  ViewModal,
  ButtonName,
  ButtonClose,
} from './styles';

const styles = StyleSheet.create({
  table: {
    paddingTop: 100,
    paddingBottom: 20,
    margin: 10,
    marginTop: 30,
    borderRadius: 8,
  },
});

export default class StandardList extends Component {
  constructor(props) {
    super(props);
    const {navigation} = this.props;
    this._willFocusSubscription = navigation.addListener(
      'willFocus',
      (payload) => {
        // lock to portrait when this screen is about to appear
        Orientation.lockToPortrait();
      },
    );

    this.state = {
      isModalVisible: false,
      subjects: [],
      weekSubjects: [],
    };
  }

  componentDidMount = async () => {
    const subjects = await api.get('/subjects');
    const weekSubjects = await api.get('/week-subjects');

    await new Promise((resolve) =>
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
      data = weekSubjects.filter((obj) => {
        return obj.id === id;
      });
    }

    if (url.includes('/standard')) {
      data = subjects.filter((obj) => {
        return obj.id === id;
      });
    }

    const dataModal = {
      data: data[0],
      standard: res.data.data,
      url,
    };

    const {navigation} = this.props;
    navigation.navigate('standardView', {dataModal});
  }

  toggleModal = () => {
    const {isModalVisible} = this.state;
    this.setState({isModalVisible: !isModalVisible});
  };

  render() {
    const {subjects, weekSubjects, isModalVisible} = this.state;
    return (
      <Background>
        <Container>
          <ButtonName>
            <Icon
              name="info"
              size={20}
              color="#333"
              onPress={this.toggleModal}
            />
          </ButtonName>
          <Modal isVisible={isModalVisible} onPress={this.toggleModal}>
            <KeyboardAvoidingView
              enabled
              behavior={Platform.OS === 'android' ? undefined : 'position'}>
              <ScrollView
                scrollEnabled={false}
                keyboardShouldPersistTaps="handled">
                <ViewModal>
                  <ButtonClose>
                    <Icon
                      name="close"
                      size={20}
                      color="#333"
                      onPress={this.toggleModal}
                    />
                  </ButtonClose>
                  <Text>
                    Nós do +Simples sabemos que todo mundo quer que a gente
                    defina os critérios do jogo para cada uma das 7 dimensões!
                    {'\n'}
                    {'\n'}
                    Mas é aqui que mora a beleza desse jogo: quem pode dizer o
                    que é melhor para você, é você! É justamente porque nós não
                    vamos dizer como é que tem que ser o seu sono, sua
                    alimentação, seus exercícios físicos, etc., que você tem
                    maior probabilidade de jogar esse jogo para sempre e
                    conquistar o bem-estar definitivo para sua vida!
                    {'\n'}
                    {'\n'}
                    Você não precisa mudar nada na sua vida para começar a
                    jogar: para cada uma das dimensões, decida qual vai ser o
                    seu critério de uma forma criativa.
                  </Text>
                </ViewModal>
              </ScrollView>
            </KeyboardAvoidingView>
          </Modal>

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
