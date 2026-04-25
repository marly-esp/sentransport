import './App.css';
import Header from './Header';
import Footer from './Footer';

function Statistique1() {
  return (
    <div className="statistique">
      <span className="statistique-chiffre">10</span>
      <span className="statistique-libelle">Lignes</span>
    </div>
  );
}

function Statistique2() {
  return (
    <div className="statistique">
      <span className="statistique-chiffre">150</span>
      <span className="statistique-libelle">Arrêts</span>
    </div>
  );
}

function Statistique3() {
  return (
    <div className="statistique">
      <span className="statistique-chiffre">45</span>
      <span className="statistique-libelle">Bus actifs</span>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Header />
      <main className="contenu">
        <p>Bienvenue ! Cette application vous aide à trouver votre ligne de bus à Dakar.</p>
        <div className="statistiques-container">
          <Statistique1 />
          <Statistique2 />
          <Statistique3 />
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;