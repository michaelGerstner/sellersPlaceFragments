import React from "react";
import PropTypes from "prop-types";

function EventInDepth(props) {
  const handleClick = e => {
    props.onClick(e);
  };
  return (
    <div className="col-xl-12" key={props.event.id}>
      <div className="card border-primary mb-3">
        <div className="card-header text-white bg-primary">
          Event Info
          {props.buttonDisplay && (
            <button
              onClick={handleClick}
              className="float-right btn btn-xs btn-pill-left bg-gray-dark"
            >
              Manage
            </button>
          )}
        </div>
        <div className="card-body">
          <h1 className="card-text">{props.event.headline}</h1>

          <h3 className="card-text">{props.event.summary}</h3>
          <p className="card-text">{props.event.description}</p>
        </div>
      </div>
    </div>
  );
}
EventInDepth.propTypes = {
  event: PropTypes.any,
  onClick: PropTypes.func,
  buttonDisplay: PropTypes.bool
};
EventInDepth.defaultProps = {
  buttonDisplay: true
};
export default React.memo(EventInDepth);
