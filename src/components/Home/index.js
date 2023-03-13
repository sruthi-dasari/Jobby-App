import './index.css'

import {Link} from 'react-router-dom'

import Header from '../Header'

const Home = () => (
  //   const onClickFindJobs = () => {
  //     const {history} = props
  //     history.replace('/jobs')
  //   }

  <>
    <Header />
    <div className="home-container">
      <h1 className="home-heading">Find The Job That Fits Your Life</h1>
      <p className="home-para">
        Millions of people are searching for jobs, salary information, company
        reviews. Find the job that fits your abilities and potential.
      </p>
      <Link to="/jobs">
        <button type="button" className="home-btn">
          Find Jobs
        </button>
      </Link>
    </div>
  </>
)

export default Home
