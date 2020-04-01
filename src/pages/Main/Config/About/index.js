import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Background from '~/components/Background';
import {Container, List, View, Title, Subtitle} from './styles';

export default function About() {
  return (
    <Background>
      <Container>
        <List>
          <View>
            <Title>+Simples é uma ferramentas Relações Simplificadas</Title>
            <Subtitle>
              Acreditamos que vivemos melhor e trabalhamos melhor quando
              desfrutamos de relações de qualidade. ​ O que é uma boa relação?
              Como ela acontece? Como promovo ou desfruto dela, profissional ou
              pessoalmente? ​ Relações Simplificadas nasceu para apoiar as
              pessoas a se reconectarem com a experiência das boas relações. ​ É
              no espaço da subjetividade, na dimensão intangível, que os
              encontros verdadeiros acontecem. Por isso fazemos Design para
              Relações: uma forma objetiva de conhecer, compreender e
              decodificar essa subjetividade. ​ Relações Simplificadas é um
              conjunto de conhecimentos que une a psicanálise e a linguagem do
              palhaço. Criamos uma série de técnicas e ferramentas práticas para
              produzir relações de melhor qualidade. Nossos treinamentos dão
              resultado porque lidam com os diálogos inconscientes, que definem
              as relações. Como em um iceberg, esses diálogos estão abaixo da
              linha do mar. A maioria dos treinamentos dirige-se à porção que
              está acima da água: crenças, valores, comportamentos, comunicação
              verbal, não-verbal, emoções. Mas é cuidando da parte submersa que
              podemos alcançar mudanças significativas.
              https://www.relacoessimplificadas.com.br/
            </Subtitle>
            <Subtitle>versão: 1.0.0</Subtitle>
          </View>
        </List>
      </Container>
    </Background>
  );
}

About.navigationOptions = ({navigation}) => ({
  title: 'Sobre o app',
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
