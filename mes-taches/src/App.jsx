import Entete from './components/Entete.jsx'
import ListeTaches from './components/ListeTaches.jsx'
import Pied from './components/Pied.jsx'

const TACHES = [
  { id: 1, titre: 'Installer Node.js et Vite', terminee: true },
  { id: 2, titre: 'Comprendre les composants', terminee: true },
  { id: 3, titre: 'Passer des données avec les props', terminee: false },
  { id: 4, titre: "Gérer l'état avec useState", terminee: false },
]
const auteur = "Mohamed Ait El Kadi"

function App() {
  return (
    <div className="app">
      <Entete />
      <section className="carte">
        <h2>Ma liste</h2>
        <ListeTaches taches={TACHES} />
      </section>
      <Pied auteur={auteur} />
    </div>
  )
}

export default App