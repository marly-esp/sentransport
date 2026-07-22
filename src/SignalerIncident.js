import { useState, useEffect } from 'react';
import './SignalerIncident.css';

function SignalerIncident({ onIncidentAjoute }) {
  const [ligne, setLigne] = useState("");
  const [description, setDescription] = useState("");
  const [lieu, setLieu] = useState("");
  const [message, setMessage] = useState(null);
  const [enCours, setEnCours] = useState(false);
  const [lignesDisponibles, setLignesDisponibles] = useState([]);

  // Charger les lignes disponibles pour le menu deroulant (Exercice 3)
  useEffect(() => {
    fetch("http://localhost:5000/lignes")
      .then(r => r.json())
      .then(data => setLignesDisponibles(data))
      .catch(err => console.error("Erreur lignes :", err));
  }, []);

  function handleSubmit() {
    if (!ligne || !description) {
      setMessage({ type: "erreur", texte: "Remplissez la ligne et la description." });
      return;
    }
    setEnCours(true);

    fetch("http://localhost:5000/incidents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ligne,
        description,
        lieu: lieu || "Non precise"
      }),
    })
      .then(r => {
        if (!r.ok) throw new Error("Erreur serveur");
        return r.json();
      })
      .then(data => {
        setMessage({ type: "succes", texte: "Incident #" + data.id + " signale. Merci !" });
        setLigne("");
        setDescription("");
        setLieu("");
        setEnCours(false);
        onIncidentAjoute();
      })
      .catch(err => {
        setMessage({ type: "erreur", texte: err.message });
        setEnCours(false);
      });
  }

  return (
    <div className="signaler">
      <h2 className="signaler-titre">Signaler un incident</h2>
      <div className="signaler-form">
        <select
          value={ligne}
          onChange={e => setLigne(e.target.value)}
          className="signaler-input signaler-select"
        >
          <option value="">-- Choisir une ligne --</option>
          {lignesDisponibles.map(l => (
            <option key={l.id} value={l.numero}>
              Ligne {l.numero} ({l.depart} → {l.arrivee})
            </option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Lieu (ex: Colobane)"
          value={lieu}
          onChange={e => setLieu(e.target.value)}
          className="signaler-input"
        />
        <textarea
          placeholder="Description de l'incident..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          className="signaler-textarea"
          rows={3}
        />
        <button
          onClick={handleSubmit}
          disabled={enCours}
          className="signaler-btn"
        >
          {enCours ? "Envoi en cours..." : "Signaler"}
        </button>
      </div>
      {message && (
        <div className={`signaler-message signaler-${message.type}`}>
          {message.texte}
        </div>
      )}
    </div>
  );
}

export default SignalerIncident;