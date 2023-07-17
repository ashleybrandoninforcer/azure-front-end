import NavLinks from "./NavLinks"
import HeaderNavLinks from "./HeaderNavLinks"

const MobileSidebar = () => {
    return (
        <nav className="mobile-sidebar">
            <HeaderNavLinks />
            <NavLinks />
        </nav>
      )
}

export default MobileSidebar