import React from "react";
import PropTypes from "prop-types";
import Style from "./EventsPublic.module.css";
function VendorCard(props) {
  function toVendor(e) {
    debugger;
    props.history.push("/vendors/" + e.target.id);
  }
  return (
    <div className="card">
      <div className="card-header">
        {props.image.imageUrl ? (
          <img
            className={Style.vendorImage}
            src={props.image.imageUrl}
            alt="Vendor"
            id={props.image.id}
            onClick={toVendor}
          />
        ) : (
          <img
            id={props.image.id}
            onClick={toVendor}
            className={Style.vendorImage}
            style={{ objectFit: "contain" }}
            alt="Logo"
            src={
              "https://sabio-s3.s3.us-west-2.amazonaws.com/sellersplace/ae628428-6096-42db-a73f-c2fca2145f12_Sellers_Place_Logo_700x318.png"
            }
          />
        )}
      </div>
      <div className={Style.vendorCard}>
        <h3 className={Style.vendorTitle}>{props.image.vendorName}</h3>
      </div>
    </div>
  );
}

VendorCard.propTypes = {
  image: PropTypes.shape({
    id: PropTypes.number.isRequired,
    imageUrl: PropTypes.string,
    imageTitle: PropTypes.string,
    vendorDescription: PropTypes.string,
    vendorName: PropTypes.string,
    headline: PropTypes.string
  }),
  history: PropTypes.any
};

export default React.memo(VendorCard);
