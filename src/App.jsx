import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import eduroamLogo from './assets/eduroam-logo.svg'
import './App.css'

const organizations = [
  {
    name: 'Satbayev University',
    city: 'Алматы',
    status: 'Подключена',
    audience: 'студенты, преподаватели, исследователи',
  },
  {
    name: 'Университет «Туран»',
    city: 'Алматы',
    status: 'Подключена',
    audience: 'обучающиеся и сотрудники университета',
  },
  {
    name: 'Университет имени Сулеймана Демиреля',
    city: 'Каскелен',
    status: 'Подключена',
    audience: 'академическое сообщество SDU',
  },
  {
    name: 'International Information Technology University',
    city: 'Алматы',
    status: 'Анонсировано подключение',
    audience: 'студенты, профессорско-преподавательский состав и персонал',
  },
]

const hotspots = [
  {
    name: 'Satbayev University',
    city: 'Алматы',
    address: 'ул. Сатпаева, кампус Satbayev University',
    coordinates: [43.2367, 76.9293],
    status: 'Активная зона eduroam',
  },
  {
    name: 'Университет «Туран»',
    city: 'Алматы',
    address: 'ул. Сатпаева, кампус университета',
    coordinates: [43.2361, 76.9314],
    status: 'Активная зона eduroam',
  },
  {
    name: 'Университет имени Сулеймана Демиреля',
    city: 'Каскелен',
    address: 'кампус SDU University',
    coordinates: [43.2077, 76.6691],
    status: 'Активная зона eduroam',
  },
  {
    name: 'International Information Technology University',
    city: 'Алматы',
    address: 'ул. Манаса, кампус IITU',
    coordinates: [43.2354, 76.9093],
    status: 'Анонсировано подключение',
  },
]

const benefits = [
  'Один логин для кампуса и гостевых визитов',
  'Безопасная авторизация через инфраструктуру домашней организации',
  'Доступ в университетах, исследовательских центрах и библиотеках по миру',
]

const joinSteps = [
  'Организация обращается к национальному оператору KazRENA.',
  'Техническая команда согласует RADIUS-инфраструктуру и параметры безопасности.',
  'После подключения пользователи получают доступ к eduroam в Казахстане и за рубежом.',
]

function EduroamLogo() {
  return (
    <a className="brand" href="#landing" aria-label="eduroam Kazakhstan">
      <img className="brand-logo" src={eduroamLogo} alt="eduroam" />
      <span className="brand-text">
        <small>Kazakhstan</small>
      </span>
    </a>
  )
}

function Header({ page, setPage }) {
  return (
    <header className="site-header">
      <EduroamLogo />
      <nav className="site-nav" aria-label="Основная навигация">
        <button
          className={page === 'landing' ? 'active' : ''}
          type="button"
          onClick={() => setPage('landing')}
        >
          Главная
        </button>
        <button
          className={page === 'organizations' ? 'active' : ''}
          type="button"
          onClick={() => setPage('organizations')}
        >
          Организации
        </button>
      </nav>
    </header>
  )
}

function useRevealOnScroll(page) {
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
  }, [page])
}

function HotspotMap() {
  const mapNodeRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const [selectedHotspot, setSelectedHotspot] = useState(hotspots[0])

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

    markersRef.current = hotspots.map((hotspot) => {
      const marker = L.marker(hotspot.coordinates, {
        icon: hotspot.status.includes('Анонсировано') ? pendingIcon : activeIcon,
      }).addTo(map)

      marker.bindTooltip(hotspot.name, {
        direction: 'top',
        offset: [0, -12],
      })

      marker.on('click', () => {
        setSelectedHotspot(hotspot)
        map.flyTo(hotspot.coordinates, 13, {
          duration: 0.7,
        })
      })

      return marker
    })

    mapInstanceRef.current = map

    return () => {
      map.remove()
      mapInstanceRef.current = null
      markersRef.current = []
    }
  }, [])

  const focusHotspot = (hotspot) => {
    setSelectedHotspot(hotspot)

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
          <p className="eyebrow">Hotspots</p>
          <h2>Карта точек eduroam в Казахстане</h2>
          <p>
            Локации подключенных организаций и кампусов, где пользователи могут
            искать сеть eduroam.
          </p>
        </div>

        <div className="map-layout">
          <div className="map-panel" data-reveal>
            <div className="leaflet-map" ref={mapNodeRef}></div>
          </div>
          <aside className="hotspot-panel" data-reveal>
            <div className="selected-hotspot">
              <span className="status-pill">{selectedHotspot.status}</span>
              <h3>{selectedHotspot.name}</h3>
              <p>{selectedHotspot.address}</p>
              <strong>{selectedHotspot.city}</strong>
            </div>
            <div className="hotspot-list" aria-label="Список точек eduroam">
              {hotspots.map((hotspot) => (
                <button
                  className={
                    selectedHotspot.name === hotspot.name ? 'active' : ''
                  }
                  key={hotspot.name}
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

function Landing({ setPage }) {
  return (
    <main>
      <section className="hero-section">
        <div className="content-container hero-inner">
        <div className="hero-copy hero-animate">
          <p className="eyebrow">Национальный сервис академического Wi-Fi</p>
          <h1>eduroam для университетов и научных организаций Казахстана</h1>
          <p className="hero-lead">
            Безопасный роуминг Wi-Fi для студентов, преподавателей,
            исследователей и сотрудников: подключитесь один раз в своей
            организации и используйте сеть в кампусах eduroam по всему миру.
          </p>
          <div className="hero-actions">
            <a className="primary-action" href="#connect">
              Я пользователь
            </a>
            <button
              className="secondary-action"
              type="button"
              onClick={() => setPage('organizations')}
            >
              Моя организация
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
          <span>Казахстан</span>
          <strong>KazRENA</strong>
        </div>
        </div>
        </div>
      </section>

      <section className="section-band about-band" id="about">
        <div className="content-container">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Acerca de eduroam</p>
          <h2>Глобальная мобильность для науки и образования</h2>
        </div>
        <div className="about-grid">
          <p data-reveal>
            eduroam, сокращение от education roaming, это международный сервис
            безопасного доступа к Wi-Fi для академического и исследовательского
            сообщества.
          </p>
          <p data-reveal>
            В Казахстане национальным оператором и координатором сервиса
            является Ассоциация пользователей научно-образовательной
            компьютерной сети KazRENA.
          </p>
        </div>
        </div>
      </section>

      <section className="section-band" id="connect">
        <div className="content-container">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Soy un usuario</p>
          <h2>Как подключиться пользователю</h2>
        </div>
        <div className="cards-grid">
          <article data-reveal>
            <span className="step">01</span>
            <h3>Проверьте свою организацию</h3>
            <p>
              Учетные данные выдаются вашим университетом или научной
              организацией. Логин обычно используется вместе с доменом
              организации.
            </p>
          </article>
          <article data-reveal>
            <span className="step">02</span>
            <h3>Выберите сеть eduroam</h3>
            <p>
              Найдите Wi-Fi сеть eduroam на устройстве и подключитесь с помощью
              корпоративного логина и пароля.
            </p>
          </article>
          <article data-reveal>
            <span className="step">03</span>
            <h3>Пользуйтесь в поездках</h3>
            <p>
              При визитах в другие кампусы eduroam авторизация проходит через
              вашу домашнюю организацию без передачи пароля принимающей стороне.
            </p>
          </article>
        </div>
        </div>
      </section>

      <section className="split-section">
        <div className="content-container split-inner">
        <div data-reveal>
          <p className="eyebrow">Quiero unirme</p>
          <h2>Для организаций</h2>
          <p>
            eduroam помогает вузам и научным организациям снизить нагрузку на
            гостевой Wi-Fi, упростить академическую мобильность и дать
            пользователям знакомый безопасный доступ в сеть.
          </p>
          <button
            className="text-action"
            type="button"
            onClick={() => setPage('organizations')}
          >
            Смотреть страницу организаций
          </button>
        </div>
        <ul className="benefit-list">
          {benefits.map((benefit) => (
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

function Organizations() {
  const connectedCount = useMemo(
    () => organizations.filter((item) => item.status === 'Подключена').length,
    [],
  )

  return (
    <main>
      <section className="page-hero">
        <div className="content-container hero-animate">
        <p className="eyebrow">Организации</p>
        <h1>Участники eduroam в Казахстане</h1>
        <p>
          Страница для университетов, колледжей, исследовательских институтов,
          кампусов и библиотек, которые хотят подключить eduroam или проверить
          текущий список участников.
        </p>
        </div>
      </section>

      <section className="stats-row" aria-label="Сводка по сервису">
        <div className="content-container stats-inner">
        <div data-reveal>
          <strong>{connectedCount}</strong>
          <span>подключенные организации</span>
        </div>
        <div data-reveal>
          <strong>100+</strong>
          <span>стран в глобальной сети</span>
        </div>
        <div data-reveal>
          <strong>KazRENA</strong>
          <span>национальный оператор</span>
        </div>
        </div>
      </section>

      <HotspotMap />

      <section className="organization-list">
        <div className="content-container">
        <div className="section-heading" data-reveal>
          <p className="eyebrow">Directorio</p>
          <h2>Список организаций</h2>
        </div>
        <div className="table-shell" data-reveal>
          <table>
            <thead>
              <tr>
                <th>Организация</th>
                <th>Город</th>
                <th>Статус</th>
                <th>Пользователи</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((organization) => (
                <tr key={organization.name}>
                  <td>{organization.name}</td>
                  <td>{organization.city}</td>
                  <td>
                    <span className="status-pill">{organization.status}</span>
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
          <p className="eyebrow">Proceso</p>
          <h2>Как присоединиться</h2>
          <p>
            Подключение проходит через KazRENA. Организация сохраняет
            управление своими учетными записями, а eduroam использует
            федеративную схему проверки пользователя.
          </p>
        </div>
        <ol className="join-steps">
          {joinSteps.map((step) => (
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
          <p className="eyebrow">Contacto</p>
          <h2>KazRENA</h2>
          <p>
            Ассоциация пользователей научно-образовательной компьютерной сети
            Казахстана.
          </p>
        </div>
        <address data-reveal>
          <a href="mailto:sapar@kazrena.kz">sapar@kazrena.kz</a>
          <a href="tel:+77078297477">+7 707 829 74 77</a>
          <span>г. Алматы, ул. Сатпаева, 16-18, офис 719, 721</span>
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
  const [page, setPage] = useState('landing')
  useRevealOnScroll(page)

  useLayoutEffect(() => {
    scrollPageToTop()
    const frameId = window.requestAnimationFrame(scrollPageToTop)

    return () => window.cancelAnimationFrame(frameId)
  }, [page])

  return (
    <>
      <Header page={page} setPage={setPage} />
      {page === 'landing' ? <Landing setPage={setPage} /> : <Organizations />}
      <footer className="site-footer">
        <EduroamLogo />
        <p>eduroam Kazakhstan, координация сервиса KazRENA</p>
      </footer>
    </>
  )
}

export default App
