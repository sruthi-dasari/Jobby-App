import './index.css'

import {Redirect} from 'react-router-dom'

import Header from '../Header'

const Home = () => {
  const onClickFindJobs = () => <Redirect to="/jobs" />
  return (
    <>
      <Header />
      <div className="home-container">
        <h1 className="home-heading">Find The Job That Fits Your Life</h1>
        <p className="home-para">
          Millions of people are searching for jobs, salary information, company
          reviews. Find the job that fits your abilities and potential.
        </p>
        <button type="button" className="home-btn" onClick={onClickFindJobs}>
          Find Jobs
        </button>
      </div>
    </>
  )
}

export default Home
