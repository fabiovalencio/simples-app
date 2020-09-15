import React, {useRef, useState, useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';
import {Keyboard, StyleSheet, Alert} from 'react-native';
import SearchableDropdown from 'react-native-searchable-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';

import logo from '~/assets/logo.png';

import Background from '~/components/Background';
import {signUpRequest} from '~/store/modules/auth/actions';

import api from '~/services/api';

import {
  Container,
  Form,
  FormInput,
  SubmitButton,
  SignLink,
  SignLinkText,
  InfoText,
  Stretch,
  Separator,
  DateButton,
  DateText,
  Picker,
} from './styles';

export default function SignUp({navigation}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cities, setCities] = useState([]);
  const [city, setCity] = useState();
  const [states, setStates] = useState([]);
  const [genders, setGenders] = useState([]);
  const [gender, setGender] = useState();
  const [date, setDate] = useState(new Date());
  const now = useState(new Date());
  const [opened, setOpened] = useState(false);
  const [dateFormatted, setDateFormatted] = useState('');

  const dispatch = useDispatch();
  const passwordRef = useRef();
  const emailRef = useRef();
  const loading = useSelector((state) => state.auth.loading);

  async function changeDate(event, dt) {
    setDateFormatted(format(dt, "dd 'de' MMM 'de' yyyy", {locale: pt}));
    setDate(dt);
  }

  useEffect(() => {
    async function loadData() {
      const resStates = await api.get('states');
      setStates(resStates.data);

      const resGenders = await api.get('genders');
      setGenders(resGenders.data);
    }

    loadData();
  }, []);

  async function handleState(obj) {
    const response = await api.get(`cities/${obj.id}/state`);
    setCities(response.data);
  }

  function changeCity(obj) {
    let id = obj.id.toString();
    setCity(id);
  }
  function changeGender(obj) {
    let id = obj.id;
    setGender(id);
  }

  async function handleSubmit() {
    if (name && email && password) {
      const response = await api.post('user-email', {email});

      if (response.data.email) {
        Alert.alert('E-mail já cadastrado');
      } else {
        try {
          dispatch(signUpRequest(name, email, password, city, gender, date));
          Keyboard.dismiss();
        } catch (err) {
          Alert.alert('Erro '.err);
        }
      }
    } else {
      Alert.alert('Preencha os campos obrigatórios');
    }
  }

  return (
    <Background>
      <Container>
        {/* <Image source={logo} /> */}
        <Stretch source={logo} />

        <Form>
          <FormInput
            icon="person-outline"
            autoCorrect={false}
            autoCapitalize="none"
            placeholder="* Digite seu nome completo"
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
            placeholder="* Digite seu e-mail"
            ref={emailRef}
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current.focus()}
            value={email}
            onChangeText={setEmail}
          />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="* Digite sua senha"
            ref={passwordRef}
            returnKeyType="send"
            onSubmitEditing={handleSubmit}
            value={password}
            onChangeText={setPassword}
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
              placeholder: 'Estado (digite para buscar)',
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
              placeholder: 'Cidade (digite para buscar)',
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
              placeholder: 'Gênero (digite para buscar)',
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
            Cadastrar
          </SubmitButton>

          <SignLink onPress={() => navigation.navigate('SignIn')}>
            <SignLinkText>Já possuo uma conta</SignLinkText>
          </SignLink>
        </Form>
        <InfoText>* preenchimento obrigatório</InfoText>
      </Container>
    </Background>
  );
}

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
