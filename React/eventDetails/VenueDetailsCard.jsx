import React from "react";
import PropTypes from "prop-types";

function VenueDetailsCard(props) {
  const handleClick = e => {
    props.onClick(e);
  };
  return (
    <div className="col-xl-6" key={props.venue}>
      <div className="card border-primary mb-3">
        <div className="card-header text-white bg-primary">
          Venue
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
            <strong>{props.venue.name}</strong>
          </p>
          <p className="card-text">
            <strong>Street Address:</strong> {props.location.lineOne}{" "}
            {props.location.lineTwo}
          </p>
          <p className="card-text">
            <strong>City: </strong>
            {props.location.city}
          </p>
          <p className="card-text">
            <strong>Zip Code: </strong>
            {props.location.zip}
          </p>
          <p className="card-text">
            <strong>Venue Url: </strong>
            <a href={props.venue.url} target={"_blank"}>
              Click here to be redirected
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
VenueDetailsCard.propTypes = {
  venue: PropTypes.any,
  onClick: PropTypes.func,
  buttonDisplay: PropTypes.bool,
  location: PropTypes.any
};
VenueDetailsCard.defaultProps = {
  buttonDisplay: true
};
export default React.memo(VenueDetailsCard);
