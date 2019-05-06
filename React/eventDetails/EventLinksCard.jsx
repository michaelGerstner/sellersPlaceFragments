import React from "react";
import PropTypes from "prop-types";

function EventLinksCard(props) {
  const handleClick = e => {
    props.onClick(e);
  };
  return (
    <div className="col-xl-12" key={1}>
      <div className="card border-primary mb-3">
        <div className="card-header text-white bg-primary">
          Links
          {props.buttonDisplay &&
          (props.instagram ||
            props.twitter ||
            props.facebook ||
            props.eventSite) ? (
            <button
              onClick={handleClick}
              className="float-right btn btn-xs btn-pill-left bg-secondary"
            >
              Edit
            </button>
          ) : (
            <button
              onClick={handleClick}
              className="float-right btn btn-xs btn-pill-left bg-secondary"
            >
              Add Links
            </button>
          )}
        </div>
        {(props.eventSite ||
          props.instagram ||
          props.twitter ||
          props.facebook) && (
          <div className="card-body">
            {props.instagram && (
              <p>
                <em className="fa-2x mr-2 fab fa-instagram" />{" "}
                <strong>{props.instagram.siteUrl}</strong>
              </p>
            )}
            {props.twitter && (
              <p>
                <em className="fa-2x mr-2 fab fa-twitter" />
                <strong>{props.twitter.siteUrl}</strong>
              </p>
            )}
            {props.facebook && (
              <p>
                <em className="fa-2x mr-2 fab fa-facebook-f" />
                <strong>{props.facebook.siteUrl}</strong>
              </p>
            )}
            {props.eventSite && (
              <p>
                <em className="fa-2x icon-globe mr-2" />
                <strong>{props.eventSite.siteUrl}</strong>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

EventLinksCard.propTypes = {
  buttonDisplay: PropTypes.bool,
  onClick: PropTypes.func,
  instagram: PropTypes.object,
  twitter: PropTypes.object,
  facebook: PropTypes.object,
  eventSite: PropTypes.object
};

EventLinksCard.defaultProps = {
  buttonDisplay: true
};

export default React.memo(EventLinksCard);
