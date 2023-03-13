import './index.css'

import {Component} from 'react'

import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import {BsFillBriefcaseFill} from 'react-icons/bs'
import {GoLinkExternal} from 'react-icons/go'

import Loader from 'react-loader-spinner'

import Cookies from 'js-cookie'

import Header from '../Header'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  loading: 'IN_PROGRESS',
}

class JobItemDetails extends Component {
  state = {
    jobItemData: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getJobItemData()
  }

  onClickRetryJobDetails = () => {
    this.getJobItemData()
  }

  getJobItemData = async () => {
    this.setState({apiStatus: apiStatusConstants.loading})
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/jobs/${id}`, options)
    // console.log(response)
    const data = await response.json()
    console.log(data)
    // data.job_details.map(eachItem => console.log(eachItem))

    const updatedSkills = eachItem => ({
      imageUrl: eachItem.image_url,
      name: eachItem.name,
    })

    const updatedLifeAtCompany = eachItem => ({
      description: eachItem.description,
      imageUrl: eachItem.image_url,
    })

    const updatedSimilarJobs = eachItem => ({
      companyLogoUrl: eachItem.company_logo_url,
      employmentType: eachItem.employment_type,
      id: eachItem.id,
      jobDescription: eachItem.job_description,
      location: eachItem.location,
      rating: eachItem.rating,
      title: eachItem.title,
    })

    const formattedJobDetails = eachItem => ({
      companyLogoUrl: eachItem.company_logo_url,
      companyWebsiteUrl: eachItem.company_website_url,
      employmentType: eachItem.employment_type,
      id: eachItem.id,
      jobDescription: eachItem.job_description,
      skills: eachItem.skills.map(eachItm => updatedSkills(eachItm)),
      lifeAtCompany: updatedLifeAtCompany(eachItem.life_at_company),
      location: eachItem.location,
      packagePerAnnum: eachItem.package_per_annum,
      rating: eachItem.rating,
      title: eachItem.title,
    })

    if (response.ok) {
      const updatedData = {
        jobDetails: formattedJobDetails(data.job_details),
        similarJobs: data.similar_jobs.map(eachItem =>
          updatedSimilarJobs(eachItem),
        ),
      }

      this.setState({
        jobItemData: updatedData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {jobItemData} = this.state

    const {jobDetails, similarJobs} = jobItemData
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      title,
      rating,
      location,
      employmentType,
      packagePerAnnum,
      jobDescription,
      skills,
      lifeAtCompany,
    } = jobDetails

    const {description, imageUrl} = lifeAtCompany
    return (
      <div className="job-detail-success-view-container">
        <div className="job-detail-container">
          <div className="job-detail-logo-title-rating-container">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
              className="job-detail-company-logo"
            />
            <div className="job-detail-title-rating-container">
              <h1 className="job-detail-title-text">{title}</h1>
              <div className="job-detail-rating-container">
                <AiFillStar className="job-detail-star-icon" />
                <p className="job-detail-rating-text">{rating}</p>
              </div>
            </div>
          </div>
          <div className="job-detail-location-type-package-container">
            <div className="job-detail-location-type-container">
              <div className="job-detail-location-type-inner-container">
                <HiLocationMarker className="job-detail-location-icon" />
                <p className="job-detail-location-employment-text">
                  {location}
                </p>
              </div>
              <div className="job-detail-location-type-inner-container">
                <BsFillBriefcaseFill className="job-detail-location-icon" />
                <p className="job-detail-location-employment-text">
                  {employmentType}
                </p>
              </div>
            </div>
            <p className="job-detail-package-text">{packagePerAnnum}</p>
          </div>
          <hr className="seperator" />
          <div className="job-desc-link-container">
            <h1 className="job-detail-description-title">Description</h1>
            <button type="button" className="visit-btn">
              <a
                href={companyWebsiteUrl}
                target="_blank"
                rel="noreferrer"
                className="visit-link"
              >
                <p className="visit-text">Visit</p>
                <GoLinkExternal className="link-icon" />
              </a>
            </button>
          </div>
          <p className="job-detail-description">{jobDescription}</p>
          <h1 className="job-detail-skills-title">Skills</h1>
          <ul className="skills-container">
            {skills.map(eachItem => (
              <Skill skillDetail={eachItem} key={eachItem.name} />
            ))}
          </ul>
          <h1 className="life-at-company-title">Life at Company</h1>
          <div className="life-at-comp-para-img-container">
            <p className="life-at-company-desc">{description}</p>
            <img
              src={imageUrl}
              alt="life at company"
              className="life-at-company-img"
            />
          </div>
        </div>
        <h1 className="similar-jobs-title">Similar Jobs</h1>
        <ul className="similar-jobs-container">
          {similarJobs.map(eachItem => (
            <SimilarJobs jobDetail={eachItem} key={eachItem.id} />
          ))}
        </ul>
      </div>
    )
  }

  renderFailureView = () => (
    <div className="job-detail-failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="job-detail-failure-view-img"
      />
      <h1 className="job-detail-failure-view-heading">
        Oops! Something Went Wrong
      </h1>
      <p className="job-detail-failure-view-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="job-detail-failure-retry-btn"
        onClick={this.onClickRetryJobDetails}
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

  renderViewContainer = () => {
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

        {this.renderViewContainer()}
      </>
    )
  }
}

export default JobItemDetails

const SimilarJobs = props => {
  const {jobDetail} = props
  const {
    companyLogoUrl,
    employmentType,
    title,
    rating,
    location,
    packagePerAnnum,
    jobDescription,
  } = jobDetail

  return (
    <li className="similar-job-container">
      <div className="similar-job-logo-title-rating-container">
        <img
          src={companyLogoUrl}
          alt="similar job company logo"
          className="similar-job-company-logo"
        />
        <div className="similar-job-title-rating-container">
          <h1 className="similar-job-title-text">{title}</h1>
          <div className="similar-job-rating-container">
            <AiFillStar className="similar-job-star-icon" />
            <p className="similar-job-rating-text">{rating}</p>
          </div>
        </div>
      </div>
      <h1 className="similar-job-description-title">Description</h1>
      <p className="similar-job-description">{jobDescription}</p>
      <div className="similar-job-location-type-package-container">
        <div className="similar-job-location-type-container">
          <div className="similar-job-location-type-inner-container">
            <HiLocationMarker className="similar-job-location-icon" />
            <p className="similar-job-location-employment-text">{location}</p>
          </div>
          <div className="similar-job-location-type-inner-container">
            <BsFillBriefcaseFill className="similar-job-location-icon" />
            <p className="similar-job-location-employment-text">
              {employmentType}
            </p>
          </div>
        </div>
        <p className="similar-job-package-text">{packagePerAnnum}</p>
      </div>
    </li>
  )
}

const Skill = props => {
  const {skillDetail} = props
  const {imageUrl, name} = skillDetail

  return (
    <li className="skill-container">
      <img src={imageUrl} alt={name} className="skill-img" />
      <p className="skill-name">{name}</p>
    </li>
  )
}
