import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import eduroamLogo from './assets/eduroam-logo.svg'
import './App.css'

const LANGUAGES = {
  kz: 'Қазақша',
  ru: 'Русский',
  en: 'English',
}

const DEFAULT_LANG = 'ru'
const VALID_LANGS = Object.keys(LANGUAGES)
const LEGAL_PAGE = 'legal'
const ORGANIZATIONS_PAGE = 'organizations'

const LICENSE_TEXT = `Copyright (c) 2026 KazRENA.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files, to deal in the software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense and sell copies of the software, and to permit persons to whom the software is furnished to do so.

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the software.

The license text must remain available on the /legal page or in a website section that serves an equivalent function. Removing, hiding, distorting, or modifying the license text, the copyright notice, or the author attribution is not permitted.

The software is provided "as is", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose and noninfringement. In no event shall the authors or copyright holders be liable for any claim, damages or other liability arising from the software or the use of the software.`

const ORGANIZATION_LINKS = {
  satbayev: {
    url: 'https://official.satbayev.university/',
    domain: 'official.satbayev.university',
    initials: 'SU',
  },
  turan: {
    url: 'https://turan.edu.kz/',
    domain: 'turan.edu.kz',
    initials: 'TU',
  },
  'turan-astana': {
    url: 'https://tau-edu.kz/',
    domain: 'tau-edu.kz',
    initials: 'TAU',
  },
  coventry: {
    url: 'https://coventry.edu.kz/',
    domain: 'coventry.edu.kz',
    initials: 'CU',
  },
  atyrau: {
    url: 'https://asu.edu.kz/',
    domain: 'asu.edu.kz',
    initials: 'AU',
  },
  iitu: {
    url: 'https://iitu.edu.kz/',
    domain: 'iitu.edu.kz',
    initials: 'IITU',
  },
  zhubanov: {
    url: 'https://zhubanov.edu.kz/',
    domain: 'zhubanov.edu.kz',
    initials: 'ZU',
  },
  'nur-mubarak': {
    url: 'https://nmu.edu.kz/',
    domain: 'nmu.edu.kz',
    initials: 'NMU',
  },
  metu: {
    url: 'https://metu.edu.kz/',
    domain: 'metu.edu.kz',
    initials: 'METU',
  },
  sdu: {
    url: 'https://sdu.edu.kz/',
    domain: 'sdu.edu.kz',
    initials: 'SDU',
  },
}

const CONTENT = {
  ru: {
    nav: { home: 'Главная', organizations: 'Организации', legal: 'Правовая информация' },
    aria: {
      mainNav: 'Основная навигация',
      language: 'Выбор языка',
      hotspotList: 'Список точек eduroam',
      stats: 'Сводка по сервису',
    },
    legalPage: {
      eyebrow: 'Правовая информация',
      title: 'Лицензия',
      lead: 'Лицензия программного обеспечения и уведомление об авторских правах.',
      developerSiteLabel: 'Сайт компании',
      developerSiteText: 'KazRENA',
      licenseSiteLabel: 'Источник текста лицензии',
      licenseSiteText: 'Страница лицензии на сайте разработчика',
    },
    landing: {
      eyebrow: 'Национальный сервис академического Wi-Fi',
      title: 'eduroam для университетов и научных организаций Казахстана',
      lead: 'Безопасный роуминг Wi-Fi для студентов, преподавателей, исследователей и сотрудников: подключитесь один раз в своей организации и используйте сеть в кампусах eduroam по всему миру.',
      userCta: 'Я пользователь',
      orgCta: 'Моя организация',
      country: 'Казахстан',
      aboutEyebrow: 'Что такое eduroam',
      aboutTitle: 'Глобальная мобильность для науки и образования',
      aboutText: [
        'eduroam, сокращение от education roaming, это международный сервис безопасного доступа к Wi-Fi для академического и исследовательского сообщества.',
        'В Казахстане национальным оператором и координатором сервиса является Ассоциация пользователей научно-образовательной компьютерной сети KazRENA.',
      ],
      connectEyebrow: 'Я пользователь',
      connectTitle: 'Как подключиться пользователю',
      cards: [
        {
          step: '01',
          title: 'Проверьте свою организацию',
          text: 'Учетные данные выдаются вашим университетом или научной организацией. Логин обычно используется вместе с доменом организации.',
        },
        {
          step: '02',
          title: 'Выберите сеть eduroam',
          text: 'Найдите Wi-Fi сеть eduroam на устройстве и подключитесь с помощью корпоративного логина и пароля.',
        },
        {
          step: '03',
          title: 'Пользуйтесь в поездках',
          text: 'При визитах в другие кампусы eduroam авторизация проходит через вашу домашнюю организацию без передачи пароля принимающей стороне.',
        },
      ],
      joinEyebrow: 'Хочу присоединиться',
      joinTitle: 'Для организаций',
      joinText: 'eduroam помогает вузам и научным организациям снизить нагрузку на гостевой Wi-Fi, упростить академическую мобильность и дать пользователям знакомый безопасный доступ в сеть.',
      joinCta: 'Смотреть страницу организаций',
      benefits: [
        'Один логин для кампуса и гостевых визитов',
        'Безопасная авторизация через инфраструктуру домашней организации',
        'Доступ в университетах, исследовательских центрах и библиотеках по миру',
      ],
    },
    organizationsPage: {
      eyebrow: 'Организации',
      title: 'Участники eduroam в Казахстане',
      lead: 'Страница для университетов, колледжей, исследовательских институтов, кампусов и библиотек, которые хотят подключить eduroam или проверить текущий список участников.',
      statsConnected: 'подключенные организации',
      statsCountries: 'стран в глобальной сети',
      statsOperator: 'национальный оператор',
      mapEyebrow: 'Hotspots',
      mapTitle: 'Карта точек eduroam в Казахстане',
      mapText: 'Локации подключенных организаций и кампусов, где пользователи могут искать сеть eduroam.',
      directoryEyebrow: 'Организации',
      directoryTitle: 'Список организаций',
      table: ['Организация', 'Город', 'Статус', 'Пользователи'],
      processEyebrow: 'Присоединение',
      processTitle: 'Как присоединиться',
      processText: 'Подключение проходит через KazRENA. Организация сохраняет управление своими учетными записями, а eduroam использует федеративную схему проверки пользователя.',
      joinSteps: [
        'Организация обращается к национальному оператору KazRENA.',
        'Техническая команда согласует RADIUS-инфраструктуру и параметры безопасности.',
        'После подключения пользователи получают доступ к eduroam в Казахстане и за рубежом.',
      ],
      contactEyebrow: 'Контакты',
      contactText: 'Ассоциация пользователей научно-образовательной компьютерной сети Казахстана.',
      address: 'г. Алматы, ул. Сатпаева, 16-18, офис 719, 721',
    },
    statuses: {
      connected: 'Подключена',
      announced: 'Анонсировано подключение',
      activeHotspot: 'Активная зона eduroam',
    },
    organizations: [
      {
        id: 'satbayev',
        name: 'Satpaev University',
        city: 'Алматы',
        status: 'connected',
        audience: 'студенты, преподаватели, исследователи',
      },
      {
        id: 'turan',
        name: 'Университет «Туран»',
        city: 'Алматы',
        status: 'connected',
        audience: 'обучающиеся и сотрудники университета',
      },
      {
        id: 'turan-astana',
        name: 'Turan - Astana University',
        city: 'Астана',
        status: 'connected',
        audience: 'студенты, преподаватели и сотрудники',
      },
      {
        id: 'coventry',
        name: 'Coventry University Kazakhstan',
        city: 'Астана',
        status: 'connected',
        audience: 'студенты, преподаватели и сотрудники',
      },
      {
        id: 'atyrau',
        name: 'Kh. Dosmukhamedov Atyrau University',
        city: 'Атырау',
        status: 'connected',
        audience: 'студенты, преподаватели и исследователи',
      },
      {
        id: 'iitu',
        name: 'International Information Technologies University',
        city: 'Алматы',
        status: 'connected',
        audience: 'студенты, профессорско-преподавательский состав и персонал',
      },
      {
        id: 'zhubanov',
        name: 'K.Zhubanov Aktobe regional University',
        city: 'Актобе',
        status: 'connected',
        audience: 'студенты, преподаватели и сотрудники',
      },
      {
        id: 'nur-mubarak',
        name: 'Egyptian University of Islamic Culture Nur-Mubarak',
        city: 'Алматы',
        status: 'connected',
        audience: 'студенты, преподаватели и сотрудники',
      },
      {
        id: 'metu',
        name: 'International Engineering and Technological University',
        city: 'Алматы',
        status: 'connected',
        audience: 'студенты, преподаватели и сотрудники',
      },
      {
        id: 'sdu',
        name: 'Suleyman Demirel University',
        city: 'Каскелен',
        status: 'connected',
        audience: 'академическое сообщество SDU',
      },
    ],
    hotspots: [
      {
        id: 'satbayev',
        name: 'Satpaev University',
        city: 'Алматы',
        address: 'ул. Сатпаева, 22',
        coordinates: [43.23659, 76.929995],
        status: 'activeHotspot',
      },
      {
        id: 'turan',
        name: 'Университет «Туран»',
        city: 'Алматы',
        address: 'ул. Сатпаева, 16А, кампус университета',
        coordinates: [43.2374, 76.9404],
        status: 'activeHotspot',
      },
      {
        id: 'turan-astana',
        name: 'Turan - Astana University',
        city: 'Астана',
        address: 'ул. Дүкенұлы, 29',
        coordinates: [51.181815, 71.430555],
        status: 'activeHotspot',
      },
      {
        id: 'coventry',
        name: 'Coventry University Kazakhstan',
        city: 'Астана',
        address: 'Коргалжынское шоссе, 13А',
        coordinates: [51.147914, 71.38504],
        status: 'activeHotspot',
      },
      {
        id: 'atyrau',
        name: 'Kh. Dosmukhamedov Atyrau University',
        city: 'Атырау',
        address: 'Студенческий проспект, 1',
        coordinates: [47.098425, 51.912139],
        status: 'activeHotspot',
      },
      {
        id: 'iitu',
        name: 'International Information Technologies University',
        city: 'Алматы',
        address: 'ул. Манаса, 34/1',
        coordinates: [43.235386, 76.909875],
        status: 'activeHotspot',
      },
      {
        id: 'zhubanov',
        name: 'K.Zhubanov Aktobe regional University',
        city: 'Актобе',
        address: 'пр. Алии Молдагуловой, 34',
        coordinates: [50.289325, 57.15262],
        status: 'activeHotspot',
      },
      {
        id: 'nur-mubarak',
        name: 'Egyptian University of Islamic Culture Nur-Mubarak',
        city: 'Алматы',
        address: 'пр. Аль-Фараби, 73',
        coordinates: [43.212068, 76.917765],
        status: 'activeHotspot',
      },
      {
        id: 'metu',
        name: 'International Engineering and Technological University',
        city: 'Алматы',
        address: 'пр. Аль-Фараби, 93Г/5',
        coordinates: [43.212653, 76.911222],
        status: 'activeHotspot',
      },
      {
        id: 'sdu',
        name: 'Suleyman Demirel University',
        city: 'Каскелен',
        address: 'пр. Абылай хана, 1/1',
        coordinates: [43.207123, 76.669268],
        status: 'activeHotspot',
      },
    ],
    footer: 'eduroam Kazakhstan, координация сервиса KazRENA',
  },
  kz: {
    nav: { home: 'Басты бет', organizations: 'Ұйымдар', legal: 'Құқықтық ақпарат' },
    aria: {
      mainNav: 'Негізгі навигация',
      language: 'Тілді таңдау',
      hotspotList: 'eduroam нүктелерінің тізімі',
      stats: 'Сервис бойынша қысқаша ақпарат',
    },
    legalPage: {
      eyebrow: 'Құқықтық ақпарат',
      title: 'Лицензия',
      lead: 'Бағдарламалық жасақтама лицензиясы және авторлық құқық туралы ескерту.',
      developerSiteLabel: 'Әзірлеушінің сайты',
      developerSiteText: 'KKSIHTKK DEV_SHOP',
      licenseSiteLabel: 'Лицензия мәтінінің көзі',
      licenseSiteText: 'Әзірлеуші сайтындағы лицензия беті',
    },
    landing: {
      eyebrow: 'Академиялық Wi-Fi ұлттық сервисі',
      title: 'Қазақстан университеттері мен ғылыми ұйымдарына арналған eduroam',
      lead: 'Студенттерге, оқытушыларға, зерттеушілерге және қызметкерлерге арналған қауіпсіз Wi-Fi роумингі: өз ұйымыңызда бір рет қосылып, бүкіл әлемдегі eduroam кампустарында желіні пайдаланыңыз.',
      userCta: 'Мен пайдаланушымын',
      orgCta: 'Менің ұйымым',
      country: 'Қазақстан',
      aboutEyebrow: 'eduroam туралы',
      aboutTitle: 'Ғылым мен білімге арналған жаһандық мобильділік',
      aboutText: [
        'eduroam, education roaming сөзінен қысқартылған, академиялық және зерттеу қауымдастығына арналған қауіпсіз Wi-Fi қолжетімділігінің халықаралық сервисі.',
        'Қазақстанда сервистің ұлттық операторы және үйлестірушісі KazRENA ғылыми-білім беру компьютерлік желісін пайдаланушылар қауымдастығы болып табылады.',
      ],
      connectEyebrow: 'Пайдаланушыға',
      connectTitle: 'Пайдаланушы қалай қосылады',
      cards: [
        {
          step: '01',
          title: 'Ұйымыңызды тексеріңіз',
          text: 'Есептік деректерді университетіңіз немесе ғылыми ұйымыңыз береді. Логин әдетте ұйым доменімен бірге қолданылады.',
        },
        {
          step: '02',
          title: 'eduroam желісін таңдаңыз',
          text: 'Құрылғыңыздан eduroam Wi-Fi желісін тауып, корпоративтік логин мен құпиясөз арқылы қосылыңыз.',
        },
        {
          step: '03',
          title: 'Сапарларда пайдаланыңыз',
          text: 'Басқа eduroam кампустарына барған кезде авторизация сіздің үй ұйымыңыз арқылы өтеді, құпиясөз қабылдаушы тарапқа берілмейді.',
        },
      ],
      joinEyebrow: 'Қосылу',
      joinTitle: 'Ұйымдарға',
      joinText: 'eduroam жоғары оқу орындары мен ғылыми ұйымдарға қонақ Wi-Fi жүктемесін азайтуға, академиялық мобильділікті жеңілдетуге және пайдаланушыларға таныс қауіпсіз желі қолжетімділігін беруге көмектеседі.',
      joinCta: 'Ұйымдар бетін қарау',
      benefits: [
        'Кампус пен қонақ сапарларына бір логин',
        'Үй ұйымының инфрақұрылымы арқылы қауіпсіз авторизация',
        'Әлемдегі университеттерде, зерттеу орталықтарында және кітапханаларда қолжетімділік',
      ],
    },
    organizationsPage: {
      eyebrow: 'Ұйымдар',
      title: 'Қазақстандағы eduroam қатысушылары',
      lead: 'Бұл бет eduroam-ға қосылғысы келетін немесе қатысушылар тізімін тексергісі келетін университеттерге, колледждерге, зерттеу институттарына, кампустарға және кітапханаларға арналған.',
      statsConnected: 'қосылған ұйым',
      statsCountries: 'жаһандық желідегі ел',
      statsOperator: 'ұлттық оператор',
      mapEyebrow: 'Hotspots',
      mapTitle: 'Қазақстандағы eduroam нүктелерінің картасы',
      mapText: 'Пайдаланушылар eduroam желісін іздей алатын қосылған ұйымдар мен кампустардың локациялары.',
      directoryEyebrow: 'Анықтама',
      directoryTitle: 'Ұйымдар тізімі',
      table: ['Ұйым', 'Қала', 'Мәртебе', 'Пайдаланушылар'],
      processEyebrow: 'Процесс',
      processTitle: 'Қалай қосылуға болады',
      processText: 'Қосылу KazRENA арқылы өтеді. Ұйым өз есептік жазбаларын басқаруды сақтайды, ал eduroam пайдаланушыны тексерудің федеративтік схемасын қолданады.',
      joinSteps: [
        'Ұйым KazRENA ұлттық операторына жүгінеді.',
        'Техникалық команда RADIUS инфрақұрылымын және қауіпсіздік параметрлерін келіседі.',
        'Қосылғаннан кейін пайдаланушылар Қазақстанда және шетелде eduroam-ға қол жеткізеді.',
      ],
      contactEyebrow: 'Байланыс',
      contactText: 'Қазақстанның ғылыми-білім беру компьютерлік желісін пайдаланушылар қауымдастығы.',
      address: 'Алматы қ., Сәтпаев к-сі, 16-18, 719, 721 кеңсе',
    },
    statuses: {
      connected: 'Қосылған',
      announced: 'Қосылу жарияланды',
      activeHotspot: 'eduroam белсенді аймағы',
    },
    organizations: [
      {
        id: 'satbayev',
        name: 'Satpaev University',
        city: 'Алматы',
        status: 'connected',
        audience: 'студенттер, оқытушылар, зерттеушілер',
      },
      {
        id: 'turan',
        name: '«Тұран» университеті',
        city: 'Алматы',
        status: 'connected',
        audience: 'университет білім алушылары мен қызметкерлері',
      },
      {
        id: 'turan-astana',
        name: 'Turan - Astana University',
        city: 'Астана',
        status: 'connected',
        audience: 'студенттер, оқытушылар және қызметкерлер',
      },
      {
        id: 'coventry',
        name: 'Coventry University Kazakhstan',
        city: 'Астана',
        status: 'connected',
        audience: 'студенттер, оқытушылар және қызметкерлер',
      },
      {
        id: 'atyrau',
        name: 'Х. Досмұхамедов атындағы Атырау университеті',
        city: 'Атырау',
        status: 'connected',
        audience: 'студенттер, оқытушылар және зерттеушілер',
      },
      {
        id: 'iitu',
        name: 'Халықаралық ақпараттық технологиялар университеті',
        city: 'Алматы',
        status: 'connected',
        audience: 'студенттер, профессор-оқытушылар құрамы және персонал',
      },
      {
        id: 'zhubanov',
        name: 'Қ. Жұбанов атындағы Ақтөбе өңірлік университеті',
        city: 'Ақтөбе',
        status: 'connected',
        audience: 'студенттер, оқытушылар және қызметкерлер',
      },
      {
        id: 'nur-mubarak',
        name: 'Нұр-Мүбарак Египет ислам мәдениеті университеті',
        city: 'Алматы',
        status: 'connected',
        audience: 'студенттер, оқытушылар және қызметкерлер',
      },
      {
        id: 'metu',
        name: 'Халықаралық инженерлік-технологиялық университеті',
        city: 'Алматы',
        status: 'connected',
        audience: 'студенттер, оқытушылар және қызметкерлер',
      },
      {
        id: 'sdu',
        name: 'Suleyman Demirel University',
        city: 'Қаскелең',
        status: 'connected',
        audience: 'SDU академиялық қауымдастығы',
      },
    ],
    hotspots: [
      {
        id: 'satbayev',
        name: 'Satpaev University',
        city: 'Алматы',
        address: 'Сәтпаев к-сі, 22',
        coordinates: [43.2360197, 76.9202422],
        status: 'activeHotspot',
      },
      {
        id: 'turan',
        name: '«Тұран» университеті',
        city: 'Алматы',
        address: 'Сәтпаев к-сі, 16А, университет кампусы',
        coordinates: [43.2374, 76.9404],
        status: 'activeHotspot',
      },
      {
        id: 'turan-astana',
        name: 'Turan - Astana University',
        city: 'Астана',
        address: 'Дүкенұлы к-сі, 29',
        coordinates: [51.1815679, 71.43244],
        status: 'activeHotspot',
      },
      {
        id: 'coventry',
        name: 'Coventry University Kazakhstan',
        city: 'Астана',
        address: 'Қорғалжын тас жолы, 13А',
        coordinates: [51.1489885, 71.3554127],
        status: 'activeHotspot',
      },
      {
        id: 'atyrau',
        name: 'Х. Досмұхамедов атындағы Атырау университеті',
        city: 'Атырау',
        address: 'Студенттер даңғылы, 1',
        coordinates: [47.1012483, 51.9136422],
        status: 'activeHotspot',
      },
      {
        id: 'iitu',
        name: 'Халықаралық ақпараттық технологиялар университеті',
        city: 'Алматы',
        address: 'Манас к-сі, 34/1',
        coordinates: [43.23517, 76.90978],
        status: 'activeHotspot',
      },
      {
        id: 'zhubanov',
        name: 'Қ. Жұбанов атындағы Ақтөбе өңірлік университеті',
        city: 'Ақтөбе',
        address: 'Әлия Молдағұлова даңғылы, 34',
        coordinates: [50.2890898, 57.1536497],
        status: 'activeHotspot',
      },
      {
        id: 'nur-mubarak',
        name: 'Нұр-Мүбарак Египет ислам мәдениеті университеті',
        city: 'Алматы',
        address: 'Әл-Фараби даңғылы, 73',
        coordinates: [43.2123327, 76.9178057],
        status: 'activeHotspot',
      },
      {
        id: 'metu',
        name: 'Халықаралық инженерлік-технологиялық университеті',
        city: 'Алматы',
        address: 'Әл-Фараби даңғылы, 93Г/5',
        coordinates: [43.2283977, 76.9554344],
        status: 'activeHotspot',
      },
      {
        id: 'sdu',
        name: 'Suleyman Demirel University',
        city: 'Қаскелең',
        address: 'Абылай хан даңғылы, 1/1',
        coordinates: [43.2075546, 76.6696884],
        status: 'activeHotspot',
      },
    ],
    footer: 'eduroam Kazakhstan, KazRENA сервисінің үйлестіруі',
  },
  en: {
    nav: { home: 'Home', organizations: 'Organizations', legal: 'Legal' },
    aria: {
      mainNav: 'Main navigation',
      language: 'Language selector',
      hotspotList: 'eduroam hotspot list',
      stats: 'Service summary',
    },
    legalPage: {
      eyebrow: 'Legal',
      title: 'License',
      lead: 'Software license and copyright notice.',
      developerSiteLabel: 'Developer website',
      developerSiteText: 'KKSIHTKK DEV_SHOP',
      licenseSiteLabel: 'License text source',
      licenseSiteText: 'License page on the developer website',
    },
    landing: {
      eyebrow: 'National academic Wi-Fi service',
      title: 'eduroam for universities and research organizations in Kazakhstan',
      lead: 'Secure Wi-Fi roaming for students, teachers, researchers and staff: connect once at your home organization and use eduroam across campuses worldwide.',
      userCta: 'I am a user',
      orgCta: 'My organization',
      country: 'Kazakhstan',
      aboutEyebrow: 'About eduroam',
      aboutTitle: 'Global mobility for research and education',
      aboutText: [
        'eduroam, short for education roaming, is an international secure Wi-Fi access service for the academic and research community.',
        'In Kazakhstan, the national operator and coordinator of the service is KazRENA, the Association of Users of the Scientific and Educational Computer Network.',
      ],
      connectEyebrow: 'For users',
      connectTitle: 'How users connect',
      cards: [
        {
          step: '01',
          title: 'Check your organization',
          text: 'Credentials are issued by your university or research organization. The username is usually used together with the organization domain.',
        },
        {
          step: '02',
          title: 'Choose the eduroam network',
          text: 'Find the eduroam Wi-Fi network on your device and connect with your institutional username and password.',
        },
        {
          step: '03',
          title: 'Use it while travelling',
          text: 'When visiting other eduroam campuses, authentication is handled by your home organization without sharing your password with the visited site.',
        },
      ],
      joinEyebrow: 'Join eduroam',
      joinTitle: 'For organizations',
      joinText: 'eduroam helps universities and research organizations reduce guest Wi-Fi load, simplify academic mobility and give users familiar secure access to the network.',
      joinCta: 'View organizations page',
      benefits: [
        'One login for campus and guest visits',
        'Secure authentication through the home organization infrastructure',
        'Access at universities, research centers and libraries worldwide',
      ],
    },
    organizationsPage: {
      eyebrow: 'Organizations',
      title: 'eduroam participants in Kazakhstan',
      lead: 'A page for universities, colleges, research institutes, campuses and libraries that want to join eduroam or check the current list of participants.',
      statsConnected: 'connected organizations',
      statsCountries: 'countries in the global network',
      statsOperator: 'national operator',
      mapEyebrow: 'Hotspots',
      mapTitle: 'eduroam hotspot map in Kazakhstan',
      mapText: 'Locations of connected organizations and campuses where users can look for the eduroam network.',
      directoryEyebrow: 'Directory',
      directoryTitle: 'Organization list',
      table: ['Organization', 'City', 'Status', 'Users'],
      processEyebrow: 'Process',
      processTitle: 'How to join',
      processText: 'Connection is coordinated through KazRENA. The organization keeps control of its user accounts, while eduroam uses a federated authentication model.',
      joinSteps: [
        'The organization contacts the national operator KazRENA.',
        'The technical team agrees on RADIUS infrastructure and security parameters.',
        'After connection, users receive access to eduroam in Kazakhstan and abroad.',
      ],
      contactEyebrow: 'Contact',
      contactText: 'Association of Users of the Scientific and Educational Computer Network of Kazakhstan.',
      address: 'Almaty, Satpayev St. 16-18, offices 719, 721',
    },
    statuses: {
      connected: 'Connected',
      announced: 'Connection announced',
      activeHotspot: 'Active eduroam zone',
    },
    organizations: [
      {
        id: 'satbayev',
        name: 'Satpaev University',
        city: 'Almaty',
        status: 'connected',
        audience: 'students, teachers, researchers',
      },
      {
        id: 'turan',
        name: 'Turan University',
        city: 'Almaty',
        status: 'connected',
        audience: 'students and university staff',
      },
      {
        id: 'turan-astana',
        name: 'Turan - Astana University',
        city: 'Astana',
        status: 'connected',
        audience: 'students, faculty and staff',
      },
      {
        id: 'coventry',
        name: 'Coventry University Kazakhstan',
        city: 'Astana',
        status: 'connected',
        audience: 'students, faculty and staff',
      },
      {
        id: 'atyrau',
        name: 'Kh. Dosmukhamedov Atyrau University',
        city: 'Atyrau',
        status: 'connected',
        audience: 'students, faculty and researchers',
      },
      {
        id: 'iitu',
        name: 'International Information Technologies University',
        city: 'Almaty',
        status: 'connected',
        audience: 'students, faculty and staff',
      },
      {
        id: 'zhubanov',
        name: 'K.Zhubanov Aktobe regional University',
        city: 'Aktobe',
        status: 'connected',
        audience: 'students, faculty and staff',
      },
      {
        id: 'nur-mubarak',
        name: 'Egyptian University of Islamic Culture Nur-Mubarak',
        city: 'Almaty',
        status: 'connected',
        audience: 'students, faculty and staff',
      },
      {
        id: 'metu',
        name: 'International Engineering and Technological University',
        city: 'Almaty',
        status: 'connected',
        audience: 'students, faculty and staff',
      },
      {
        id: 'sdu',
        name: 'Suleyman Demirel University',
        city: 'Kaskelen',
        status: 'connected',
        audience: 'SDU academic community',
      },
    ],
    hotspots: [
      {
        id: 'satbayev',
        name: 'Satpaev University',
        city: 'Almaty',
        address: 'Satpayev St. 22',
        coordinates: [43.2360197, 76.9202422],
        status: 'activeHotspot',
      },
      {
        id: 'turan',
        name: 'Turan University',
        city: 'Almaty',
        address: 'Satpayev St. 16A, university campus',
        coordinates: [43.2374, 76.9404],
        status: 'activeHotspot',
      },
      {
        id: 'turan-astana',
        name: 'Turan - Astana University',
        city: 'Astana',
        address: 'Dukenuly St. 29',
        coordinates: [51.1815679, 71.43244],
        status: 'activeHotspot',
      },
      {
        id: 'coventry',
        name: 'Coventry University Kazakhstan',
        city: 'Astana',
        address: 'Korgalzhyn Highway 13A',
        coordinates: [51.1489885, 71.3554127],
        status: 'activeHotspot',
      },
      {
        id: 'atyrau',
        name: 'Kh. Dosmukhamedov Atyrau University',
        city: 'Atyrau',
        address: 'Studenchesky Ave. 1',
        coordinates: [47.1012483, 51.9136422],
        status: 'activeHotspot',
      },
      {
        id: 'iitu',
        name: 'International Information Technologies University',
        city: 'Almaty',
        address: 'Manas St. 34/1',
        coordinates: [43.23517, 76.90978],
        status: 'activeHotspot',
      },
      {
        id: 'zhubanov',
        name: 'K.Zhubanov Aktobe regional University',
        city: 'Aktobe',
        address: 'A. Moldagulova Ave. 34',
        coordinates: [50.2890898, 57.1536497],
        status: 'activeHotspot',
      },
      {
        id: 'nur-mubarak',
        name: 'Egyptian University of Islamic Culture Nur-Mubarak',
        city: 'Almaty',
        address: 'Al-Farabi Ave. 73',
        coordinates: [43.2123327, 76.9178057],
        status: 'activeHotspot',
      },
      {
        id: 'metu',
        name: 'International Engineering and Technological University',
        city: 'Almaty',
        address: 'Al-Farabi Ave. 93G/5',
        coordinates: [43.2283977, 76.9554344],
        status: 'activeHotspot',
      },
      {
        id: 'sdu',
        name: 'Suleyman Demirel University',
        city: 'Kaskelen',
        address: 'Abylay Khan Ave. 1/1',
        coordinates: [43.2075546, 76.6696884],
        status: 'activeHotspot',
      },
    ],
    footer: 'eduroam Kazakhstan, service coordination by KazRENA',
  },
}

function buildPath(lang, page) {
  const pagePath =
    page === ORGANIZATIONS_PAGE
      ? 'organizations/'
      : page === LEGAL_PAGE
        ? 'legal/'
        : ''

  return `/${lang}/${pagePath}`
}

function getRouteState() {
  const segments = window.location.pathname.split('/').filter(Boolean)
  const langIndex = segments.findIndex((segment) => VALID_LANGS.includes(segment))
  const basePath =
    langIndex > 0 ? `/${segments.slice(0, langIndex).join('/')}` : ''
  const lang = langIndex >= 0 ? segments[langIndex] : DEFAULT_LANG
  const pageSegment = langIndex >= 0 ? segments[langIndex + 1] : ''
  const page =
    pageSegment === ORGANIZATIONS_PAGE || pageSegment === LEGAL_PAGE
      ? pageSegment
      : 'landing'

  return { basePath, lang, page }
}

function restoreGithubPagesRoute() {
  const redirectPath = sessionStorage.getItem('spa-redirect-path')

  if (!redirectPath) {
    return
  }

  sessionStorage.removeItem('spa-redirect-path')
  window.history.replaceState(null, '', redirectPath)
}

function buildRoutePath(route) {
  return `${route.basePath}${buildPath(route.lang, route.page)}`
}

function EduroamLogo({ onNavigate }) {
  return (
    <button
      className="brand"
      type="button"
      onClick={() => onNavigate('landing')}
      aria-label="eduroam Kazakhstan"
    >
      <img className="brand-logo" src={eduroamLogo} alt="eduroam" />
      <span className="brand-text">
        <small>Kazakhstan</small>
      </span>
    </button>
  )
}

function Header({ lang, page, onLanguageChange, onNavigate, t }) {
  return (
    <header className="site-header">
      <EduroamLogo onNavigate={onNavigate} />
      <select
        className="mobile-language-select"
        aria-label={t.aria.language}
        value={lang}
        onChange={(event) => onLanguageChange(event.target.value)}
      >
        {VALID_LANGS.map((item) => (
          <option key={item} value={item}>
            {item.toUpperCase()}
          </option>
        ))}
      </select>
      <div className="header-controls">
        <nav className="site-nav" aria-label={t.aria.mainNav}>
          <button
            className={page === 'landing' ? 'active' : ''}
            type="button"
            onClick={() => onNavigate('landing')}
          >
            {t.nav.home}
          </button>
          <button
            className={page === ORGANIZATIONS_PAGE ? 'active' : ''}
            type="button"
            onClick={() => onNavigate(ORGANIZATIONS_PAGE)}
          >
            {t.nav.organizations}
          </button>
        </nav>
        <div className="language-switcher" aria-label={t.aria.language}>
          {VALID_LANGS.map((item) => (
            <button
              className={lang === item ? 'active' : ''}
              key={item}
              type="button"
              onClick={() => onLanguageChange(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
    </header>
  )
}

function useRevealOnScroll(page, lang) {
  useEffect(() => {
    const elements = document.querySelectorAll('[data-reveal]')

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return undefined
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return
          }

          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        })
      },
      {
        rootMargin: '0px 0px -12% 0px',
        threshold: 0.12,
      },
    )

    elements.forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [page, lang])
}

function HotspotMap({ t }) {
  const mapNodeRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [selectedId, setSelectedId] = useState(t.hotspots[0].id)

  const selectedHotspot =
    t.hotspots.find((hotspot) => hotspot.id === selectedId) || t.hotspots[0]

  useEffect(() => {
    if (!mapNodeRef.current || mapInstanceRef.current) {
      return undefined
    }

    const map = L.map(mapNodeRef.current, {
      scrollWheelZoom: false,
      zoomControl: true,
    }).setView([43.2305, 76.84], 10)

    L.tileLayer(
      'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
      {
        attribution:
          '&copy; OpenStreetMap contributors &copy; CARTO',
        maxZoom: 19,
      },
    ).addTo(map)

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
      markersRef.current = []
    }
  }, [])

  useEffect(() => {
    if (!mapInstanceRef.current) {
      return
    }

    const map = mapInstanceRef.current
    markersRef.current.forEach((marker) => marker.remove())

    const activeIcon = L.divIcon({
      className: 'hotspot-marker hotspot-marker-active',
      html: '<span></span>',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    })

    const pendingIcon = L.divIcon({
      className: 'hotspot-marker hotspot-marker-pending',
      html: '<span></span>',
      iconSize: [28, 28],
      iconAnchor: [14, 14],
    })

    markersRef.current = t.hotspots.map((hotspot) => {
      const marker = L.marker(hotspot.coordinates, {
        icon: hotspot.status === 'announced' ? pendingIcon : activeIcon,
      }).addTo(map)

      marker.bindTooltip(hotspot.name, {
        direction: 'top',
        offset: [0, -12],
      })

      marker.on('click', () => {
        setSelectedId(hotspot.id)
        map.flyTo(hotspot.coordinates, 13, {
          duration: 0.7,
        })
      })

      return marker
    })

    const bounds = L.latLngBounds(
      t.hotspots.map((hotspot) => hotspot.coordinates),
    )
    map.fitBounds(bounds, {
      padding: [42, 42],
      maxZoom: 6,
    })
  }, [t])

  const focusHotspot = (hotspot) => {
    setSelectedId(hotspot.id)

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(hotspot.coordinates, 13, {
        duration: 0.7,
      })
    }
  }

  return (
    <section className="map-section">
      <div className="content-container map-inner">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">{t.organizationsPage.mapEyebrow}</p>
          <h2>{t.organizationsPage.mapTitle}</h2>
          <p>{t.organizationsPage.mapText}</p>
        </div>

        <div className="map-layout">
          <div className="map-panel" data-reveal>
            <div className="leaflet-map" ref={mapNodeRef}></div>
          </div>
          <aside className="hotspot-panel" data-reveal>
            <div className="selected-hotspot">
              <span className="status-pill">
                {t.statuses[selectedHotspot.status]}
              </span>
              <h3>{selectedHotspot.name}</h3>
              <p>{selectedHotspot.address}</p>
              <strong>{selectedHotspot.city}</strong>
            </div>
            <div className="hotspot-list" aria-label={t.aria.hotspotList}>
              {t.hotspots.map((hotspot) => (
                <button
                  className={selectedId === hotspot.id ? 'active' : ''}
                  key={hotspot.id}
                  type="button"
                  onClick={() => focusHotspot(hotspot)}
                >
                  <span>{hotspot.name}</span>
                  <small>{hotspot.city}</small>
                </button>
              ))}
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}

function OrganizationLogoStrip({ t }) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <>
      <div
        className={`organization-ribbon ${isExpanded ? 'expanded' : ''}`}
      >
        {t.organizations.map((organization, index) => {
          const link = ORGANIZATION_LINKS[organization.id]
          const logoUrl = `https://www.google.com/s2/favicons?domain=${link.domain}&sz=128`

          return (
            <a
              className={`organization-logo-card ${
                index >= 4 ? 'mobile-collapsible' : ''
              }`}
              href={link.url}
              key={organization.id}
              rel="noreferrer"
              target="_blank"
            >
              <span className="organization-logo">
                <img
                  alt=""
                  src={logoUrl}
                  onError={(event) => {
                    event.currentTarget.style.display = 'none'
                  }}
                />
                <span>{link.initials}</span>
              </span>
              <strong>{organization.name}</strong>
              <small>{organization.city}</small>
            </a>
          )
        })}
      </div>
      <button
        className={`organization-toggle ${isExpanded ? 'expanded' : ''}`}
        type="button"
        onClick={() => setIsExpanded((current) => !current)}
        aria-expanded={isExpanded}
      >
        <span>{isExpanded ? 'Свернуть' : 'Показать все'}</span>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </>
  )
}

function Landing({ onNavigate, t }) {
  return (
    <main>
      <section className="hero-section">
        <div className="content-container hero-inner">
          <div className="hero-copy hero-animate">
            <p className="eyebrow">{t.landing.eyebrow}</p>
            <h1>{t.landing.title}</h1>
            <p className="hero-lead">{t.landing.lead}</p>
            <div className="hero-actions">
              <a className="primary-action" href="#connect">
                {t.landing.userCta}
              </a>
              <button
                className="secondary-action"
                type="button"
                onClick={() => onNavigate(ORGANIZATIONS_PAGE)}
              >
                {t.landing.orgCta}
              </button>
            </div>
          </div>
          <div className="hero-visual hero-animate" aria-hidden="true">
            <div className="orbit orbit-one"></div>
            <div className="orbit orbit-two"></div>
            <div className="signal-card">
              <span className="wifi-dot"></span>
              <strong>eduroam</strong>
              <small>secure academic roaming</small>
            </div>
            <div className="map-card">
              <span>{t.landing.country}</span>
              <strong>KazRENA</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="section-band about-band" id="about">
        <div className="content-container">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">{t.landing.aboutEyebrow}</p>
            <h2>{t.landing.aboutTitle}</h2>
          </div>
          <div className="about-grid">
            {t.landing.aboutText.map((text) => (
              <p data-reveal key={text}>
                {text}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="section-band" id="connect">
        <div className="content-container">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">{t.landing.connectEyebrow}</p>
            <h2>{t.landing.connectTitle}</h2>
          </div>
          <div className="cards-grid">
            {t.landing.cards.map((card) => (
              <article data-reveal key={card.step}>
                <span className="step">{card.step}</span>
                <h3>{card.title}</h3>
                <p>{card.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="split-section">
        <div className="content-container split-inner">
          <div data-reveal>
            <p className="eyebrow">{t.landing.joinEyebrow}</p>
            <h2>{t.landing.joinTitle}</h2>
            <p>{t.landing.joinText}</p>
            <button
              className="text-action"
              type="button"
              onClick={() => onNavigate(ORGANIZATIONS_PAGE)}
            >
              {t.landing.joinCta}
            </button>
          </div>
          <ul className="benefit-list">
            {t.landing.benefits.map((benefit) => (
              <li data-reveal key={benefit}>
                {benefit}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  )
}

function Organizations({ t }) {
  const connectedCount = useMemo(
    () => t.organizations.filter((item) => item.status === 'connected').length,
    [t],
  )

  return (
    <main>
      <section className="page-hero">
        <div className="content-container hero-animate">
          <p className="eyebrow">{t.organizationsPage.eyebrow}</p>
          <h1>{t.organizationsPage.title}</h1>
          <p>{t.organizationsPage.lead}</p>
        </div>
      </section>

      <section className="stats-row" aria-label={t.aria.stats}>
        <div className="content-container stats-inner">
          <div data-reveal>
            <strong>{connectedCount}</strong>
            <span>{t.organizationsPage.statsConnected}</span>
          </div>
          <div data-reveal>
            <strong>100+</strong>
            <span>{t.organizationsPage.statsCountries}</span>
          </div>
          <div data-reveal>
            <strong>KazRENA</strong>
            <span>{t.organizationsPage.statsOperator}</span>
          </div>
        </div>
      </section>

      <HotspotMap t={t} />

      <section className="organization-list">
        <div className="content-container">
          <div className="section-heading" data-reveal>
            <p className="eyebrow">{t.organizationsPage.directoryEyebrow}</p>
            <h2>{t.organizationsPage.directoryTitle}</h2>
          </div>
          <OrganizationLogoStrip t={t} />
        </div>
      </section>

      <section className="split-section join-section">
        <div className="content-container split-inner">
          <div data-reveal>
            <p className="eyebrow">{t.organizationsPage.processEyebrow}</p>
            <h2>{t.organizationsPage.processTitle}</h2>
            <p>{t.organizationsPage.processText}</p>
          </div>
          <ol className="join-steps">
            {t.organizationsPage.joinSteps.map((step) => (
              <li data-reveal key={step}>
                {step}
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="contact-band">
        <div className="content-container contact-inner">
          <div data-reveal>
            <p className="eyebrow">{t.organizationsPage.contactEyebrow}</p>
            <h2>KazRENA</h2>
            <p>{t.organizationsPage.contactText}</p>
          </div>
          <address data-reveal>
            <a href="mailto:info@kazrena.kz">info@kazrena.kz</a>
            <a href="tel:+77">+7 707 829 74 77</a>
            <span>{t.organizationsPage.address}</span>
          </address>
        </div>
      </section>
    </main>
  )
}

function Legal({ t }) {
  return (
    <main>
      <section className="page-hero legal-hero">
        <div className="content-container hero-animate">
          <p className="eyebrow">{t.legalPage.eyebrow}</p>
          <h1>{t.legalPage.title}</h1>
          <p>{t.legalPage.lead}</p>
        </div>
      </section>

      <section className="legal-section">
        <div className="content-container">
          <article className="legal-document" data-reveal>
              <pre id="license">{LICENSE_TEXT}</pre>
            </article>
          {/* <div className="legal-layout">
            <aside className="legal-links" data-reveal>
              <a
                href="https://shop.kksihtkk.dev"
                rel="noreferrer"
                target="_blank"
              >
                <span>{t.legalPage.developerSiteLabel}</span>
                <strong>{t.legalPage.developerSiteText}</strong>
              </a>
              <a
                href="https://shop.kksihtkk.dev/legal#license"
                rel="noreferrer"
                target="_blank"
              >
                <span>{t.legalPage.licenseSiteLabel}</span>
                <strong>{t.legalPage.licenseSiteText}</strong>
              </a>
            </aside>
          </div> */}
        </div>
      </section>
    </main>
  )
}

function scrollPageToTop() {
  const scrollOptions = { top: 0, left: 0, behavior: 'auto' }
  const scrollingElement = document.scrollingElement || document.documentElement

  window.scrollTo(scrollOptions)
  scrollingElement.scrollTo(scrollOptions)
  document.documentElement.scrollTop = 0
  document.body.scrollTop = 0
}

function App() {
  restoreGithubPagesRoute()
  const [route, setRoute] = useState(getRouteState)
  const t = CONTENT[route.lang]

  useRevealOnScroll(route.page, route.lang)

  useEffect(() => {
    const currentRoute = getRouteState()
    const expectedPath = buildRoutePath(currentRoute)

    if (window.location.pathname !== expectedPath) {
      window.history.replaceState(null, '', expectedPath)
    }

    const handlePopState = () => {
      setRoute(getRouteState())
    }

    window.addEventListener('popstate', handlePopState)

    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  useLayoutEffect(() => {
    scrollPageToTop()
    const frameId = window.requestAnimationFrame(scrollPageToTop)

    return () => window.cancelAnimationFrame(frameId)
  }, [route.page, route.lang])

  const updateRoute = (nextRoute, replace = false) => {
    const path = buildRoutePath(nextRoute)
    const method = replace ? 'replaceState' : 'pushState'

    window.history[method](null, '', path)
    setRoute(nextRoute)
  }

  const handleNavigate = (page) => {
    updateRoute({ ...route, page })
  }

  const handleLanguageChange = (lang) => {
    updateRoute({ ...route, lang })
  }

  return (
    <>
      <Header
        lang={route.lang}
        page={route.page}
        onLanguageChange={handleLanguageChange}
        onNavigate={handleNavigate}
        t={t}
      />
      {route.page === LEGAL_PAGE && <Legal t={t} />}
      {route.page === ORGANIZATIONS_PAGE && <Organizations t={t} />}
      {route.page === 'landing' && <Landing onNavigate={handleNavigate} t={t} />}
      <footer className="site-footer">
        <EduroamLogo onNavigate={handleNavigate} />
        <div className="footer-copy">
          <p>{t.footer}</p>
          <button type="button" onClick={() => handleNavigate(LEGAL_PAGE)}>
            {t.nav.legal}
          </button>
        </div>
      </footer>
    </>
  )
}

export default App
