import React, {useRef, useState, useEffect} from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';
import {Keyboard, StyleSheet} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
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
  const [opened, setOpened] = useState(false);
  const [dateFormatted, setDateFormatted] = useState('');

  const dispatch = useDispatch();
  const passwordRef = useRef();
  const emailRef = useRef();
  const loading = useSelector((state) => state.auth.loading);

  async function changeDate(event, date) {
    setDateFormatted(format(date, "dd 'de' MMM 'de' yyyy", {locale: pt}));
    setDate(date);
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

  async function handleState(id) {
    const response = await api.get(`cities/${id}/state`);

    setCities(response.data);
  }

  function changeCity(city) {
    setCity(city);
  }
  function changeGender(gender) {
    setGender(gender);
  }

  function handleSubmit() {
    Keyboard.dismiss();
    dispatch(signUpRequest(name, email, password, city, gender, date));
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
            onSubmitEditing={() => passwordRef.current.focus()}
            value={email}
            onChangeText={setEmail}
          />

          <FormInput
            icon="lock-outline"
            secureTextEntry
            placeholder="Digite sua senha"
            ref={passwordRef}
            returnKeyType="next"
            value={password}
            onChangeText={setPassword}
          />

          <Separator />

          <DateButton onPress={() => setOpened(!opened)}>
            <Icon name="event" color="#3b5998" size={20} />
            <DateText>
              {dateFormatted || 'Selecione a sua data de nascimento'}
            </DateText>
          </DateButton>

          {opened && (
            <Picker>
              <DateTimePicker
                value={date}
                onChange={changeDate}
                locale="pt"
                mode="date"
                placeholder="Selecione a data doseu nascimento"
                confirmBtnText="Confirm"
              />
            </Picker>
          )}
          <RNPickerSelect
            placeholder={{
              label: 'Selecione o seu estado',
              color: '#3b5998',
            }}
            // Icon={() => {
            //   return <Icon name="event" size={20} color="#3b5998" />;
            // }}
            style={pickerSelectStyles}
            onValueChange={(value) => handleState(value)}
            items={states.states ? states.states : {}}
          />

          <RNPickerSelect
            placeholder={{
              label: 'Selecione a sua cidade',
              color: '#3b5998',
            }}
            style={pickerSelectStyles}
            onValueChange={(value) => changeCity(value)}
            items={cities.cities ? cities.cities : {}}
          />

          <RNPickerSelect
            placeholder={{
              label: 'Selecione o seu gênero',
              color: '#3b5998',
            }}
            style={pickerSelectStyles}
            onValueChange={(value) => changeGender(value)}
            items={genders.genders ? genders.genders : {}}
          />

          <SubmitButton loading={loading} onPress={handleSubmit}>
            Cadastrar
          </SubmitButton>

          <SignLink onPress={() => navigation.navigate('SignIn')}>
            <SignLinkText>Já possuo uma conta</SignLinkText>
          </SignLink>
        </Form>
      </Container>
    </Background>
  );
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: '#3b5998',
    marginBottom: 5,
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: '#3b5998',
    marginBottom: 5,
    paddingRight: 100, // to ensure the text is never behind the icon
  },
});
