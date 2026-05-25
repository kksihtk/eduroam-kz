import { useMemo, useState } from 'react'
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
      <span className="brand-mark" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
      <span className="brand-text">
        <strong>eduroam</strong>
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

function Landing({ setPage }) {
  return (
    <main>
      <section className="hero-section">
        <div className="content-container hero-inner">
        <div className="hero-copy">
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
        <div className="hero-visual" aria-hidden="true">
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
        <div className="section-heading">
          <p className="eyebrow">Acerca de eduroam</p>
          <h2>Глобальная мобильность для науки и образования</h2>
        </div>
        <div className="about-grid">
          <p>
            eduroam, сокращение от education roaming, это международный сервис
            безопасного доступа к Wi-Fi для академического и исследовательского
            сообщества.
          </p>
          <p>
            В Казахстане национальным оператором и координатором сервиса
            является Ассоциация пользователей научно-образовательной
            компьютерной сети KazRENA.
          </p>
        </div>
        </div>
      </section>

      <section className="section-band" id="connect">
        <div className="content-container">
        <div className="section-heading">
          <p className="eyebrow">Soy un usuario</p>
          <h2>Как подключиться пользователю</h2>
        </div>
        <div className="cards-grid">
          <article>
            <span className="step">01</span>
            <h3>Проверьте свою организацию</h3>
            <p>
              Учетные данные выдаются вашим университетом или научной
              организацией. Логин обычно используется вместе с доменом
              организации.
            </p>
          </article>
          <article>
            <span className="step">02</span>
            <h3>Выберите сеть eduroam</h3>
            <p>
              Найдите Wi-Fi сеть eduroam на устройстве и подключитесь с помощью
              корпоративного логина и пароля.
            </p>
          </article>
          <article>
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
        <div>
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
            <li key={benefit}>{benefit}</li>
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
        <div className="content-container">
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
        <div>
          <strong>{connectedCount}</strong>
          <span>подключенные организации</span>
        </div>
        <div>
          <strong>100+</strong>
          <span>стран в глобальной сети</span>
        </div>
        <div>
          <strong>KazRENA</strong>
          <span>национальный оператор</span>
        </div>
        </div>
      </section>

      <section className="organization-list">
        <div className="content-container">
        <div className="section-heading">
          <p className="eyebrow">Directorio</p>
          <h2>Список организаций</h2>
        </div>
        <div className="table-shell">
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
        <div>
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
            <li key={step}>{step}</li>
          ))}
        </ol>
        </div>
      </section>

      <section className="contact-band">
        <div className="content-container contact-inner">
        <div>
          <p className="eyebrow">Contacto</p>
          <h2>KazRENA</h2>
          <p>
            Ассоциация пользователей научно-образовательной компьютерной сети
            Казахстана.
          </p>
        </div>
        <address>
          <a href="mailto:sapar@kazrena.kz">sapar@kazrena.kz</a>
          <a href="tel:+77078297477">+7 707 829 74 77</a>
          <span>г. Алматы, ул. Сатпаева, 16-18, офис 719, 721</span>
        </address>
        </div>
      </section>
    </main>
  )
}

function App() {
  const [page, setPage] = useState('landing')

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
