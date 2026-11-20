import { useState } from 'react'

function Tache({ id, titre, terminee, onBasculer, onSupprimer, onModifier }) {
  const [edition, setEdition] = useState(false)
  const [brouillon, setBrouillon] = useState(titre)

  function commencerModification() {
    setBrouillon(titre)
    setEdition(true)
  }

  function enregistrerModification() {
    if (brouillon.trim() !== '') onModifier(id, brouillon.trim())
    setEdition(false)
  }

  return (
    <li className={terminee ? "tache terminee" : "tache"}>
      <input
        type="checkbox"
        checked={terminee}
        onChange={() => onBasculer(id)}
        aria-label={titre}
      />
      {edition ? (
        <input
          type="text"
          value={brouillon}
          onChange={(event) => setBrouillon(event.target.value)}
          onBlur={enregistrerModification}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              event.currentTarget.blur()
            } else if (event.key === 'Escape') {
              event.preventDefault()
              setEdition(false)
            }
          }}
          aria-label="Modifier le titre de la tâche"
          autoFocus
        />
      ) : (
        <span
          className="titre"
          onDoubleClick={commencerModification}
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'Enter') commencerModification()
          }}
          title="Double-cliquez ou appuyez sur Entrée pour modifier"
        >
          {titre}
        </span>
      )}
      <button className="danger" onClick={() => onSupprimer(id)}>
        Supprimer
      </button>
    </li>
  );
}

export default Tache;
