import React from "react";
import PropTypes from "prop-types";
import PromoterStyles from "../Promotion.module.css";

function EventOfferings(props) {
  const isVendor = role => role === "Vendor";

  function ConcatOfferings() {
    let string = "";
    if (props.offerings) {
      for (var i = 0; i < props.offerings.length; i++) {
        if (props.offerings[i]) {
          if (props.offerings[i].name) {
            string = string + props.offerings[i].name + " | ";
          }
        }
      }
      string = string.substring(0, string.length - 3);
      return string;
    }
  }
  const offerings = ConcatOfferings(props.offerings);
  return (
    <a className="row">
      <span className="col-xs-0 col-md-4" />
      <span className="col-xs-12 col-md-4">
        {props.description && (
          <span className="card bb">
            <span>{props.description}</span>
            <br />
          </span>
        )}
        <span className="card bb">
          {props.isFree && <span>Free Event | </span>}
          <span>
            {props.offerings ? offerings : <em>No offerings listed</em>}
          </span>
          <br />
        </span>
        {props.currentUser.roles.find(isVendor) && (
          <button
            className={PromoterStyles.vendorView}
            type="button"
            onClick={props.vendorView}
          >
            View and Apply
          </button>
        )}
      </span>
    </a>
  );
}

EventOfferings.propTypes = {
  offerings: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.number
    })
  ),
  isFree: PropTypes.bool,
  description: PropTypes.string,
  vendorView: PropTypes.func,
  currentUser: PropTypes.any
};

export default React.memo(EventOfferings);
