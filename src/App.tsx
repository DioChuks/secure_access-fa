import { useState, useEffect } from 'react'
import './App.css'
import Account from './components/Account'
import Loader from './components/Loader'

function App() {
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    if (!authorized) {
      setTimeout(() => {
        setAuthorized(!authorized);
      }, 3000);
    }
  }, [authorized])

  return (
    <>
      {authorized ? (
        <Account isTriggered={authorized}/>
      ):(
        <Loader />
      )}
    </>
  )
}

export default App
