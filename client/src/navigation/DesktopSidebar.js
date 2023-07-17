import NavLinks from './NavLinks'
import logo from '../assets/inforcer-logo.png'

const DesktopSidebar = () => {
  return (
    <nav className="desktop-sidebar">
        <img src={logo} className="inforcer-logo" alt="Inforcer Logo" />
        <NavLinks />
    </nav>

  )
}

export default DesktopSidebar