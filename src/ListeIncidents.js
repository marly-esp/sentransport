import { useState, useEffect } from 'react';
import './ListeIncidents.css';

function ListeIncidents({ refreshTrigger }) {
  const [incidents, setIncidents] = useState([]);
  const [chargement, setChargement] = useState(true);

  useEffect(() => {
    fetch("http://localhost:5000/incidents")
      .then(r => r.json())
      .then(data => {
        setIncidents(data);
        setChargement(false);
      })
      .catch(err => {
        console.error("Erreur incidents :", err);
        setChargement(false);
      });
  }, [refreshTrigger]);

  if (chargement) {
    return <p className="incidents-chargement">Chargement des incidents...</p>;
  }

  return (
    <div className="incidents-container">
      <h2 className="incidents-titre">Incidents signalés</h2>
      {incidents.length === 0 ? (
        <p className="incidents-vide">Aucun incident signalé pour le moment.</p>
      ) : (
        <ul className="incidents-liste">
          {incidents.slice().reverse().map(inc => (
            <li key={inc.id} className="incident-item">
              <span className="incident-ligne">Ligne {inc.ligne}</span>
              <span className="incident-lieu">{inc.lieu}</span>
              <p className="incident-description">{inc.description}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListeIncidents;