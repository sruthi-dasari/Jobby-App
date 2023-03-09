import './index.css'

import {AiFillStar} from 'react-icons/ai'
import {HiLocationMarker} from 'react-icons/hi'
import {BsFillBriefcaseFill} from 'react-icons/bs'

import {Link} from 'react-router-dom'

const JobCard = props => {
  const {cardDetails} = props
  const {
    id,
    companyLogoUrl,
    employmentType,
    jobDescription,
    location,
    packagePerAnnum,
    rating,
    title,
  } = cardDetails

  return (
    <Link to={`/jobs/${id}`}>
      <div className="job-card-container">
        <div className="job-logo-title-rating-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-rating-container">
            <h1 className="title-text">{title}</h1>
            <div className="rating-container">
              <AiFillStar className="star-icon" />
              <p className="rating-text">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-type-package-container">
          <div className="location-type-container">
            <div className="location-type-inner-container">
              <HiLocationMarker className="location-job-icon" />
              <p className="location-employment-text">{location}</p>
            </div>
            <div className="location-type-inner-container">
              <BsFillBriefcaseFill className="location-job-icon" />
              <p className="location-employment-text">{employmentType}</p>
            </div>
          </div>
          <p className="package-text">{packagePerAnnum}</p>
        </div>
        <hr className="seperator" />
        <p className="description-title">Description</p>
        <p className="job-description">{jobDescription}</p>
      </div>
    </Link>
  )
}

export default JobCard
