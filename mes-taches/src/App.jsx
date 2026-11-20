import { useEffect, useState } from 'react'
import Carte from './components/Carte.jsx'
import Compteur from './components/Compteur.jsx'
import Entete from './components/Entete.jsx'
import FormulaireAjout from './components/FormulaireAjout.jsx'
import Horloge from './components/Horloge.jsx'
import ListeTaches from './components/ListeTaches.jsx'
import Pied from './components/Pied.jsx'

const auteur = "Mohamed Ait El Kadi"

function App() {
  const [taches, setTaches] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)
  const restantes = taches.filter((tache) => !tache.terminee).length

  useEffect(() => {
    let annule = false

    fetch('/taches.json')
      .then((reponse) => {
        if (!reponse.ok) throw new Error(`Erreur HTTP ${reponse.status}`)
        return reponse.json()
      })
      .then((donnees) => {
        if (!annule) setTaches(donnees)
      })
      .catch((err) => {
        if (!annule) setErreur(err.message)
      })
      .finally(() => {
        if (!annule) setChargement(false)
      })

    return () => {
      annule = true
    }
  }, [])

  useEffect(() => {
    document.title = `(${restantes}) Mes tâches`
  }, [restantes])

  function ajouterTache(titre) {
    const nouvelleTache = { id: crypto.randomUUID(), titre, terminee: false }
    setTaches((tachesActuelles) => [...tachesActuelles, nouvelleTache])
  }

  function basculerTache(id) {
    setTaches(
      taches.map((tache) =>
        tache.id === id ? { ...tache, terminee: !tache.terminee } : tache,
      ),
    )
  }

  function supprimerTache(id) {
    setTaches(taches.filter((tache) => tache.id !== id))
  }

  return (
    <div className="app">
      <Entete />
      <Carte titre="Heure actuelle">
        <Horloge />
      </Carte>
      <Carte titre="Compteur">
        <Compteur />
      </Carte>
      <Carte titre="Ajouter une tâche">
        <FormulaireAjout onAjouter={ajouterTache} />
      </Carte>
      <Carte titre="Ma liste">
        {chargement ? (
          <p className="vide">Chargement des tâches…</p>
        ) : erreur ? (
          <p className="erreur">{erreur}</p>
        ) : (
          <ListeTaches
            taches={taches}
            onBasculer={basculerTache}
            onSupprimer={supprimerTache}
          />
        )}
      </Carte>
      <Pied auteur={auteur} />
    </div>
  )
}

export default App
