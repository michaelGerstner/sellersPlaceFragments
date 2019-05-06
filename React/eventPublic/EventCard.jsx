import React from "react";
import PropTypes from "prop-types";
import eventStyles from "./EventsPublic.module.css";

function EventsCard(props) {
  const formatDate = date => {
    let d = new Date(date);
    let hh = d.getHours();
    let m = d.getMinutes();
    let s = d.getSeconds();
    let dd = "am";
    let h = hh;
    if (h >= 12) {
      h = hh - 12;
      dd = "pm";
    }
    if (h === 0) {
      h = 12;
    }
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    let pattern = new RegExp("0?" + hh + ":" + m + ":" + s);
    let replacement = h + ":" + m;
    replacement += "" + dd;
    return date.replace(pattern, replacement);
  };

  const dateString = () => {
    let d = new Date(props.event.dateStart);
    return d.toDateString();
  };

  const getTime = () => {
    let time = formatDate(props.event.dateStart);
    //Jay - i put this logic in to fix bug i had with venue details page. My events time was not being formatted correctly. Inserting local time, but coming back utc, so new Date method converted it to utc, thinking it was converting to local. Removing Z (Zulu time) kept it local
    if (time.includes("Z")) {
      time = time.replace("Z", "");
      time = new Date(time).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    return time.replace(/.*T/, "");
  };
  const getAddress = () =>
    props.event.lineOne + ", " + props.event.city + ", " + props.event.zip;

  return (
    <div id={props.event.id} className="col-md-4" key={props.event.id}>
      <div className={eventStyles.eventImgDiv}>
        {props.event.mainImage ? (
          <div
            className={eventStyles.cardImg}
            style={{
              backgroundImage:
                "url(" + props.event.mainImage.split(" ").join("%20") + ")"
            }}
          />
        ) : (
          <div
            className={eventStyles.cardImg}
            style={{
              backgroundImage:
                "url(https://sabio-s3.s3.us-west-2.amazonaws.com/sellersplace/ae628428-6096-42db-a73f-c2fca2145f12_Sellers_Place_Logo_700x318.png)",
              backgroundSize: "contain"
            }}
          />
        )}
      </div>
      <div className={eventStyles.marginOne}>
        <p className={eventStyles.cardTitle}>
          <strong>{props.event.name}</strong>
        </p>
        <p className={eventStyles.cardSubtitle}>
          <strong>
            {dateString()}
            {", "}
            {getTime()}
          </strong>
        </p>
        {!props.forVenuePublicPage && (
          <a
            href={"https://maps.google.com/?q=term" + getAddress()}
            target={"_blank"}
          >
            <p className={eventStyles.addressLine}>
              {!props.forVenuePublicPage ? getAddress() : null}
            </p>
          </a>
        )}
        <button
          id={props.event.id}
          className={eventStyles.eventButton}
          type="button"
          onClick={props.handleViewClick}
        >
          View More
        </button>
      </div>
    </div>
  );
}

EventsCard.propTypes = {
  event: PropTypes.shape({
    name: PropTypes.string,
    dateStart: PropTypes.string,
    lineOne: PropTypes.string,
    city: PropTypes.string,
    zip: PropTypes.string,
    primaryImage: PropTypes.string,
    id: PropTypes.number,
    mainImage: PropTypes.string
  }),
  forVenuePublicPage: PropTypes.bool,
  history: PropTypes.any,
  handleViewClick: PropTypes.func
};

export default React.memo(EventsCard);
