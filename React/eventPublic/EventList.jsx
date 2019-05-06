import React from "react";
import PropTypes from "prop-types";
import EventCard from "./EventCard";
import logger from "../../../../logger";
import eventStyles from "./EventsPublic.module.css";
import PaginationButtons from "./PaginationButtons";

const _logger = logger.extend("Paul");

class EventList extends React.Component {
  state = {
    eventsCompArray: []
  };

  loadEventData = eventsArray => {
    _logger(eventsArray);
    const eventsCompArray = this.componentizeData(eventsArray);
    return eventsCompArray;
  };

  componentizeData = eventsArray => eventsArray.map(this.mapEvent);

  mapEvent = event => (
    <EventCard
      key={event.id}
      event={event}
      forVenuePublicPage={this.props.forVenuePublicPage}
      handleViewClick={this.props.handleViewClick}
    />
  );

  loadError = data => _logger(data);

  render() {
    return (
      <div>
        <div className="row">{this.loadEventData(this.props.eventsArray)}</div>
        <div
          className="row"
          style={{ alignContent: "center", textAlign: "center" }}
        >
          {this.props.viewButtons && (
            <div className={eventStyles.buttonDiv}>
              <PaginationButtons
                hasPrevious={this.props.hasPrevious}
                hasNext={this.props.hasNext}
                toPreviousPage={this.props.toPreviousPage}
                toNextPage={this.props.toNextPage}
              />
              {/*  */}
            </div>
          )}
        </div>
      </div>
    );
  }
}
EventList.propTypes = {
  eventsArray: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string,
      dateStart: PropTypes.string,
      lineOne: PropTypes.string,
      city: PropTypes.string,
      zip: PropTypes.string.isRequired,
      mainImage: PropTypes.string
    })
  ).isRequired,
  forVenuePublicPage: PropTypes.bool,
  handleViewClick: PropTypes.func,
  handleViewAllClick: PropTypes.func,
  viewButtons: PropTypes.bool,
  hasNext: PropTypes.bool,
  hasPrevious: PropTypes.bool,
  toNextPage: PropTypes.func,
  toPreviousPage: PropTypes.func
};

EventList.defaultProps = {
  viewAllDisplay: false
};
export default EventList;
