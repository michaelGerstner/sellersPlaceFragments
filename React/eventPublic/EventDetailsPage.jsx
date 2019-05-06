import React, { Component } from "react";
import * as eventService from "../../../../services/eventServices";
import * as vendorService from "../../../../services/vendorsService";
import logger from "../../../../logger";
import NavBarNew from "../NavBarNew";
import Cover from "../Cover";
import Footer from "../Footer";
import PromoterStyles from "../Promotion.module.css";
import Helmet from "react-helmet";
import PropTypes from "prop-types";
import EventCoverDetails from "./EventCoverDetails";
import WideCol from "../WideCol";
import EventOfferings from "./EventOfferings";
import ImageCollage from "./ImageCollage";
import VendorCard from "./VendorCard";
import LocationCard from "./LocationCard";

const _logger = logger.extend("mike");

//This page is supposed to replicate the Url below
// https://www.springmarketla.com/
//currently a fragment. Pushing up incase need for work delegation.
class EventDetails extends Component {
  state = {
    vendorsArray: [],
    event: {},
    formatting: {},
    images: [],
    location: [],
    venue: [],
    backgroundImage:
      "url(https://sabio-s3.s3.us-west-2.amazonaws.com/sellersplace/469b748a-cfaf-4d04-9369-45203fcf4e2d_Bg_Venue_Owners.jpg)",
    loaded: false
  };
  componentDidMount() {
    eventService
      .getDetails(this.props.match.params.id)
      .then(this.makeCover)
      .then(this.getVendors)
      .catch(this.axiosError);
  }

  makeCover = data => {
    _logger(data);
    let backgroundImage = "";
    if (data.item.primaryImage) {
      backgroundImage = "url(" + data.item.primaryImage.url + ")";
      backgroundImage = backgroundImage.split(" ").join("%20");
      debugger;
    }
    const formatting = {
      coverTitle: <EventCoverDetails eventDetails={data.item.event} />,
      eventOfferings: (
        <EventOfferings
          offerings={data.item.offerings}
          isFree={data.item.event.isFree}
          description={data.item.event.description}
          vendorView={this.vendorView}
          currentUser={this.props.currentUser}
        />
      )
    };
    this.setState({
      event: data.item.event,
      images: data.item.images,
      venue: data.item.venue,
      location: data.item.location,
      backgroundImage: backgroundImage,
      formatting
    });
  };

  getVendors = () => {
    vendorService
      .getByEventId(this.props.match.params.id)
      .then(this.listVendors)
      .catch(this.axiosError);
  };

  listVendors = data => {
    const vendorsArray = data.item;
    this.setState({ vendorsArray });
  };

  vendorView = () => {
    this.props.history.push(
      "/admin/vendors/events/" + this.props.match.params.id
    );
  };

  axiosError = data => {
    _logger("shits fucked yo", data);
  };

  render() {
    return (
      <div>
        <Helmet>
          <title>Seller&apos;s Place Events Los Angeles</title>
        </Helmet>
        <NavBarNew {...this.props} />
        {this.state.event.headline && (
          <div className={PromoterStyles.containing}>
            <Cover
              backgroundImage={this.state.backgroundImage}
              coverTitle={this.state.formatting.coverTitle}
              showWidget={false}
            />
            <WideCol
              wideColTitle={this.state.event.name}
              wideColBody={this.state.formatting.eventOfferings}
              showWidget={false}
            />
          </div>
        )}

        {this.state.images ? (
          <div className="card bb mt-4">
            {" "}
            {this.state.images.length > 0 && (
              <div>
                <ImageCollage images={this.state.images} />
                <br />
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "30px" }}>
            <em>No images for this event</em>
          </div>
        )}
        <div className="card bb">
          {this.state.location.id && this.state.venue.id && (
            <div>
              <LocationCard
                location={this.state.location}
                venue={this.state.venue}
              />
            </div>
          )}
        </div>

        {this.state.vendorsArray.length > 0 && (
          <div className="card bb">
            <h1 className="text-center bb">
              Attending Vendors <br />
            </h1>
            <ImageCollage
              images={this.state.vendorsArray}
              container={VendorCard}
              history={this.props.history}
            />
            <br />
          </div>
        )}
        <Footer />
      </div>
    );
  }
}

EventDetails.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }),
  history: PropTypes.any,
  currentUser: PropTypes.any
};

export default EventDetails;
