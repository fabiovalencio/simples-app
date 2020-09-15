import React, {useRef, useState, useEffect} from 'react';
import {Keyboard, StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import SearchableDropdown from 'react-native-searchable-dropdown';
import Icon from 'react-native-vector-icons/MaterialIcons';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format, parseISO} from 'date-fns';
import pt from 'date-fns/locale/pt';

import Background from '~/components/Background';
import {updateProfileRequest} from '~/store/modules/user/actions';
import {signOut} from '~/store/modules/auth/actions';

import api from '~/services/api';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  Separator,
  LogoutButton,
  DateButton,
  DateText,
  Picker,
} from './styles';

export default function Profile() {
  const dispatch = useDispatch();
  const profile = useSelector((state) => state.user.profile);
  const loading = useSelector((state) => state.auth.loading);

  const emailRef = useRef();
  const oldPasswordRef = useRef();
  // const passwordRef = useRef();
  // const confirmPasswordRef = useRef();

  const [name, setName] = useState(profile.name);
  const [email, setEmail] = useState(profile.email);
  // const [oldPassword, setOldPassword] = useState('');
  // const [password, setPassword] = useState('');
  // const [confirmPassword, setConfirmPassword] = useState('');

  const [cities, setCities] = useState([]);
  const [city, setCity] = useState();
  const [states, setStates] = useState([]);
  const [genders, setGenders] = useState([]);
  const [gender, setGender] = useState();
  const [date, setDate] = useState(new Date());

  const [DState, setDState] = useState('Estado (digite para buscar)');
  const [DCity, setDCity] = useState('Cidade (digite para buscar)');
  const [DGender, setDGender] = useState('Gênero (digite para buscar)');

  const [opened, setOpened] = useState(false);
  const [dateFormatted, setDateFormatted] = useState('');

  useEffect(() => {
    // setOldPassword('');
    // setPassword('');
    // setConfirmPassword('');

    async function loadData() {
      const resAbout = await api.get('/user-about');

      const resStates = await api.get('/states');
      setStates(resStates.data);

      const resGenders = await api.get('/genders');
      setGenders(resGenders.data);

      if (resAbout.data) {
        setDataAbout(resAbout.data, resStates.data.states);
      }
    }

    function setDataAbout(obj, st) {
      let bday = parseISO(obj.birthday);
      setDateFormatted(format(bday, "dd 'de' MMM 'de' yyyy", {locale: pt}));
      setDate(bday);

      setDState(st[obj.city.state_id - 1].name);
      setDCity(obj.city.name);
      setCity(obj.city.id);
      setDGender(obj.gender.name);
      setGender(obj.gender.id);
    }

    loadData();
  }, [profile]);

  function handleSubmit() {
    Keyboard.dismiss();
    dispatch(
      updateProfileRequest({
        name,
        email,
        city,
        gender,
        date,
      }),
    );
  }

  async function handleState(obj) {
    const response = await api.get(`cities/${obj.id}/state`);
    setCities(response.data);
  }

  async function changeDate(event, dt) {
    setDateFormatted(format(dt, "dd 'de' MMM 'de' yyyy", {locale: pt}));
    setDate(dt);
  }

  function changeCity(obj) {
    let id = obj.id.toString();
    setCity(id);
  }

  function changeGender(obj) {
    let id = obj.id;
    setGender(id);
  }

  function handleLogout() {
    dispatch(signOut());
  }

  return (
    <Background>
      <Container>
        <Form>
          <FormInput
            icon="person-outline"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu nome completo"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current.focus()}
            value={name}
            onChangeText={setName}
          />

          <FormInput
            icon="mail-outline"
            keyboardType="email-address"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="Digite seu e-mail"
            ref={emailRef}
            returnKeyType="next"
            value={email}
            onChangeText={setEmail}
          />

          <Separator />

          <DateButton onPress={() => setOpened(!opened)}>
            <Icon name="event" color="#3b5998" size={20} />
            <DateText>
              {dateFormatted
                ? opened
                  ? 'Clique para selecionar'
                  : dateFormatted
                : opened
                ? 'Clique para selecionar'
                : 'Selecione a sua data de nascimento'}
            </DateText>
          </DateButton>

          {opened && (
            <Picker>
              <DateTimePicker
                value={date}
                onChange={changeDate}
                locale="pt"
                mode="date"
                placeholder="Selecione sua data de nascimento"
                confirmBtnText="Confirm"
                textColor="#3b5998"
              />
            </Picker>
          )}

          <SearchableDropdown
            textInputStyle={pickerSelectStyles.input}
            onItemSelect={(id) => handleState(id)}
            items={states.states}
            itemStyle={pickerSelectStyles.textInput}
            resetValue={false}
            textInputProps={{
              placeholder: DState,
              placeholderTextColor: 'rgba(59, 89, 152, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              color: '#3b5998',
              onTextChange: (id) => handleState(id),
            }}
            itemsContainerStyle={{maxHeight: 130}}
          />

          <SearchableDropdown
            textInputStyle={pickerSelectStyles.input}
            onItemSelect={(value) => changeCity(value)}
            items={cities.cities}
            itemStyle={pickerSelectStyles.textInput}
            resetValue={false}
            textInputProps={{
              placeholder: DCity,
              placeholderTextColor: 'rgba(59, 89, 152, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              color: '#3b5998',
              onItemSelect: (value) => changeCity(value),
            }}
            itemsContainerStyle={{maxHeight: 130}}
          />

          <SearchableDropdown
            textInputStyle={pickerSelectStyles.input}
            onItemSelect={(value) => changeGender(value)}
            items={genders.genders}
            itemStyle={pickerSelectStyles.textInput}
            resetValue={false}
            textInputProps={{
              placeholder: DGender,
              placeholderTextColor: 'rgba(59, 89, 152, 0.8)',
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              color: '#3b5998',
              onItemSelect: (value) => changeGender(value),
            }}
            itemsContainerStyle={{
              maxHeight: 130,
              color: '#fff',
            }}
          />

          <SubmitButton loading={loading} onPress={handleSubmit}>
            Atualizar perfil
          </SubmitButton>
          <LogoutButton onPress={handleLogout}>Sair</LogoutButton>
        </Form>
      </Container>
    </Background>
  );
}

Profile.navigationOptions = ({navigation}) => ({
  title: 'Perfil',
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

const pickerSelectStyles = StyleSheet.create({
  input: {
    fontSize: 15,
    color: '#3b5998',
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderRadius: 4,
    marginBottom: 5,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  textInput: {
    padding: 10,
    marginTop: 2,
    color: '#3b5998',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    borderColor: '#bbb',
    borderWidth: 1,
    borderRadius: 5,
  },
});
