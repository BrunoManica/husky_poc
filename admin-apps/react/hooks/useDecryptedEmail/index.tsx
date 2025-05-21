import { useState, useEffect } from 'react'
import axios from 'axios'

function useDecryptedEmail() {
  const decryptEmail = (userProfileId: string, encryptedEmail: string): string => {
    const [email, setEmail] = useState<string>('')

    useEffect(() => {
      axios
        .get(`/api/dataentities/CL/search?_fields=_all&_where=userId=${userProfileId}`)
        .then(response => {
          setEmail(response.data[0].email)
        })
        .catch(() => {
          setEmail(encryptedEmail)
        })
    }, [])

    return email
  }

  return [decryptEmail]
}

export default useDecryptedEmail
