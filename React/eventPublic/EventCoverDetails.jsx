import React from "react";
import PropTypes from "prop-types";

function EventCoverDetails(props) {
  return (
    <div>
      <p>{props.eventDetails.headline}</p>
      <p>
        <small>
          {props.eventDetails.dateStart.substring(5, 7) +
            "-" +
            props.eventDetails.dateStart.substring(8, 10) +
            "-" +
            props.eventDetails.dateStart.substring(0, 4)}
        </small>
      </p>
    </div>
  );
}

EventCoverDetails.propTypes = {
  eventDetails: PropTypes.object
};

export default React.memo(EventCoverDetails);
