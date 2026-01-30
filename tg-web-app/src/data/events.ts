export type EventItem = {
  slug: string;
  title: string;
  date: string;
  cover: string;
  location: string;
  description: string;
  agenda: string[];
  tag: string;
};

export const communityEvents: EventItem[] = [
  {
    slug: 'ftmi-halloween-2026',
    title: 'FTMI Halloween Party 2026',
    date: '31 октября 2026, 21:00',
    cover: '/placeholders/party-banner.jpeg',
    location: 'Лофт на Литейном, 34',
    description:
      'Ночной костюмированный маркет, бар с фирменными хэллоуин-коктейлями и DJ-сет от резидента FTMI. Лучший костюм получает годовую подписку на премиум!',
    agenda: [
      '21:00 — welcome зона, свечи и дыма побольше',
      '22:00 — speed friending “темные академики”',
      '23:00 — костюм battle',
      '00:00 — закрытый танцпол до утра',
    ],
    tag: 'Оффлайн',
  },
  {
    slug: 'rooftop-vinyl-night',
    title: 'Rooftop Vinyl Night',
    date: '07 ноября 2026, 20:00',
    cover: '/placeholders/party1.jpeg',
    location: 'Руфтоп ITMO Highline',
    description:
      'Живые виниловые сеты, пледы и какао. Для интровертов — тихая зона, для экстравертов — танцы.',
    agenda: ['20:00 — сбор, тёплые напитки', '20:30 — blind meet 1:1', '21:30 — виниловый сет с заявками гостей'],
    tag: 'Музыка',
  },
  {
    slug: 'boardgames-matcha',
    title: 'Boardgames & Matcha',
    date: '10 ноября 2026, 18:30',
    cover: '/placeholders/party2.jpeg',
    location: 'Антикафе “Дворик”',
    description:
      'Турнир по “Кодовым именам” и “Дикситу” в формате смешанных команд. Новые друзья гарантированы.',
    agenda: ['18:30 — жеребьёвка', '19:00 — первый раунд игр', '20:30 — обмен контактами и матча-челлендж'],
    tag: 'Настолки',
  },
  {
    slug: 'karaoke-blind-dates',
    title: 'Karaoke Blind Dates',
    date: '15 ноября 2026, 19:00',
    cover: '/placeholders/party3.jpeg',
    location: 'Karaoke Room ITMO',
    description: 'Парные песни вслепую: миксуем голоса, эмоции и неожиданные дуэты.',
    agenda: ['19:00 — жеребьёвка пар', '19:30 — первый блок выступлений', '21:00 — free mic + танцпол'],
    tag: 'Караоке',
  },
  {
    slug: 'brunch-art-walk',
    title: 'Brunch & Art Walk',
    date: '24 ноября 2026, 12:00',
    cover: '/placeholders/party4.jpeg',
    location: 'Ботанический сад + арт-пространство',
    description:
      'Медленный воскресный бранч с прогулкой по инсталляциям. Трекер знакомств поможет не потерять контакты.',
    agenda: ['12:00 — бранч и интро-игра', '13:00 — прогулка по экспозиции', '14:00 — обмен впечатлениями в паре'],
    tag: 'Бранч',
  },
];

export const gameEvents: EventItem[] = [
  {
    slug: 'speed-meeting-quest',
    title: 'Speed Meeting Quest',
    date: 'Каждый четверг, 19:00',
    cover: '/placeholders/game-banner.jpg',
    location: 'Главный кампус ITMO, квест-маршрут',
    description:
      'Командный квест по кампусу: каждая точка — новое знакомство и мини-испытание. Идеально, чтобы разрушить лёд и набрать контактов за вечер.',
    agenda: ['19:00 — сбор и распределение на команды', '19:20 — старт квеста (5 чекпоинтов)', '20:40 — финал и награждение', '21:00 — нетворк-лаундж с лимонадом'],
    tag: 'Квест',
  },
  {
    slug: 'icebreaker-bingo',
    title: 'Icebreaker Bingo',
    date: 'Пятница, 18:00',
    cover: '/placeholders/game1.jpg',
    location: 'Коворкинг “Поток”',
    description:
      'Бинго-карты с заданиями на общение: найди человека, который был в том же городе, или умеет готовить лучшую пасту.',
    agenda: ['18:00 — выдача карточек', '18:20 — раунд 1 “Совпадения”', '19:00 — раунд 2 “Неожиданные факты”'],
    tag: 'Icebreaker',
  },
  {
    slug: 'spyfall-night',
    title: 'Spyfall Night',
    date: 'Среда, 19:30',
    cover: '/placeholders/game2.jpg',
    location: 'Лаундж “Точка притяжения”',
    description:
      'Классический Spyfall в живую: короткие раунды, смена столов, чтобы познакомиться с максимальным количеством людей.',
    agenda: ['19:30 — правила за 5 минут', '19:40 — раунды по 8 минут', '20:30 — “шпионский” фриплей и общение'],
    tag: 'Настолки',
  },
];

export const allEvents: EventItem[] = [...communityEvents, ...gameEvents];
