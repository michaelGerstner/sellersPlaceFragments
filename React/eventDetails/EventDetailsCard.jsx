import React from "react";
import PropTypes from "prop-types";

function EventDetailsCard(props) {
  const handleClick = e => {
    props.onClick(e);
  };

  let setUpTimeUTC = null;
  let startTimeUTC = null;
  let endTimeUTC = null;
  if (props.event.setupTime.includes("Z")) {
    setUpTimeUTC = props.event.setupTime.replace("Z", "");
    startTimeUTC = props.event.dateStart.replace("Z", "");
    endTimeUTC = props.event.dateEnd.replace("Z", "");
  } else {
    setUpTimeUTC = props.event.setupTime + "Z";
    startTimeUTC = props.event.dateStart + "Z";
    endTimeUTC = props.event.dateEnd + "Z";
  }
  const setupTime = new Date(setUpTimeUTC).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });
  const setupDate = new Date(setUpTimeUTC).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const startTime = new Date(startTimeUTC).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });
  const dateStart = new Date(startTimeUTC).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric"
  });
  const endTime = new Date(endTimeUTC).toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit"
  });
  const dateEnd = new Date(endTimeUTC).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  return (
    <div className="col-xl-6" key={props.event}>
      <div className="card border-primary mb-3">
        <div className="card-header text-white bg-primary">
          Event Details
          {props.buttonDisplay && (
            <button
              onClick={handleClick}
              className="float-right btn btn-xs btn-pill-left bg-secondary"
            >
              Edit
            </button>
          )}
        </div>
        <div className="card-body">
          <p className="card-text">
            <strong>{props.event.name}</strong>
          </p>
          <p className="card-text">
            <strong>Setup:</strong> {setupTime}, {setupDate}
          </p>
          <p className="card-text">
            <strong>Starting:</strong> {startTime}, {dateStart}
          </p>
          <p className="card-text">
            <strong>Ending:</strong> {endTime}, {dateEnd}
          </p>
          <p className="card-text">
            <strong>License:</strong> {props.event.license}
          </p>
        </div>
      </div>
    </div>
  );
}
EventDetailsCard.propTypes = {
  event: PropTypes.shape({
    dateEnd: PropTypes.string,
    dateStart: PropTypes.string,
    license: PropTypes.string,
    setupTime: PropTypes.string,
    name: PropTypes.string
  }),
  onClick: PropTypes.func,
  buttonDisplay: PropTypes.bool
};
EventDetailsCard.defaultProps = {
  buttonDisplay: true
};
export default React.memo(EventDetailsCard);
