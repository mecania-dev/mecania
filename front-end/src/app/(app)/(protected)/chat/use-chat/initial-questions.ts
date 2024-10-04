import { Question } from './types'

export const initialQuestions: Question[] = [
  {
    type: 'options',
    text: 'O seu veículo se envolveu em algum sinistro (acidente, colisão, etc.) recentemente?',
    options: [
      {
        text: 'Sim',
        followUp:
          'Mantenha a calma. Sinalize o local com o triângulo de segurança a 30 metros do veículo, acione o pisca-alerta. Se houver vítimas, não mova ninguém e ligue para o 192 (SAMU) ou 190 (Polícia). Se não houver feridos, retire os veículos da via para evitar outros acidentes e registre um boletim de ocorrência. Caso tenha seguro, entre em contato com a seguradora. O mais importante é garantir a segurança de todos.',
        end: true
      },
      { text: 'Não', followUp: 'Ótimo! Vamos continuar com as perguntas.' }
    ]
  },
  {
    type: 'text',
    text: 'Informe a quilometragem do veículo atualizada.',
    followUp: 'Agora, para que possamos entender melhor o que está acontecendo, precisamos de algumas informações.'
  },
  {
    type: 'options',
    text: 'O problema que você está enfrentando é visível?',
    options: [{ text: 'Sim' }, { text: 'Não' }]
  },
  {
    type: 'options',
    text: 'O problema que você está enfrentando é de funcionamento ou desempenho?',
    options: [{ text: 'Funcionamento' }, { text: 'Desempenho' }]
  },
  {
    type: 'options',
    text: 'Você notou algum barulho estranho enquanto dirige?',
    options: [{ text: 'Sim' }, { text: 'Não' }]
  },
  {
    type: 'options',
    text: 'Alguma luz de advertência está acesa no painel do seu veículo?',
    options: [{ text: 'Sim', followUp: { type: 'text', text: 'Qual ícone está aparecendo?' } }, { text: 'Não' }]
  },
  {
    type: 'text',
    text: 'Por favor, descreva o problema que você está enfrentando.'
  }
]
