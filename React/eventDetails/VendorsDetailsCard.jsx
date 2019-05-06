import React from "react";
import PropTypes from "prop-types";
import PaginationButton from "../../vendors/dashboardvendors/PaginationButton";
import "./VendorDetails.css";

function VendorsDetailsCard(props) {
  let count = props.pageIndex * 10 + 1;
  function container(vendor) {
    return (
      <tr key={vendor.id}>
        <td>
          <div className="vendor-data">{count++}</div>
        </td>
        <td>
          <div className="vendor-data">{vendor.vendorName}</div>
        </td>
        <td>
          <div className="vendor-data">{vendor.headline}</div>
        </td>
        <td>
          <div className="vendor-data">
            {vendor.vendorDescription.substring(0, 150)}...
          </div>
        </td>
        <td>
          <button
            className="btn btn-primary"
            value={vendor.id}
            onClick={props.onClick}
          >
            View Profile
          </button>
        </td>
      </tr>
    );
  }

  function handleSearch() {
    props.searchButton();
  }

  function table(vendors) {
    return vendors.map(container);
  }

  function nextPage() {
    const newPage = props.pageIndex + 1;
    props.newPage(newPage);
  }
  function prevPage() {
    const newPage = props.pageIndex - 1;
    props.newPage(newPage);
  }
  return (
    <div className="col-xl-12" key={props.vendors}>
      <div className="card border-primary mb-3">
        <div className="card-header text-white bg-primary">
          Vendors
          {props.displayButton && (
            <button
              onClick={handleSearch}
              className="float-right btn btn-xs btn-pill-left bg-secondary"
            >
              Search Vendors
            </button>
          )}
        </div>
        <div className="card-body col-xl-12">
          <div className="card card-default">
            <div className="card-header" />
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Vendor Name</th>
                      <th>Headline</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>{table(props.vendors)}</tbody>
                </table>

                <PaginationButton
                  hasNext={props.hasNext}
                  hasPrevious={props.hasPrev}
                  toPreviousPage={prevPage}
                  toNextPage={nextPage}
                />
                <p className="text-center">{props.totalCount} Vendors Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

VendorsDetailsCard.propTypes = {
  vendors: PropTypes.arrayOf(
    PropTypes.shape({
      businessId: PropTypes.number,
      dateCreated: PropTypes.string,
      dateModified: PropTypes.string,
      headline: PropTypes.string,
      id: PropTypes.number.isRequired,
      imageTitle: PropTypes.string,
      imageUrl: PropTypes.string,
      priceMax: PropTypes.number,
      priceMin: PropTypes.number,
      vendorDescription: PropTypes.string,
      vendorName: PropTypes.string.isRequired
    })
  ),
  onClick: PropTypes.func.isRequired,
  displayButton: PropTypes.bool,
  pageIndex: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  hasNext: PropTypes.bool.isRequired,
  hasPrev: PropTypes.bool.isRequired,
  newPage: PropTypes.func.isRequired,
  searchButton: PropTypes.func
};
VendorsDetailsCard.defaultProps = {
  displayButton: true
};
export default React.memo(VendorsDetailsCard);
