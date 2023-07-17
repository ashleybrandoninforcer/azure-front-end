import {Link, useLocation} from 'react-router-dom'
// import logo from '../assets/inforcer-logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'
import { useState } from 'react'
import HeaderNavLinks from './HeaderNavLinks'

const Header = ({handleLogout}) => {

  const [open, setOpen] = useState(false)

  // const location = useLocation();

  const handleClick = () => {
    setOpen(!open)
    document.body.classList.toggle('mobile-menu')
  
  }

  const openIcon = <FontAwesomeIcon icon={icon({name: 'bars'})} onClick={handleClick} />
  const closeIcon =  <FontAwesomeIcon icon={icon({name: 'xmark'})} onClick={handleClick} />

  return (
    <header>
        {/* <img src={logo} className="inforcer-logo" alt="Inforcer Logo" /> */}

        <div className="header-nav">
          {/* <HeaderNavLinks handleLogout={handleLogout} /> */}
          <ul className="header-nav-list">
            <li><button onClick={handleLogout}>Logout</button></li>
          </ul>
          {open ? closeIcon : openIcon}
        </div>
    </header>
  )
}

export default Header