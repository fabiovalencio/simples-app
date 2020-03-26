import React, {useState, useMemo} from 'react';
import {useSelector} from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';
import {format} from 'date-fns';
import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons/MaterialIcons';

import {Container, DateButton, DateText, Picker} from './styles';

export default function DateInput({date, onChange}) {
  const [opened, setOpened] = useState(false);
  const minDate = useSelector(state => state.user.profile.createdAt);

  const dateFormatted = useMemo(
    () => format(date, "dd 'de' MMM 'de' yyyy", {locale: pt}),
    [date],
  );
  return (
    <Container>
      <DateButton onPress={() => setOpened(!opened)}>
        <Icon name="event" color="#fff" size={20} />
        <DateText>{dateFormatted}</DateText>
      </DateButton>

      {opened && (
        <Picker>
          <DateTimePicker
            value={date}
            onChange={onChange}
            maximumDate={new Date()}
            minimumDate={minDate}
            minuteInterval={60}
            locale="pt"
            mode="date"
            placeholder="select date"
            confirmBtnText="Confirm"
            style={{textColor: '#3b5998'}}
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
          />
        </Picker>
      )}
    </Container>
  );
}
