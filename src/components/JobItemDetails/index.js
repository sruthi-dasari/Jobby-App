import './index.css'

import {Component} from 'react'

import Cookies from 'js-cookie'

class JobItemDetails extends Component {
  state = {
    jobItemData: [],
  }

  componentDidMount() {
    this.getJobItemData()
  }

  getJobItemData = async () => {
    const {jwtToken} = Cookies.get('jwt_token')
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
    console.log(response)
  }

  render() {
    return (
      <div className="job-item-details-container">
        <p>hello</p>
        {/* <div className="job-item-detail-container">
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
        </div> */}
      </div>
    )
  }
}

export default JobItemDetails
