import React, { useContext, useEffect, useState } from 'react'
import firebase from './firebase'

const githubProvider = new firebase.auth.GithubAuthProvider()
const authContext = React.createContext<ReturnType<typeof useProvideAuth>>(null)

export function ProvideAuth({ children }) {
  const auth = useProvideAuth()
  return <authContext.Provider value={auth}>{children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}

function useProvideAuth() {
  const [user, setUser] = useState<firebase.User>(null)

  const signinWithGithub = async () => {
    const resp = await firebase.auth().signInWithPopup(githubProvider)
    setUser(resp.user)
    return resp.user
  }

  const signout = async () => {
    await firebase.auth().signOut()
    setUser(null)
  }

  useEffect(() => {
    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setUser(user)
      } else {
        setUser(null)
      }
    })

    return () => unsubscribe()
  }, [])

  return {
    user,
    signinWithGithub,
    signout,
  }
}
