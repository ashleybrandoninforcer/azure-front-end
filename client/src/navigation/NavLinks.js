import {Link, NavLink} from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { icon } from '@fortawesome/fontawesome-svg-core/import.macro'


const NavLinks = () => {
  return (
    <>
        <ul>
            <li>
                <NavLink to="/"><FontAwesomeIcon icon={icon({name: 'house'})} /> Home</NavLink>
            </li>
            <li>
                <NavLink to="/backup"><FontAwesomeIcon icon={icon({name: 'Server'})} /> Back Up</NavLink>
            </li>
            <li>
                <NavLink to="/restore"><FontAwesomeIcon icon={icon({name: 'calendar-days'})} /> Restore</NavLink>
            </li>
            <li>
                <NavLink to="/deploy"><FontAwesomeIcon icon={icon({name: 'cloud-arrow-up'})} /> Deploy</NavLink>
            </li>
        </ul>
    </>
  )
}

export default NavLinks
