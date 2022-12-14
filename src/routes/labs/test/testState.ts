import { computed, signal } from "@preact/signals";

export type TestData = {
  id: number;
  question: string;
  answers: string[];
  rightAnswer: string;
  givenAnswer?: string;
};

export const testState = signal<TestData[]>([
  {
    id: 0,
    question: "Из какой страны родом Джастин Бибер?",
    answers: ["Канада", "США", "Франция", "Англия"],
    rightAnswer: "Канада",
  },
  {
    id: 1,
    question: "Какой герой мультфильма живет в ананасе под водой?",
    answers: ["Немо", "Рик и Морти", "Губка Боб Квадратные Штаны"],
    rightAnswer: "Губка Боб Квадратные Штаны",
  },
  {
    id: 2,
    question: "Что является национальным животным Шотландии?",
    answers: ["Лошадь", "Единорог", "Волк", "Тигр", "Корова"],
    rightAnswer: "Единорог",
  },
  {
    id: 3,
    question: "Как называются четыре Факультета Хогвартса?",
    answers: [
      "Гриффиндор, Пуффендуй, Когтевран и Слизерин",
      "Грифон, Ворон, Слон и Змея",
      "Север, Восток, Запад и Юг",
      "Красный, Синий, Зеленый и Оранжевый",
    ],
    rightAnswer: "Гриффиндор, Пуффендуй, Когтевран и Слизерин",
  },
]);

export const updateAnswer = (toUpdateId: number, newAnswer: string): void => {
  const toUpdate = testState.value.find(({ id }) => toUpdateId === id);
  if (!toUpdate) {
    return;
  }
  testState.value = [
    ...testState.value.filter(({ id }) => id !== toUpdateId),
    { ...toUpdate, givenAnswer: newAnswer },
  ].sort((a, b) => a.id - b.id);
};

export const countRightAnswer = computed(
  () =>
    testState.value.filter(
      ({ rightAnswer, givenAnswer }) => rightAnswer === givenAnswer
    ).length
);

export const isTestEnded = signal<boolean>(false);

export const countAnswered = computed(
  () =>
    testState.value.filter(({ givenAnswer }) => givenAnswer !== undefined)
      .length
);

export const testLength = computed(() => testState.value.length);

export const mark = computed(() =>
  Math.round(Math.max((countRightAnswer.value / testLength.value) * 5, 2))
);

export const currentQuestion = signal<number>(0);

export const setQuestion = (index: number) => {
  if (index >= 0 && testLength.value > index) currentQuestion.value = index;
};

export const moveToNextQuestion = () => setQuestion(currentQuestion.value + 1);

export const moveToPrevQuestion = () => setQuestion(currentQuestion.value - 1);

export const isQuestionAnswered = (index: number) =>
  testState.value[index].givenAnswer !== undefined;
