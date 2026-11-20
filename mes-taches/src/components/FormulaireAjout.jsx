import { useState } from 'react'

function FormulaireAjout({ onAjouter, disabled = false }) {
  const [titre, setTitre] = useState('')

  function gererSoumission(event) {
    event.preventDefault()
    const titreNettoye = titre.trim()

    if (disabled || titreNettoye === '') return

    onAjouter(titreNettoye)
    setTitre('')
  }

  return (
    <form className="formulaire" onSubmit={gererSoumission}>
      <input
        type="text"
        disabled={disabled}
        value={titre}
        onChange={(event) => setTitre(event.target.value)}
        placeholder="Ex. : Réviser les hooks"
        aria-label="Titre de la nouvelle tâche"
      />
      <button type="submit" className="principal" disabled={disabled || titre.trim() === ''}>
        Ajouter
      </button>
    </form>
  )
}

export default FormulaireAjout
