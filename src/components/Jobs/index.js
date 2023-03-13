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
  noJobs: 'NO_JOBS',
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
    selectedEmploymentTypeList: [],
    selectedRange: '',
    searchedTitle: '',
  }

  componentDidMount() {
    this.getProfileData()
    this.getJobsData()
  }

  onClickRetryProfile = () => {
    this.getProfileData()
  }

  onClickRetryJobs = () => {
    this.getJobsData()
  }

  updateEmploymentType = typeSelected => {
    // console.log('In updateEmploymentType()')
    // console.log(typeSelected)
    this.setState(
      prevState => ({
        selectedEmploymentTypeList: [
          ...prevState.selectedEmploymentTypeList,
          typeSelected,
        ],
      }),
      this.getJobsData,
    )
  }

  updateSalaryRange = rangeSelected => {
    this.setState({selectedRange: rangeSelected}, this.getJobsData)
  }

  onChangeSearchInput = event => {
    this.setState({searchedTitle: event.target.value})
  }

  onClickSearchBtn = () => {
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

    const data = await response.json()

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
    const {
      selectedEmploymentTypeList,
      selectedRange,
      searchedTitle,
    } = this.state

    const stringifiedList = [...selectedEmploymentTypeList]
    this.setState({apiStatus: apiStatusConstants.loading})

    const jobsUrl = `https://apis.ccbp.in/jobs?employment_type=${stringifiedList}&minimum_package=${selectedRange}&search=${searchedTitle}`

    console.log(jobsUrl)
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(jobsUrl, options)

    const data = await response.json()

    if (response.ok && data.jobs.length > 0) {
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
    } else if (response.ok === true && data.jobs.length === 0) {
      this.setState({apiStatus: apiStatusConstants.noJobs})
    } else if (response.ok === false) {
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
    <div className="profile-failure-view-container">
      <button
        type="button"
        className="profile-retry-button"
        onClick={this.onClickRetryProfile}
      >
        Retry
      </button>
    </div>
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
      <ul className="job-cards-container">
        {jobsData.map(eachItem => (
          <JobCard cardDetails={eachItem} key={eachItem.id} />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-no-jobs-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="failure-no-jobs-view-img"
      />
      <h1 className="failure-no-jobs-view-heading">
        Oops! Something Went Wrong
      </h1>
      <p className="failure-no-jobs-view-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="failure-retry-btn"
        onClick={this.onClickRetryJobs}
      >
        Retry
      </button>
    </div>
  )

  renderNoJobsView = () => {
    console.log('In renderNoJobsView()')
    return (
      <div className="failure-no-jobs-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
          alt="no jobs"
          className="failure-no-jobs-view-img"
        />
        <h1 className="failure-no-jobs-view-heading">No Jobs Found</h1>
        <p className="failure-no-jobs-view-para">
          We could not find any jobs. Try other filters.
        </p>
      </div>
    )
  }

  renderJobsView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.loading:
        return this.renderLoadingView()
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.noJobs:
        return this.renderNoJobsView()
      default:
        return null
    }
  }

  render() {
    const {searchedTitle} = this.state

    return (
      <>
        <Header />

        <div className="jobs-container">
          <div className="search-box-container-small-devices">
            <input
              type="search"
              className="search-input-box"
              placeholder="Search"
              value={searchedTitle}
              onChange={this.onChangeSearchInput}
            />
            <button
              type="button"
              data-testid="searchButton"
              className="search-button"
              onClick={this.onClickSearchBtn}
            >
              <BsSearch className="search-icon" />
            </button>
          </div>
          <div className="profile-and-filters-container">
            {this.renderProfileView()}

            <hr className="seperator" />

            <h1 className="type-of-emp-sal-heading">Type of Employment</h1>
            <ul className="employment-sal-types-container">
              {employmentTypesList.map(eachItem => (
                <EmploymentType
                  typeDetails={eachItem}
                  updateEmploymentType={this.updateEmploymentType}
                  key={eachItem.employmentTypeId}
                />
              ))}
            </ul>

            <hr className="seperator" />

            <h1 className="type-of-emp-sal-heading">Salary Range</h1>
            <div className="employment-sal-types-container">
              {salaryRangesList.map(eachItem => (
                <SalaryRange
                  rangeDetails={eachItem}
                  updateSalaryRange={this.updateSalaryRange}
                  key={eachItem.salaryRangeId}
                />
              ))}
            </div>
          </div>
          <div className="search-and-job-cards-container">
            <div className="search-box-container-large-devices">
              <input
                type="search"
                className="search-input-box"
                placeholder="Search"
                value={searchedTitle}
                onChange={this.onChangeSearchInput}
              />
              <button
                type="button"
                data-testid="searchButton"
                className="search-button"
                onClick={this.onClickSearchBtn}
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobsView()}
          </div>
        </div>
      </>
    )
  }
}

const EmploymentType = props => {
  const {typeDetails, updateEmploymentType} = props
  const {employmentTypeId, label} = typeDetails

  const onClickCheckbox = event => {
    updateEmploymentType(event.target.value)
  }
  return (
    <div className="employment-type-container">
      <input
        type="checkbox"
        id={employmentTypeId}
        value={employmentTypeId}
        onClick={onClickCheckbox}
        className="employment-checkbox"
      />
      <label htmlFor={employmentTypeId} className="label">
        {label}
      </label>
    </div>
  )
}

const SalaryRange = props => {
  const {rangeDetails, updateSalaryRange} = props
  const {salaryRangeId, label} = rangeDetails

  const onClickRadio = event => {
    updateSalaryRange(event.target.value)
  }

  return (
    <div className="salary-range-container">
      <input
        type="radio"
        id={salaryRangeId}
        value={salaryRangeId}
        onClick={onClickRadio}
        name="radio"
        className="salary-radio-icon"
      />
      <label htmlFor={salaryRangeId} className="label">
        {label}
      </label>
    </div>
  )
}

export default Jobs
