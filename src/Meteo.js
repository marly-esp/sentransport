import { useState, useEffect } from 'react';
import './Meteo.css';

function Meteo() {
  const [meteo, setMeteo] = useState(null);
  const [erreur, setErreur] = useState(null);
  const [previsions, setPrevisions] = useState([]);

  useEffect(() => {
    const API_KEY = process.env.REACT_APP_OWM_KEY;
    if (!API_KEY) {
      setErreur("Cle API manquante (.env)");
      return;
    }

    // Meteo actuelle
    const url =
      `https://api.openweathermap.org/data/2.5/weather`
      + `?q=Dakar&appid=${API_KEY}`
      + `&units=metric&lang=fr`;

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error("Erreur : " + r.status);
        return r.json();
      })
      .then(data => {
        setMeteo({
          temperature: Math.round(data.main.temp),
          description: data.weather[0].description,
          condition: data.weather[0].main,
          humidite: data.main.humidity,
          icone: data.weather[0].icon,
        });
      })
      .catch(err => setErreur(err.message));

    // Previsions a 5 jours (Exercice 2)
    const urlForecast =
      `https://api.openweathermap.org/data/2.5/forecast`
      + `?q=Dakar&appid=${API_KEY}`
      + `&units=metric&lang=fr`;

    fetch(urlForecast)
      .then(r => {
        if (!r.ok) throw new Error("Erreur forecast : " + r.status);
        return r.json();
      })
      .then(data => {
        // On garde une seule prevision par jour (celle vers midi, 12:00:00)
        const parJour = data.list.filter(item => item.dt_txt.includes("12:00:00"));
        const troisProchains = parJour.slice(0, 3).map(item => ({
          date: item.dt_txt.split(" ")[0],
          temperature: Math.round(item.main.temp),
          description: item.weather[0].description,
          icone: item.weather[0].icon,
        }));
        setPrevisions(troisProchains);
      })
      .catch(err => console.error("Erreur previsions :", err));
  }, []);

  function getAlerte(condition) {
    if (condition === "Rain" || condition === "Drizzle") {
      return { message: "Pluie detectee - risque de retards", classe: "alerte-pluie" };
    }
    if (condition === "Thunderstorm") {
      return { message: "Orage en cours - soyez prudents", classe: "alerte-orage" };
    }
    return null;
  }

  function formatDate(dateStr) {
    const jours = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
    const d = new Date(dateStr);
    return jours[d.getDay()];
  }

  if (erreur) {
    return (
      <div className="meteo meteo-erreur">
        <p>Meteo indisponible</p>
        <p className="meteo-detail">{erreur}</p>
      </div>
    );
  }

  if (!meteo) {
    return <div className="meteo">Chargement meteo...</div>;
  }

  const alerte = getAlerte(meteo.condition);

  return (
    <div className="meteo">
      <div className="meteo-info">
        <img
          src={`https://openweathermap.org/img/wn/${meteo.icone}@2x.png`}
          alt={meteo.description}
          className="meteo-icone"
        />
        <div>
          <span className="meteo-temp">{meteo.temperature}&deg;C</span>
          <span className="meteo-desc">{meteo.description}</span>
        </div>
        <span className="meteo-humidite">Humidite : {meteo.humidite}%</span>
      </div>

      {alerte && (
        <div className={`meteo-alerte ${alerte.classe}`}>
          {alerte.message}
        </div>
      )}

      {previsions.length > 0 && (
        <div className="previsions-container">
          {previsions.map((p, index) => (
            <div key={index} className="prevision-jour">
              <span className="prevision-jour-nom">{formatDate(p.date)}</span>
              <img
                src={`https://openweathermap.org/img/wn/${p.icone}.png`}
                alt={p.description}
                className="prevision-icone"
              />
              <span className="prevision-temp">{p.temperature}&deg;C</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Meteo;