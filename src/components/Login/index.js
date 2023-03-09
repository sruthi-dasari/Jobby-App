import './index.css'
import {Component} from 'react'

import Cookies from 'js-cookie'

// import {Redirect} from 'react-router-dom'

class Login extends Component {
  state = {
    username: '',
    password: '',
    showSubmitError: false,
    errorMsg: '',
  }

  onChangeUsername = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmitSuccess = jwtToken => {
    const {history} = this.props

    Cookies.set('jwt_token', jwtToken, {
      expires: 30,
      path: '/',
    })

    history.replace('/')
  }

  onSubmitFailure = errorMsg => {
    this.setState({showSubmitError: true, errorMsg})
  }

  onSubmitForm = async () => {
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = response.json()

    console.log(data)
    if (response.ok === true) {
      this.onSubmitSuccess(data.jwt_token)
    } else {
      this.onSubmitFailure(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errorMsg} = this.state

    // const jwtToken = Cookies.get('jwt_token')
    // if (jwtToken !== undefined) {
    //   return <Redirect to="/" />
    // }
    return (
      <div className="login-container">
        <div className="login-inner-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="website-logo"
          />
          <form onSubmit={this.onSubmitForm}>
            <label htmlFor="username" className="label-text">
              USERNAME
            </label>
            <div className="input-container">
              <input
                type="text"
                value={username}
                className="input-text-box"
                id="username"
                placeholder="Username"
                onChange={this.onChangeUsername}
              />
            </div>

            <label htmlFor="password" className="label-text">
              PASSWORD
            </label>
            <div className="input-container">
              <input
                type="password"
                value={password}
                className="input-text-box"
                id="password"
                placeholder="Password"
                onChange={this.onChangePassword}
              />
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
            {showSubmitError && (
              <p className="credentials-error-text">*{errorMsg}</p>
            )}
          </form>
        </div>
      </div>
    )
  }
}
export default Login
