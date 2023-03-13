import './index.css'

import Cookies from 'js-cookie'

import {Link, withRouter} from 'react-router-dom'

import {AiFillHome} from 'react-icons/ai'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

const Header = props => {
  const onClickLogout = () => {
    const {history} = props
    Cookies.remove('jwt_token')
    history.replace('/login')
  }

  return (
    <>
      <div className="header-container">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="header-website-logo"
          />
        </Link>

        <ul className="icons-container">
          <Link to="/">
            <li>
              <AiFillHome className="icon" />
            </li>
          </Link>
          <Link to="/jobs">
            <li>
              <BsFillBriefcaseFill className="icon" />
            </li>
          </Link>
          <button type="button" onClick={onClickLogout} className="logout-btn">
            <li>
              <FiLogOut className="icon" />
            </li>
          </button>
        </ul>
      </div>
      <div className="header-container-large-devices">
        <Link to="/">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="header-website-logo-large-devices"
          />
        </Link>
        <ul className="icons-container-large-devices">
          <Link to="/" className="home-jobs-link-large-devices">
            <li className="home-jobs-list-item-large-devices">Home</li>
          </Link>
          <Link to="/jobs" className="home-jobs-link-large-devices">
            <li className="home-jobs-list-item-large-devices">Jobs</li>
          </Link>
        </ul>
        <button
          type="button"
          onClick={onClickLogout}
          className="logout-btn-large-devices"
        >
          Logout
        </button>
      </div>
    </>
  )
}

export default withRouter(Header)
