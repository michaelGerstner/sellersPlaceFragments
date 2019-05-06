import React, { Component } from "react";
import * as eventsServices from "../../../../services/eventServices";
import * as venuesService from "../../../../services/venuesService";
import * as urlsService from "../../../../services/urlsService";
import logger from "../../../../logger.js";
import ProfileInfo from "../ProfileInfo";
import NavBarNew from "../NavBarNew";
import Styles from "../ProfilesPublic.module.css";
import EventList from "../events/EventList";
import EventStyles from "../Promoter.module.css";
import EventHeader from "../ProfilesPublic.module.css";
import Footer from "../Footer";
import PropTypes from "prop-types";
import PromoterVenuesContainer from "./PromoterVenuesContainer";
import { Helmet } from "react-helmet";

const _logger = logger.extend("PromoterFacing");

class PromoterFacing extends Component {
  state = {
    promoter: {
      businessUrl: "",
      id: "",
      imageUrl: "",
      name: "",
      shortDescription: ""
    },
    eventsList: [],
    venuesArray: [],
    urls: {
      facebook: null,
      instagram: null,
      twitter: null
    }
  };

  populateProfile = data => {
    _logger(data);
    let promoter = data.item;
    let eventsList = null;

    if (promoter.events && promoter.events.pagedItems) {
      eventsList = promoter.events.pagedItems;
    } else {
      eventsList = [];
    }
    this.setState({ promoter, eventsList });
  };
  axiosSuccess = data => {
    _logger(data, "good work");
    this.setState({ eventsList: data.item.pagedItems });
  };

  handleViewClick = e => {
    _logger(e);
    this.props.history.push("/events/" + e.target.id);
  };

  componentDidMount() {
    this.getLinks();
    eventsServices
      .getByPromoterId(this.props.match.params.id, 0, 3)
      .then(this.populateProfile)
      .catch(this.axiosError);
    venuesService
      .venuesByPromoterUse(this.props.match.params.id, 0, 3)
      .then(this.venuesSuccess)
      .catch(this.axiosError);
  }
  getLinks = () => {
    let payload = {
      id: this.props.match.params.id,
      entitytypeid: 4
    };
    _logger(payload);

    urlsService
      .getByEntityIdType(payload)
      .then(this.urlsSuccess)
      .catch(() => _logger("error"));
  };

  urlsSuccess = data => {
    let urlsData = data.item;
    let urls = { ...this.urls };
    for (let i = 0; i < urlsData.length; i++) {
      if (urlsData[i].urlType === "Facebook") {
        urls.facebook = urlsData[i].url;
      } else if (urlsData[i].urlType === "Twitter") {
        urls.twitter = urlsData[i].url;
      } else if (urlsData[i].urlType === "Instagram") {
        urls.instagram = urlsData[i].url;
      }
    }
    this.setState({
      urls
    });
  };

  venuesSuccess = data => {
    this.setState({ venuesArray: data.item.pagedItems });
  };

  axiosError = data => _logger(data.item);
  render() {
    return (
      <div className={Styles.containing}>
        <NavBarNew {...this.props} />
        <Helmet>
          <title>Seller&apos;s Place Events Los Angeles</title>
        </Helmet>
        <div>
          <div>
            {this.state.promoter.id > 0 && this.state.promoter.imageUrl && (
              <ProfileInfo
                profileImage={"url(" + this.state.promoter.imageUrl}
                name={this.state.promoter.shortDescription}
                text={this.state.promoter.name}
                link={this.state.promoter.businessUrl}
                urls={this.state.urls}
              />
            )}
            {this.state.promoter.id > 0 && !this.state.promoter.imageUrl && (
              <ProfileInfo
                name={this.state.promoter.shortDescription}
                text={this.state.promoter.name}
                link={this.state.promoter.businessUrl}
              />
            )}
            <div
              className={EventHeader.itemsHeader}
              style={{ backgroundColor: "white" }}
            >
              <strong className={EventHeader.title}>Upcoming Events</strong>{" "}
              <br />
              {this.state.eventsList.length === 0 && (
                <em>Currently no upcoming events</em>
              )}
              <p className={EventHeader.bodyText} />
            </div>
            <div className={EventStyles.container}>
              {this.state.eventsList.length > 0 && (
                <div>
                  <EventList
                    eventsArray={this.state.eventsList}
                    history={this.props.history}
                    handleViewClick={this.handleViewClick}
                  />
                </div>
              )}
            </div>
            <div
              className={EventHeader.itemsHeader}
              style={{ backgroundColor: "white" }}
            >
              <strong className={EventHeader.title}>Top Venues</strong>
              <br />
              {this.state.venuesArray.length === 0 && (
                <em>Currently no top venues</em>
              )}
              <p className={EventHeader.bodyText} />
            </div>
            <div className={EventStyles.container}>
              {this.state.venuesArray.length > 0 && (
                <PromoterVenuesContainer
                  venuesArray={this.state.venuesArray}
                  history={this.props.history}
                />
              )}
            </div>
            <Footer />
          </div>
        </div>
      </div>
    );
  }
}

PromoterFacing.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({ id: PropTypes.string.isRequired })
  }),
  history: PropTypes.any
};

export default PromoterFacing;
