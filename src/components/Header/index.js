import './index.css'

import {Link} from 'react-router-dom'

import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

const Header = () => (
  <div className="header-container">
    <Link to="/">
      <img
        src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
        alt="website logo"
        className="header-website-logo"
      />
    </Link>

    <div className="icons-container">
      <Link to="/">
        <AiFillHome className="icon" />
      </Link>
      <Link to="/jobs">
        <BsFillBriefcaseFill className="icon" />
      </Link>
      <Link to="/login">
        <FiLogOut className="icon" />
      </Link>
    </div>
  </div>
)

export default Header
