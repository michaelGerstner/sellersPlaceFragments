import React from "react";
import PropTypes from "prop-types";
import GoogleMapReact from "google-map-react";
import Style from "./EventsPublic.module.css";
const gapiKey = "AIzaSyDzdWabrdQcdh4i8pxn6iuqvIv4jY6icEU";

function MiniMap(props) {
  const MarkerComponent = prop => (
    <a href={prop.pinLink} rel="noopener noreferrer" target="_blank">
      <em className="fa-2x mr-2 fas fa-map-pin" style={{ color: "#e9227b" }} />
    </a>
  );
  const center = {
    lat: props.lat,
    lng: props.lng
  };
  return (
    <div>
      <div
        className={Style.mapSize}
        style={{ height: props.height, width: props.width }}
      >
        <GoogleMapReact
          bootstrapURLKeys={{ key: gapiKey }}
          center={center}
          defaultZoom={props.defaultZoom}
          options={{
            zoomControl: props.zoomControl
          }}
        >
          <MarkerComponent
            lat={center.lat}
            lng={center.lng}
            pinLink={props.pinLink}
          />
        </GoogleMapReact>
      </div>
    </div>
  );
}

MiniMap.propTypes = {
  lng: PropTypes.number.isRequired,
  lat: PropTypes.number.isRequired,
  height: PropTypes.string,
  width: PropTypes.string,
  zoomControl: PropTypes.bool,
  defaultZoom: PropTypes.number,
  pinLink: PropTypes.string
};

MiniMap.defaultProps = {
  height: "200px",
  width: "600px",
  zoomControl: false,
  defaultZoom: 15
};

export default React.memo(MiniMap);
