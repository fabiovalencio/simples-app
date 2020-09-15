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
            <Title>
              +Simples é uma ferramenta Relações Simplificadas: porque a
              primeira boa relação que precisamos ter é com a gente mesmo!
            </Title>
            <Subtitle>
              Sono, Alimentação, Meditação, Exercícios Físicos, Lazer Ativo,
              Vida Amorosa e Análise: quantas vezes você já começou a se cuidar
              e desistiu? +Simples é o primeiro aplicativo que une 7 dimensões
              de bem-estar em um jogo que vai fazer com que você conquiste a
              disciplina que está buscando para viver uma vida mais saudável.
              Você sabe que precisa cuidar de todos esses aspectos, mas como
              fazer isso com uma vida intensa, agitada? Como começar a se cuidar
              e não desistir? Com o aplicativo +Simples, você vai descobrir que
              não precisa ter disciplina para jogar, pelo contrário: é jogando
              que você vai conquistar essa disciplina.
              {'\n'}
              {'\n'}O jogo chama-se +Simples porque bastam 4 toques na tela para
              você avaliar como está se cuidando a cada dia. No final da semana,
              vai avaliar também em 4 toques os indicadores semanais e obter sua
              pontuação total. {'\n'}
              {'\n'}
              Por que você vai conquistar disciplina? 1. Porque o desenho do
              jogo é pensado para você não desistir: 4 toques por dia + 4 toques
              no final da semana. 2. Porque você vai perceber que um “dia ruim”
              pode ser superado por vários “dias bons”. Você nunca mais vai
              esperar a “segunda-feira” que vem para começar tudo de novo! 3.
              Porque nossa mente muda de padrão quando consegue enxergar o que
              fazemos com nós mesmos. 4. Porque é você quem define os critérios
              de pontuação de cada uma das dimensões. {'\n'}
              {'\n'}
              Por que você vai conquistar Bem-Estar? {'\n'}
              {'\n'}
              1. Porque o aplicativo une 7 dimensões fundamentais, nenhum outro
              faz isso. 2. Porque você vai retomar o controle sobre aquilo que
              está acontecendo com você, com a sua vida. 3. Porque o jogo
              promove a conquista de um RITMO para o cuidado de si, o que gera
              mais harmonia para sua vida como um todo. 4. Porque depois de 20
              semanas jogando, vai ser capaz de perceber uma mudança concreta no
              seu estado geral. {'\n'}
              Bom jogo para você!
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
