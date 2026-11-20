import { useEffect, useState } from 'react'
import Carte from './components/Carte.jsx'
import Compteur from './components/Compteur.jsx'
import Entete from './components/Entete.jsx'
import FormulaireAjout from './components/FormulaireAjout.jsx'
import Horloge from './components/Horloge.jsx'
import ListeTaches from './components/ListeTaches.jsx'
import Pied from './components/Pied.jsx'

const auteur = "Mohamed Ait El Kadi"
const CLE_SAUVEGARDE = 'mes-taches'

function App() {
  const [taches, setTaches] = useState([])
  const [chargement, setChargement] = useState(true)
  const [erreur, setErreur] = useState(null)
  const [horlogeVisible, setHorlogeVisible] = useState(true)
  const restantes = taches.filter((tache) => !tache.terminee).length
  const terminees = taches.length - restantes

  useEffect(() => {
    let annule = false

    Promise.resolve()
      .then(() => {
        try {
          const sauvegarde = JSON.parse(localStorage.getItem(CLE_SAUVEGARDE))
          if (
            Array.isArray(sauvegarde) &&
            sauvegarde.every((tache) =>
              tache !== null &&
              (typeof tache.id === 'number' || typeof tache.id === 'string') &&
              typeof tache.titre === 'string' &&
              typeof tache.terminee === 'boolean',
            )
          ) {
            return sauvegarde
          }
        } catch (err) {
          console.warn('Sauvegarde locale illisible : chargement du fichier JSON.', err)
        }

        return fetch('/taches.json').then((reponse) => {
          if (!reponse.ok) throw new Error(`Erreur HTTP ${reponse.status}`)
          return reponse.json()
        })
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
    // Attendre le chargement évite d'écraser la sauvegarde avec le tableau vide initial.
    if (chargement || erreur) return

    try {
      localStorage.setItem(CLE_SAUVEGARDE, JSON.stringify(taches))
    } catch (err) {
      console.warn('Impossible de sauvegarder les tâches localement.', err)
    }
  }, [taches, chargement, erreur])

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

  function supprimerTerminees() {
    setTaches((tachesActuelles) => tachesActuelles.filter((tache) => !tache.terminee))
  }

  function modifierTache(id, titre) {
    const titreNettoye = titre.trim()
    if (titreNettoye === '') return

    setTaches((tachesActuelles) =>
      tachesActuelles.map((tache) =>
        tache.id === id ? { ...tache, titre: titreNettoye } : tache,
      ),
    )
  }

  return (
    <div className="app">
      <Entete />
      <Carte titre="Heure actuelle">
        <button
          onClick={() => setHorlogeVisible((visible) => !visible)}
          aria-expanded={horlogeVisible}
        >
          {horlogeVisible ? "Masquer l'horloge" : "Afficher l'horloge"}
        </button>
        {horlogeVisible && <Horloge />}
      </Carte>
      <Carte titre="Compteur">
        <Compteur />
      </Carte>
      <Carte titre="Ajouter une tâche">
        <FormulaireAjout
          onAjouter={ajouterTache}
          disabled={chargement || Boolean(erreur)}
        />
      </Carte>
      <Carte titre="Ma liste">
        <button
          className="danger"
          disabled={chargement || Boolean(erreur) || terminees === 0}
          onClick={supprimerTerminees}
        >
          Supprimer les tâches terminées
        </button>
        {chargement ? (
          <p className="vide">Chargement des tâches…</p>
        ) : erreur ? (
          <p className="erreur">{erreur}</p>
        ) : (
          <ListeTaches
            taches={taches}
            onBasculer={basculerTache}
            onSupprimer={supprimerTache}
            onModifier={modifierTache}
          />
        )}
      </Carte>
      <Pied auteur={auteur} />
    </div>
  )
}

export default App
