import React from "react";
import PropTypes from "prop-types";

function EventOfferingsCard(props) {
  const handleClick = e => {
    props.onClick(e);
  };
  const mapOffering = offering => (
    <p className="card-text" key={offering.id}>
      {offering.name}
    </p>
  );
  return (
    <div className="col-xl-12" key={props.offerings}>
      <div className="card border-primary mb-3">
        <div className="card-header text-white bg-primary">
          Offerings
          {!props.offerings && props.buttonDisplay ? (
            <button
              className="float-right btn btn-xs btn-pill-left bg-secondary"
              onClick={handleClick}
            >
              Add Offerings
            </button>
          ) : (
            <button
              className="float-right btn btn-xs btn-pill-left bg-secondary"
              onClick={handleClick}
            >
              Edit
            </button>
          )}
        </div>
        {props.offerings && (
          <div className="card-body">{props.offerings.map(mapOffering)}</div>
        )}
      </div>
    </div>
  );
}

EventOfferingsCard.propTypes = {
  offerings: PropTypes.array,
  buttonDisplay: PropTypes.bool,
  onClick: PropTypes.func
};

EventOfferingsCard.defaultProps = {
  buttonDisplay: true
};

export default React.memo(EventOfferingsCard);
