import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Menu, X, GraduationCap, CalendarDays, Images, Star, MapPin,
  Phone, MessageCircle, ArrowRight, Sparkles, BookOpen, Heart,
  Trophy, Palette, Bus, Wifi, ChevronRight, Download
} from "lucide-react";
import { supabase } from "./lib/supabase";
import { initFirebase } from "./lib/firebase";
import "./styles.css";

const school = {
  name: "Colégio Lima Nogueira",
  short: "CLN",
  address: "Júlio Braga, 1117",
  phone: "(85) 3290-6500",
  whatsapp: "5585996865812",
  whatsappDisplay: "(85) 9 9686-5812",
  levels: "Do Ensino Fundamental II ao Ensino Médio."
};

const defaultEvents = [
  {
    title: "FEST LIMA",
    date: "Ao longo do ano",
    category: "Arte & Cultura",
    text: "Semanas de arte e cultura que transformam a escola em um espaço de expressão, criatividade e convivência.",
    icon: Palette
  },
  {
    title: "Feiras culturais",
    date: "Programação anual",
    category: "Conhecimento",
    text: "Projetos e apresentações que aproximam estudantes, professores, famílias e comunidade.",
    icon: BookOpen
  },
  {
    title: "Passeios escolares",
    date: "Programação anual",
    category: "Experiências",
    text: "Aprendizagem para além da sala de aula, com experiências que ficam na memória.",
    icon: Bus
  }
];

const defaultReviews = [
  { name: "Mariana Alves", text: "Uma escola acolhedora, com eventos muito bonitos e atividades que aproximam os alunos. A inclusão e o respeito fazem diferença no dia a dia.", stars: 5 },
  { name: "Carlos Henrique", text: "Gosto muito da forma como o colégio incentiva a participação dos alunos. Os eventos culturais são momentos muito especiais para toda a comunidade.", stars: 5 },
  { name: "Juliana Martins", text: "O ambiente escolar transmite acolhimento e respeito. É muito positivo ver ações de inclusão social e oportunidades para os estudantes participarem.", stars: 5 }
];

const gallery = [
  { src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlNUnNi9irnjzN5owaCY9i4lbztftRH0ne_P30xs9FTQKJf_AquBAyOfAsj7vFDXzRO3xYyWlUFUSGiBRuT2gwv2C2P_Vgg-1rM9s9GMUhkmYle8ajJggtKaf2074kbTzTDRk0=s680-w680-h510", alt: "Estudantes em ambiente escolar" },
  { src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWlqAUykPcoeViqAju2TBoo2E95o8ESPPcxsLjYoFbMEUexaqLNWk6P4o8DfumleBwh3V3FakxHmTkHykERa7i13qPNABuyzf_lwnXZqmZzNMJtR1tzE_TgUMsFvIaGxfnjuNaTG=s680-w680-h510", alt: "Sala de aula" },
  { src: "https://lh3.googleusercontent.com/gps-cs-s/AHRPTWkTrNzu0iq77P-fwe1-M1ONKrvE6QDLCR9Up4U_EeVBTEPoRug4lT6tivQOzW2uqSb5SjljuTBl4-ez8TGaq-rxGrc3sLsdbPOKGlzaxUPTQlHCvjvzHD1QZBV1DX_R6xPz3PA=s680-w680-h510", alt: "Tecnologia e aprendizagem" },
  { src: "https://scontent.ffor50-1.fna.fbcdn.net/v/t39.30808-6/514539310_24311930815091986_6172154030928365423_n.jpg?stp=dst-jpg_tt6&cstp=mx1280x720&ctp=s1280x720&_nc_cat=102&ccb=1-7&_nc_sid=cf85f3&_nc_ohc=o4AQybWv3w0Q7kNvwGCDUKz&_nc_oc=Adrvc8Is5OF8MFg_Hld1ZJcCklzTWn6cGulSxV_HTj-kBPwOAtirl6zF1txLBFhXmK0&_nc_zt=23&_nc_ht=scontent.ffor50-1.fna&_nc_gid=9pNdXn3ywES4zy-nKJOugw&_nc_ss=7b289&oh=00_AQK_PJp5qPYykk07godKcXrCvGbwClvF46mVxmSt-n6tQA&oe=6AA69760", alt: "Estudantes juntos" },
  { src: "https://scontent.ffor50-1.fna.fbcdn.net/v/t39.30808-6/515145948_24311930855091982_5789906513703101808_n.jpg?stp=dst-jpg_tt6&cstp=mx1280x720&ctp=s1280x720&_nc_cat=110&ccb=1-7&_nc_sid=cf85f3&_nc_ohc=vIrrXhjYrDsQ7kNvwFAqiCD&_nc_oc=AdrFGlLvR5SpBEDT5bupLJURspWPJN52ITq_qCXEstEeIH9RHu4TTKXugmd-SDJ7ROM&_nc_zt=23&_nc_ht=scontent.ffor50-1.fna&_nc_gid=fTgXw5_AkJqPUgXdbTgszg&_nc_ss=7b289&oh=00_AQIOQG0CXdm3kNB-iSD7akULb5dMkBHEmxrgJy5lVT04zA&oe=6AA6A12B", alt: "Atividade em grupo" },
  { src: "https://scontent.ffor50-1.fna.fbcdn.net/v/t39.30808-6/513963668_24310222181929516_7328129391297838011_n.jpg?stp=dst-jpg_tt6&cstp=mx1280x720&ctp=s1280x720&_nc_cat=109&ccb=1-7&_nc_sid=cf85f3&_nc_ohc=emizzKP5GEcQ7kNvwEp1WY5&_nc_oc=AdqIOUaEDAHfvkxLgPWkOt5tUdMglS0jiCQnmCdoZlGwzc4lr9h42-gihBKEb9vLEUg&_nc_zt=23&_nc_ht=scontent.ffor50-1.fna&_nc_gid=I1sIxzl6GQSj5Jgm2Z6B9g&_nc_ss=7b289&oh=00_AQKbb709cfwyE2gJr-GHKufzA_c_PuOS9fK6WRs2FFS8TQ&oe=6AA6A773", alt: "Biblioteca e estudo" }
];

function App() {
  const [menu, setMenu] = useState(false);
  const [events, setEvents] = useState(defaultEvents);
  const [reviews, setReviews] = useState(defaultReviews);
  const [installPrompt, setInstallPrompt] = useState(null);
  const [sent, setSent] = useState(false);

  useEffect(() => {
    initFirebase();
    if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
    const handler = e => { e.preventDefault(); setInstallPrompt(e); };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  useEffect(() => {
    async function loadData() {
      if (!supabase) return;
      const [{ data: ev }, { data: rv }] = await Promise.all([
        supabase.from("events").select("*").order("event_date", { ascending: true }),
        supabase.from("reviews").select("*").eq("published", true).order("created_at", { ascending: false })
      ]);
      if (ev?.length) setEvents(ev.map(x => ({ ...x, icon: CalendarDays })));
      if (rv?.length) setReviews(rv);
    }
    loadData();
  }, []);

  const go = id => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenu(false);
  };

  async function install() {
    if (!installPrompt) return;
    await installPrompt.prompt();
    setInstallPrompt(null);
  }

  async function contactSubmit(e) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name"),
      email: form.get("email"),
      message: form.get("message")
    };
    if (supabase) await supabase.from("contact_messages").insert(payload);
    setSent(true);
    e.currentTarget.reset();
  }

  return (
    <div>
      <header className="header">
        <div className="container nav">
          <button className="brand" onClick={() => go("inicio")} aria-label="Ir para o início">
            <img src="/logo.png" alt="Logo Colégio Lima Nogueira" />
            <span><strong>COLÉGIO LIMA NOGUEIRA</strong><small>Educação que acolhe</small></span>
          </button>
          <nav className={menu ? "nav-links open" : "nav-links"}>
            {[
              ["inicio", "Início"], ["escola", "A escola"], ["eventos", "Eventos"],
              ["galeria", "Galeria"], ["avaliacoes", "Avaliações"], ["contato", "Contato"]
            ].map(([id, label]) => <button key={id} onClick={() => go(id)}>{label}</button>)}
          </nav>
          <div className="nav-actions">
            {installPrompt && <button className="install-btn" onClick={install}><Download size={17}/> Instalar</button>}
            <button className="menu-btn" onClick={() => setMenu(!menu)} aria-label="Menu">{menu ? <X/> : <Menu/>}</button>
          </div>
        </div>
      </header>

      <main>
        <section id="inicio" className="hero">
          <div className="hero-glow glow-one"></div><div className="hero-glow glow-two"></div>
          <div className="container hero-grid">
            <div className="hero-copy">
              <div className="eyebrow"><Sparkles size={16}/> Colégio Lima Nogueira</div>
              <h1>Um lugar para <span>aprender, crescer</span> e pertencer.</h1>
              <p>Do Ensino Fundamental II ao Ensino Médio, construímos experiências de aprendizagem com acolhimento, cultura, criatividade e propósito.</p>
              <div className="hero-buttons">
                <button className="btn primary" onClick={() => go("escola")}>Conheça a escola <ArrowRight size={18}/></button>
                <a className="btn secondary" href={`https://wa.me/${school.whatsapp}?text=Olá! Gostaria de saber mais sobre o Colégio Lima Nogueira.`} target="_blank" rel="noreferrer"><MessageCircle size={18}/> Fale no WhatsApp</a>
              </div>
              <div className="hero-mini">
                <span><Heart size={17}/> Acolhimento</span>
                <span><GraduationCap size={17}/> Ensino Fundamental II</span>
                <span><Trophy size={17}/> Ensino Médio</span>
              </div>
            </div>
            <div className="hero-card">
              <div className="logo-ring"><img src="/logo.png" alt="CLN"/></div>
              <p>“Educação que acolhe, inspira e prepara para o futuro.”</p>
              <div className="hero-card-info"><MapPin size={17}/><span>{school.address}</span></div>
              <div className="hero-card-info"><Phone size={17}/><span>{school.phone}</span></div>
            </div>
          </div>
        </section>

        <section id="escola" className="section">
          <div className="container">
            <div className="section-heading">
              <div><span className="kicker">SOBRE O CLN</span><h2>Uma escola que <em>abraça</em> seus alunos.</h2></div>
              <p>O Colégio Lima Nogueira atende estudantes do Fundamental II ao Ensino Médio, valorizando aprendizagem, convivência e experiências que ultrapassam a sala de aula.</p>
            </div>
            <div className="feature-grid">
              <article className="feature-card"><div className="icon"><Heart/></div><h3>Acolhimento</h3><p>Um ambiente pensado para que o aluno se sinta ouvido, respeitado e parte da comunidade escolar.</p></article>
              <article className="feature-card"><div className="icon"><GraduationCap/></div><h3>Formação</h3><p>Do 6º ano do Fundamental II ao 3º ano do Ensino Médio, acompanhando diferentes etapas da jornada escolar.</p></article>
              <article className="feature-card"><div className="icon"><Sparkles/></div><h3>Experiências</h3><p>Passeios, feiras culturais e a FEST LIMA aproximam conhecimento, arte, cultura e vida real.</p></article>
            </div>
            <div className="numbers">
              <div><strong>6º</strong><span>ano do Fundamental II</span></div>
              <div><strong>9º</strong><span>ano do Fundamental II</span></div>
              <div><strong>3º</strong><span>ano do Ensino Médio</span></div>
              <div><strong>CLN</strong><span>Comunidade Lima Nogueira</span></div>
            </div>
          </div>
        </section>

        <section id="eventos" className="section soft">
          <div className="container">
            <div className="section-heading center"><div><span className="kicker">VIVÊNCIAS</span><h2>Momentos que viram <em>memórias.</em></h2></div><p>Uma escola viva tem calendário cheio de encontros, projetos e celebrações.</p></div>
            <div className="event-grid">
              {events.map((event, i) => {
                const Icon = event.icon || CalendarDays;
                return <article className="event-card" key={event.id || i}>
                  <div className="event-top"><span>{event.category || "Evento escolar"}</span><Icon size={22}/></div>
                  <h3>{event.title}</h3><p>{event.text}</p><div className="event-date"><CalendarDays size={15}/>{event.date || "Programação anual"}</div>
                </article>
              })}
            </div>
          </div>
        </section>

        <section id="galeria" className="section">
          <div className="container">
            <div className="section-heading">
              <div><span className="kicker">GALERIA</span><h2>A vida escolar em <em>imagens.</em></h2></div>
              <p>Registros dos projetos, eventos, passeios e momentos especiais do Colégio Lima Nogueira.</p>
            </div>
            <div className="gallery">
              {gallery.map((photo, i) => <img key={i} src={photo.src} alt={photo.alt} loading="lazy"/>)}
            </div>

          </div>
        </section>

        <section id="avaliacoes" className="section soft">
          <div className="container">
            <div className="section-heading center"><div><span className="kicker">CONFIANÇA</span><h2>O que dizem sobre o <em>CLN.</em></h2></div><p>Experiências compartilhadas por pessoas da comunidade escolar.</p></div>
            <div className="review-grid">
              {reviews.map((review, i) => <article className="review" key={review.id || i}>
                <div className="stars">{Array.from({length: review.stars || 5}).map((_, n) => <Star key={n} size={17} fill="currentColor"/>)}</div>
                <p>“{review.text}”</p><strong>{review.name}</strong><small>Google / Comunidade CLN</small>
              </article>)}
            </div>
            <div className="google-cta">
              <div><strong>Quer ver as avaliações oficiais?</strong><span>Abra o perfil do Colégio Lima Nogueira no Google.</span></div>
              <a href="https://www.google.com/search?q=Col%C3%A9gio+Lima+Nogueira+Fortaleza" target="_blank" rel="noreferrer" className="btn secondary">Ver no Google <ChevronRight size={17}/></a>
            </div>
          </div>
        </section>

        <section id="contato" className="section contact-section">
          <div className="container contact-grid">
            <div>
              <span className="kicker">FALE CONOSCO</span><h2>Vamos conversar?</h2>
              <p>Para informações sobre a escola, atendimento e orientações, entre em contato pelos canais oficiais.</p>
              <div className="contact-list">
                <a href={`tel:${school.phone.replace(/\D/g,"")}`}><div className="contact-icon"><Phone/></div><span><small>Telefone</small><strong>{school.phone}</strong></span></a>
                <a href={`https://wa.me/${school.whatsapp}`} target="_blank" rel="noreferrer"><div className="contact-icon"><MessageCircle/></div><span><small>WhatsApp</small><strong>{school.whatsappDisplay}</strong></span></a>
                <a href="https://www.google.com/maps/search/?api=1&query=J%C3%BAlio+Braga+1117+Fortaleza+CE" target="_blank" rel="noreferrer"><div className="contact-icon"><MapPin/></div><span><small>Endereço</small><strong>{school.address}</strong></span></a>
              </div>
            </div>
            <form className="contact-form" onSubmit={contactSubmit}>
              <label>Seu nome<input name="name" required placeholder="Como podemos chamar você?" /></label>
              <label>E-mail<input name="email" type="email" required placeholder="voce@email.com" /></label>
              <label>Mensagem<textarea name="message" required rows="5" placeholder="Escreva sua mensagem..."></textarea></label>
              <button className="btn primary" type="submit">Enviar mensagem <ArrowRight size={17}/></button>
              {sent && <div className="success">Mensagem registrada! Em um projeto conectado ao Supabase, ela ficará disponível para a equipe.</div>}
            </form>
          </div>
        </section>
      </main>

      <footer>
        <div className="container footer-grid">
          <div className="footer-brand"><img src="/logo.png" alt="CLN"/><div><strong>Colégio Lima Nogueira</strong><span>Educação que acolhe.</span></div></div>
          <div><span className="footer-title">Navegação</span><button onClick={() => go("escola")}>A escola</button><button onClick={() => go("eventos")}>Eventos</button><button onClick={() => go("galeria")}>Galeria</button></div>
          <div><span className="footer-title">Contato</span><span>{school.phone}</span><span>{school.address}</span><a href={`https://wa.me/${school.whatsapp}`} target="_blank" rel="noreferrer">WhatsApp</a></div>
        </div>
        <div className="container copyright">© {new Date().getFullYear()} Colégio Lima Nogueira. Todos os direitos reservados.</div>
      </footer>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
