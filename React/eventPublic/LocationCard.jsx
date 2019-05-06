import React from "react";
import PropTypes from "prop-types";
import Styles from "../Home.module.css";
import "../Home.module.css";
import MiniMap from "./MiniMap";

function LocationCard(props) {
  const googleLink =
    "https://maps.google.com/?ll=" +
    props.location.latitude +
    "," +
    props.location.longitude; //"https://maps.google.com/?ll=latitude,longitude"

  return (
    <div className="row">
      <div className="col-xl-12">
        <div className={Styles.footer}>
          <div className={Styles.darkText}>
            <div style={{ fontSize: "120%" }}>
              <h2>{props.venue.name}</h2>
              <a
                style={{ color: "#e9227b" }}
                href={googleLink}
                rel="noopener noreferrer"
                target="_blank"
              >
                <p>{props.location.lineOne}</p>
                <p>{props.location.lineTwo}</p>
                <span>{props.location.city}</span>
                <span>
                  {", "}
                  {props.location.stateId === 1 && <span>CA</span>}
                </span>
                <span>
                  <span>{props.location.zip}</span>
                </span>
              </a>
              <div align={"center"} className="mt-2">
                <MiniMap
                  lat={props.location.latitude}
                  lng={props.location.longitude}
                  venue={props.venue}
                  pinLink={googleLink}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

LocationCard.propTypes = {
  location: PropTypes.shape({
    city: PropTypes.string.isRequired,
    countryId: PropTypes.number,
    id: PropTypes.number.isRequired,
    latitude: PropTypes.number.isRequired,
    lineOne: PropTypes.string.isRequired,
    lineTwo: PropTypes.string,
    locationTypeId: PropTypes.number,
    longitude: PropTypes.number,
    name: PropTypes.string,
    stateId: PropTypes.number,
    userId: PropTypes.number,
    zip: PropTypes.string
  }),
  venue: PropTypes.shape({
    addressId: PropTypes.number,
    dateCreated: PropTypes.string,
    dateModified: PropTypes.string,
    description: PropTypes.string,
    headline: PropTypes.string,
    id: PropTypes.number,
    isApproved: PropTypes.bool,
    isClaimed: PropTypes.bool,
    name: PropTypes.string,
    status: PropTypes.number,
    url: PropTypes.string,
    userId: PropTypes.number
  })
};

export default React.memo(LocationCard);
