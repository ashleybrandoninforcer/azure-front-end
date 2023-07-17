import { useState, useContext, useEffect } from 'react'
import Axios from 'axios'
import { GlobalContext } from '../contexts/GlobalContext'
import { Link, useNavigate } from 'react-router-dom'

import logo from '../assets/inforcer-logo.png'

const Login = () => {
  const { setLoadApp, loadingState, setLoadingState } = useContext(GlobalContext)
  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [authCode, setAuthCode] = useState('')
  const [loginStatus, setLoginStatus] = useState('')

  Axios.defaults.withCredentials = true

  const handleLogin = async () => {
    try {
      setLoadingState(true)
      
      const response = await Axios.post('http://localhost:4040/login', {
        username: username,
        password: password,
        authCode: authCode
      })

      if (response.data.authenticated === true) {
        setLoginStatus([response.data.displayName, ' ', response.data.message])
        setLoadApp(true)
        navigate('/')
      } else {
        setLoginStatus(response.data.message)

        // Handle incorrect login details or display error message
      }
    } catch (error) {
      console.error(error)
      // Handle the error
    } finally {
      setLoadingState(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-box text-center">

        <h3>{loginStatus}</h3>
        <img src={logo} className="inforcer-logo" alt="Inforcer Logo" />

        {loadingState ? (
          <div id="loading-spinner">
              <div className="loading"></div>
          </div>
          ) : ( 

          <div className="login-box-inner">
            <input 
            type="text"
            placeholder="Username"
            className="flex rounded-md border p-2 border-gray-400 bg-white text-gray-700 my-[20px] focus:outline-blue-400"
            onChange={(e) => {
                setUsername(e.target.value)
            }} />
            <input 
            type="Password" 
            className="flex rounded-md border p-2 border-gray-400 bg-white text-gray-700 my-[20px] focus:outline-blue-400" 
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value)
            }} />
            <input 
            autoComplete="true" 
            spellCheck="false" 
            className="flex rounded-md border p-2 border-gray-400 bg-white text-gray-700 my-[20px] focus:outline-blue-400" 
            placeholder="Authenticator code"
            onChange={(e) => {
              setAuthCode(e.target.value)
            }} />

          <button
          className="btn cyan-btn"
          onClick={handleLogin}>Login</button>
          </div>

           )}

      </div>
    </div>

  )
}

export default Login