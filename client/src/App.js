import { useState, useEffect } from 'react'
//Navigation
import Header from './navigation/Header'
import DesktopSidebar from './navigation/DesktopSidebar'
import MobileSidebar from './navigation/MobileSidebar'

//Styles
import './App.css'
import Login from './journeys/Login'
import { GlobalContext } from './contexts/GlobalContext'

import {BrowserRouter as Router, Route, Link, Routes, useNavigate} from 'react-router-dom'
//Components
import Welcome from './components/Welcome'
import Backup from './journeys/Backup'
import Restore from './journeys/Restore'
import Deploy from './journeys/Deploy'


import Axios from 'axios'


const App = () => {

const [loadApp, setLoadApp] = useState(false)
const [loadingState, setLoadingState] = useState(false)
const [username, setUsername] = useState('')

const navigate = useNavigate()

const handleLogout = async () => {
  try {
    const response = await Axios.post('http://localhost:4040/logout', {}, { withCredentials: true });
    navigate('/login');
    setLoadApp(false);
  } catch (error) {
    console.error('Error:', error);
  }
};



const persistLogin = async () => {
  try {
    const response = await Axios.get('http://localhost:4040/login')
    if (response.data.loggedIn === true) {
      setLoadApp(true)
    }
  } catch (error) {
    console.error('Error:', error)
  }
};

useEffect(() => {
persistLogin()
}, [])

  return (
    <>
    <GlobalContext.Provider value={{ username, setUsername, setLoadApp, loadingState, setLoadingState }}>
    {loadApp ? 
      <div className="app">
          <DesktopSidebar />
          <MobileSidebar />
        <div className="body-container">
        <Header handleLogout={handleLogout} />
          <main>
              <Routes>
                  <Route exact path="/" element={<Welcome />} />
                  <Route exact path="/backup" element={<Backup />} />
                  <Route exact path="/restore" element={<Restore />} />
                  <Route exact path="/deploy" element={<Deploy />} />
              </Routes>
        </main>
        </div>
      </div>
    
    : <Login />}
    </GlobalContext.Provider>
    </>
  )
}


export default App
