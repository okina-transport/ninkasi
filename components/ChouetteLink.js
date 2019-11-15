import React from 'react'

const ChouetteLink = ({ action, id, referential, children }) => {

  const baseURL = `${window.config.chouetteBaseUrl}/#/`
  const actionMap = {
    "importer": `e-iti/imports/${referential}/${id}`,
    "exporter": `open-iti/exports/${referential}/${id}`,
    "validator": `e-iti/imports/${referential}/${id}`
  }
  const URL = `${baseURL}/${actionMap[action]}`

  return (
    <a title={URL} target="_blank" href={URL}>{children}</a>
  )

}

export default ChouetteLink

