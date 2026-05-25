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

const CONTENT = {
  ru: {
    nav: { home: 'Главная', organizations: 'Организации' },
    aria: {
      mainNav: 'Основная навигация',
      language: 'Выбор языка',
      hotspotList: 'Список точек eduroam',
      stats: 'Сводка по сервису',
    },
    landing: {
      eyebrow: 'Национальный сервис академического Wi-Fi',
      title: 'eduroam для университетов и научных организаций Казахстана',
      lead: 'Безопасный роуминг Wi-Fi для студентов, преподавателей, исследователей и сотрудников: подключитесь один раз в своей организации и используйте сеть в кампусах eduroam по всему миру.',
      userCta: 'Я пользователь',
      orgCta: 'Моя организация',
      country: 'Казахстан',
      aboutEyebrow: 'Acerca de eduroam',
      aboutTitle: 'Глобальная мобильность для науки и образования',
      aboutText: [
        'eduroam, сокращение от education roaming, это международный сервис безопасного доступа к Wi-Fi для академического и исследовательского сообщества.',
        'В Казахстане национальным оператором и координатором сервиса является Ассоциация пользователей научно-образовательной компьютерной сети KazRENA.',
      ],
      connectEyebrow: 'Soy un usuario',
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
      joinEyebrow: 'Quiero unirme',
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
      directoryEyebrow: 'Directorio',
      directoryTitle: 'Список организаций',
      table: ['Организация', 'Город', 'Статус', 'Пользователи'],
      processEyebrow: 'Proceso',
      processTitle: 'Как присоединиться',
      processText: 'Подключение проходит через KazRENA. Организация сохраняет управление своими учетными записями, а eduroam использует федеративную схему проверки пользователя.',
      joinSteps: [
        'Организация обращается к национальному оператору KazRENA.',
        'Техническая команда согласует RADIUS-инфраструктуру и параметры безопасности.',
        'После подключения пользователи получают доступ к eduroam в Казахстане и за рубежом.',
      ],
      contactEyebrow: 'Contacto',
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
        name: 'Satbayev University',
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
        id: 'sdu',
        name: 'Университет имени Сулеймана Демиреля',
        city: 'Каскелен',
        status: 'connected',
        audience: 'академическое сообщество SDU',
      },
      {
        id: 'iitu',
        name: 'International Information Technology University',
        city: 'Алматы',
        status: 'announced',
        audience: 'студенты, профессорско-преподавательский состав и персонал',
      },
    ],
    hotspots: [
      {
        id: 'satbayev',
        name: 'Satbayev University',
        city: 'Алматы',
        address: 'ул. Сатпаева, кампус Satbayev University',
        coordinates: [43.2367, 76.9293],
        status: 'activeHotspot',
      },
      {
        id: 'turan',
        name: 'Университет «Туран»',
        city: 'Алматы',
        address: 'ул. Сатпаева, кампус университета',
        coordinates: [43.2361, 76.9314],
        status: 'activeHotspot',
      },
      {
        id: 'sdu',
        name: 'Университет имени Сулеймана Демиреля',
        city: 'Каскелен',
        address: 'кампус SDU University',
        coordinates: [43.2077, 76.6691],
        status: 'activeHotspot',
      },
      {
        id: 'iitu',
        name: 'International Information Technology University',
        city: 'Алматы',
        address: 'ул. Манаса, кампус IITU',
        coordinates: [43.2354, 76.9093],
        status: 'announced',
      },
    ],
    footer: 'eduroam Kazakhstan, координация сервиса KazRENA',
  },
  kz: {
    nav: { home: 'Басты бет', organizations: 'Ұйымдар' },
    aria: {
      mainNav: 'Негізгі навигация',
      language: 'Тілді таңдау',
      hotspotList: 'eduroam нүктелерінің тізімі',
      stats: 'Сервис бойынша қысқаша ақпарат',
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
        name: 'Satbayev University',
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
        id: 'sdu',
        name: 'Сүлейман Демирел атындағы университет',
        city: 'Қаскелең',
        status: 'connected',
        audience: 'SDU академиялық қауымдастығы',
      },
      {
        id: 'iitu',
        name: 'International Information Technology University',
        city: 'Алматы',
        status: 'announced',
        audience: 'студенттер, профессор-оқытушылар құрамы және персонал',
      },
    ],
    hotspots: [
      {
        id: 'satbayev',
        name: 'Satbayev University',
        city: 'Алматы',
        address: 'Сәтпаев к-сі, Satbayev University кампусы',
        coordinates: [43.2367, 76.9293],
        status: 'activeHotspot',
      },
      {
        id: 'turan',
        name: '«Тұран» университеті',
        city: 'Алматы',
        address: 'Сәтпаев к-сі, университет кампусы',
        coordinates: [43.2361, 76.9314],
        status: 'activeHotspot',
      },
      {
        id: 'sdu',
        name: 'Сүлейман Демирел атындағы университет',
        city: 'Қаскелең',
        address: 'SDU University кампусы',
        coordinates: [43.2077, 76.6691],
        status: 'activeHotspot',
      },
      {
        id: 'iitu',
        name: 'International Information Technology University',
        city: 'Алматы',
        address: 'Манас к-сі, IITU кампусы',
        coordinates: [43.2354, 76.9093],
        status: 'announced',
      },
    ],
    footer: 'eduroam Kazakhstan, KazRENA сервисінің үйлестіруі',
  },
  en: {
    nav: { home: 'Home', organizations: 'Organizations' },
    aria: {
      mainNav: 'Main navigation',
      language: 'Language selector',
      hotspotList: 'eduroam hotspot list',
      stats: 'Service summary',
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
        name: 'Satbayev University',
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
        id: 'sdu',
        name: 'Suleyman Demirel University',
        city: 'Kaskelen',
        status: 'connected',
        audience: 'SDU academic community',
      },
      {
        id: 'iitu',
        name: 'International Information Technology University',
        city: 'Almaty',
        status: 'announced',
        audience: 'students, faculty and staff',
      },
    ],
    hotspots: [
      {
        id: 'satbayev',
        name: 'Satbayev University',
        city: 'Almaty',
        address: 'Satpayev St., Satbayev University campus',
        coordinates: [43.2367, 76.9293],
        status: 'activeHotspot',
      },
      {
        id: 'turan',
        name: 'Turan University',
        city: 'Almaty',
        address: 'Satpayev St., university campus',
        coordinates: [43.2361, 76.9314],
        status: 'activeHotspot',
      },
      {
        id: 'sdu',
        name: 'Suleyman Demirel University',
        city: 'Kaskelen',
        address: 'SDU University campus',
        coordinates: [43.2077, 76.6691],
        status: 'activeHotspot',
      },
      {
        id: 'iitu',
        name: 'International Information Technology University',
        city: 'Almaty',
        address: 'Manas St., IITU campus',
        coordinates: [43.2354, 76.9093],
        status: 'announced',
      },
    ],
    footer: 'eduroam Kazakhstan, service coordination by KazRENA',
  },
}

function buildPath(lang, page) {
  return `/${lang}/${page === 'organizations' ? 'organizations/' : ''}`
}

function getRouteState() {
  const segments = window.location.pathname.split('/').filter(Boolean)
  const lang = VALID_LANGS.includes(segments[0]) ? segments[0] : DEFAULT_LANG
  const page = segments[1] === 'organizations' ? 'organizations' : 'landing'
  return { lang, page }
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
            className={page === 'organizations' ? 'active' : ''}
            type="button"
            onClick={() => onNavigate('organizations')}
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

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

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
                onClick={() => onNavigate('organizations')}
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
              onClick={() => onNavigate('organizations')}
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
          <div className="table-shell" data-reveal>
            <table>
              <thead>
                <tr>
                  {t.organizationsPage.table.map((heading) => (
                    <th key={heading}>{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.organizations.map((organization) => (
                  <tr key={organization.id}>
                    <td>{organization.name}</td>
                    <td>{organization.city}</td>
                    <td>
                      <span className="status-pill">
                        {t.statuses[organization.status]}
                      </span>
                    </td>
                    <td>{organization.audience}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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
            <a href="mailto:sapar@kazrena.kz">sapar@kazrena.kz</a>
            <a href="tel:+77078297477">+7 707 829 74 77</a>
            <span>{t.organizationsPage.address}</span>
          </address>
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
  const [route, setRoute] = useState(getRouteState)
  const t = CONTENT[route.lang]

  useRevealOnScroll(route.page, route.lang)

  useEffect(() => {
    const currentRoute = getRouteState()
    const expectedPath = buildPath(currentRoute.lang, currentRoute.page)

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
    const path = buildPath(nextRoute.lang, nextRoute.page)
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
      {route.page === 'landing' ? (
        <Landing onNavigate={handleNavigate} t={t} />
      ) : (
        <Organizations t={t} />
      )}
      <footer className="site-footer">
        <EduroamLogo onNavigate={handleNavigate} />
        <p>{t.footer}</p>
      </footer>
    </>
  )
}

export default App
