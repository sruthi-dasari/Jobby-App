import './index.css'

import Cookies from 'js-cookie'

import Loader from 'react-loader-spinner'

import {BsSearch} from 'react-icons/bs'

import {Component} from 'react'
import Header from '../Header'
import JobCard from '../JobCard'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const apiStatusConstants = {
  initial: 'INITIAL',
  loading: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

const profileStatusConstants = {
  initial: 'INITIAL',
  loading: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    profileStatus: profileStatusConstants.initial,
    profileData: [],
    jobsData: [],
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  getProfileData = async () => {
    this.setState({profileStatus: profileStatusConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const url = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(url, options)
    // console.log(response)
    const data = await response.json()

    // console.log(data.profile_details)

    if (response.ok) {
      const updatedData = {
        name: data.profile_details.name,
        profileImageUrl: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }

      this.setState({
        profileData: updatedData,
        profileStatus: profileStatusConstants.success,
      })
    } else {
      this.setState({
        profileStatus: profileStatusConstants.failure,
      })
    }
  }

  getJobsData = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})

    const jobsUrl = 'https://apis.ccbp.in/jobs'
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsUrl, options)
    // console.log(response)
    const data = await response.json()

    // console.log(data)

    if (response.ok) {
      const formattedData = data.jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        jobsData: formattedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderProfileSuccessView = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-container">
        <img src={profileImageUrl} alt="profile" className="profile-img" />

        <h1 className="profile-name">{name}</h1>
        <p className="profile-bio">{shortBio}</p>
      </div>
    )
  }

  renderProfileFailureView = () => (
    <button type="button" className="retry-button">
      Retry
    </button>
  )

  renderLoadingView = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileView = () => {
    const {profileStatus} = this.state

    switch (profileStatus) {
      case profileStatusConstants.loading:
        return this.renderLoadingView()
      case profileStatusConstants.success:
        return this.renderProfileSuccessView()
      case profileStatusConstants.failure:
        return this.renderProfileFailureView()
      default:
        return null
    }
  }

  renderSuccessView = () => {
    const {jobsData} = this.state

    return (
      <div className="job-cards-container">
        {jobsData.map(eachItem => (
          <JobCard cardDetails={eachItem} key={eachItem.id} />
        ))}
      </div>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-view-img"
      />
      <h1 className="failure-view-heading">Oops! Something Went Wrong</h1>
      <p className="failure-view-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="failure-retry-btn">
        Retry
      </button>
    </div>
  )

  renderJobsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="jobs-container">
          <form>
            <div className="search-box-container">
              <input
                type="search"
                className="search-input-box"
                placeholder="Search"
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
          </form>
          {this.renderProfileView()}

          <hr className="seperator" />

          <h1 className="type-of-emp-heading">Type of Employment</h1>
          <div className="employment-types-container">
            {employmentTypesList.map(eachItem => (
              <EmploymentType
                typeDetails={eachItem}
                key={eachItem.employmentTypeId}
              />
            ))}
          </div>

          <hr className="seperator" />

          <h1 className="type-of-emp-heading">Salary Range</h1>
          <div className="employment-types-container">
            {salaryRangesList.map(eachItem => (
              <SalaryRange
                rangeDetails={eachItem}
                key={eachItem.salaryRangeId}
              />
            ))}
          </div>

          {this.renderJobsView()}
        </div>
      </>
    )
  }
}

const EmploymentType = props => {
  const {typeDetails} = props
  const {employmentTypeId, label} = typeDetails
  return (
    <div className="employment-type-container">
      <input type="checkbox" id={employmentTypeId} />
      <label htmlFor={employmentTypeId} className="label">
        {label}
      </label>
    </div>
  )
}

const SalaryRange = props => {
  const {rangeDetails} = props
  const {salaryRangeId, label} = rangeDetails
  return (
    <div className="salary-range-container">
      <input type="radio" id={salaryRangeId} />
      <label htmlFor={salaryRangeId} className="label">
        {label}
      </label>
    </div>
  )
}

export default Jobs
