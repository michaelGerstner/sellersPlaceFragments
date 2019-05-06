import React from "react";
import PropTypes from "prop-types";
import "./VendorSearch.css";
import Textfit from "react-textfit";

function VendorContactCard(props) {
  const displayOptions = {
    alcohol: false,
    food: false,
    music: false,
    goods: false,
    power: false,
    specialCharacter: false,
    magic: false,
    security: false
  };

  function icon(vendor) {
    let type = vendor.offeringList;
    if (type !== null) {
      for (var i = 0; i < type.length; i++) {
        if (
          type[i].offering === "Food Truck" ||
          type[i].offering === "On-Site Food" ||
          type[i].offering === "Food Reseller"
        ) {
          displayOptions.food = true;
        }
        if (
          type[i].offering === "Beer and Wine Seller" ||
          type[i].offering === "Bartender" ||
          type[i].offering === "Full Bar Seller"
        ) {
          displayOptions.alcohol = true;
        }
        if (
          type[i].offering === "Musician" ||
          type[i].offering === "DJ" ||
          type[i].offering === "Band" ||
          type[i].offering === "Acoustic Guitar"
        ) {
          displayOptions.music = true;
        }
        if (type[i].offering === "Merchandise") {
          displayOptions.goods = true;
        }
        if (type[i].offering === "Power Provider") {
          displayOptions.power = true;
        }
        if (
          type[i].offering === "Entertainer - Other" ||
          type[i].offering === "Clown with Balloons" ||
          type[i].offering === "Special Character with Balloons"
        ) {
          displayOptions.specialCharacter = true;
        }
        if (
          type[i].offering === "Magician" ||
          type[i].offering === "Fortune Teller"
        ) {
          displayOptions.magic = true;
        }
        if (type[i].offering === "Security") {
          displayOptions.security = true;
        }
      }
    }
  }
  return (
    <div className="col-xs-12 col-sm-12 col-md-6 col-lg-4 col-xl-3 cardContainer">
      <div
        key={props.vendor.id}
        className="col-12 card card-default vendorCard"
      >
        {props.vendor.logo ? (
          <img
            className="card-img-top bb"
            src={props.vendor.logo}
            alt="Thumbnail"
            style={{
              objectFit: "cover",
              width: "auto",
              height: "200px"
            }}
          />
        ) : (
          <img
            className="card-img-top bb"
            src="img\Sellers_Place_Logo_300x136.png"
            alt="Thumbnail"
            style={{
              objectFit: "fit",
              width: "auto",
              height: "200px"
            }}
          />
        )}
        <div>
          <div className="col-12">
            <div className="row title">
              <div className="col-8 mt-2">
                <Textfit mode="single" style={{ color: "#41A8D4" }} max={20}>
                  {props.vendor.vendorName}
                </Textfit>
                <ul className="list-unstyled mt-3">
                  <li style={{ padding: "1%" }}>
                    <a className="mb-1 text-dark" href={props.emailHref}>
                      <Textfit mode="single" max={15}>
                        <em className="fa fa-envelope fa-fw icon mr-1" />{" "}
                        {props.vendor.email}
                      </Textfit>
                    </a>
                  </li>
                  {props.vendor.contact && props.phoneHref ? (
                    <li style={{ padding: "1%" }}>
                      <a className="mb-1 text-dark" href={props.phoneHref}>
                        <Textfit mode="single" max={15}>
                          <em className="fa fa-phone fa-fw icon mr-2" />
                          {props.vendor.contact}
                        </Textfit>
                      </a>
                    </li>
                  ) : (
                    <li style={{ padding: "1%" }}>
                      <a className="mb-1 text-dark">
                        <em className="fa mr-2 fas fa-phone-slash icon" />{" "}
                      </a>
                    </li>
                  )}
                </ul>
              </div>
              <div className="col-4 text-right" style={{ marginTop: "10px" }}>
                <button
                  className="btn btn-labeled btn-info mb-2 btn-xs icon invite"
                  type="button"
                  // onClick={() => props.grabVendorId()}
                  onClick={e => props.grabVendorId(e, props.vendor)}
                >
                  <span className="btn-label">
                    <em className="fa fa-bullhorn fa-fw" />
                  </span>
                  Invite!
                </button>
                {props.vendor.priceMin && (
                  <div className="text-right">
                    <strong className="icon">Price Range: </strong>

                    <span>${props.vendor.priceMin}-</span>
                    <span>${props.vendor.priceMax}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="card-body row productContainer mt-2">
          {props.vendor.products ? (
            <div className="col-xs-12 col-md-7">
              <div className="icon bb mb-2">
                <em className="fa-1x mr-2 fas fa-shopping-basket" />
              </div>
              <table>
                <tbody className="productList">
                  {props.vendor.products[0] && (
                    <tr className="productRow">
                      <td>
                        {props.vendor.products[0].imgUrls[0] && (
                          <img
                            className="rounded thumb64 productImg"
                            style={{ marginRight: "2.2%" }}
                            src={props.vendor.products[0].imgUrls[0].imgUrl}
                            alt=""
                          />
                        )}
                      </td>
                      <td className="productText">
                        <p className="name">{props.vendor.products[0].name}</p>
                        <p className="productDescription">
                          {props.vendor.products[0].description}
                        </p>
                      </td>
                    </tr>
                  )}
                  {props.vendor.products[1] && (
                    <tr className="productRow">
                      <td>
                        {props.vendor.products[1].imgUrls[0] && (
                          <img
                            className="rounded thumb64 productImg"
                            style={{ marginRight: "2.2%" }}
                            src={props.vendor.products[1].imgUrls[0].imgUrl}
                            alt="Product"
                          />
                        )}
                      </td>
                      <td className="productText">
                        <p className="name">{props.vendor.products[1].name}</p>
                        <p className="productDescription">
                          {props.vendor.products[1].description}
                        </p>
                      </td>
                    </tr>
                  )}
                  {props.vendor.products[2] && (
                    <tr className="productRow">
                      <td>
                        {props.vendor.products[2].imgUrls[0] && (
                          <img
                            className="rounded thumb64 productImg"
                            style={{ marginRight: "2.2%" }}
                            src={props.vendor.products[2].imgUrls[0].imgUrl}
                            alt=""
                          />
                        )}
                      </td>
                      <td className="productText">
                        <p className="name">{props.vendor.products[2].name}</p>
                        <p className="productDescription">
                          {props.vendor.products[2].description}
                        </p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="col-xs-12 col-md-7 noResults text-center">
              <div className="icon bb mb-2">
                <em className="fa-1x mr-2 fas fa-shopping-basket" />
              </div>
              <span>
                <em>Vendor hasn&apos;t uploaded any products</em>
              </span>
            </div>
          )}
          {props.vendor.citiesList ? (
            <div className="col-xs-12 col-md-5 cities">
              <div className="icon bb">
                <em className="fa-1x mr-2 fas fa-map-marker-alt" />
              </div>
              <div>
                <div className="col-xs-6 citiesLeft">
                  {props.vendor.citiesList[0] && (
                    <p>{props.vendor.citiesList[0].city}</p>
                  )}
                  {props.vendor.citiesList[1] && (
                    <p>{props.vendor.citiesList[1].city}</p>
                  )}
                  {props.vendor.citiesList[2] && (
                    <p>{props.vendor.citiesList[2].city}</p>
                  )}
                </div>
                <div className="col-xs-6 citiesRight push-right">
                  {props.vendor.citiesList[3] && (
                    <p>{props.vendor.citiesList[3].city}</p>
                  )}
                  {props.vendor.citiesList[4] && (
                    <p>{props.vendor.citiesList[4].city}</p>
                  )}
                  {props.vendor.citiesList[5] && (
                    <p>{props.vendor.citiesList[5].city}</p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="col-xs-12 col-md-5 noResults text-center">
              <div className="icon bb">
                <em className="fa-1x mr-2 fas fa-map-marker-alt" />
              </div>
              <em>Vendor hasn&apos;t added cities they vend in. </em>
            </div>
          )}
        </div>
        <div className="card-footer icon mt-auto">
          <div className="text-sm">
            <ul className="list-inline m-0">
              {icon(props.vendor)}
              {displayOptions && (
                <div>
                  {displayOptions.food && (
                    <li className="list-inline-item">
                      <em className="fa-2x mr-2 fas fa-utensils" />
                    </li>
                  )}
                  {displayOptions.alcohol && (
                    <li className="list-inline-item">
                      <em className="fa-2x mr-2 fas fa-glass-martini" />
                    </li>
                  )}
                  {displayOptions.music && (
                    <li className="list-inline-item">
                      <em className="fa-2x mr-2 fas fa-music" />
                    </li>
                  )}
                  {displayOptions.goods && (
                    <li className="list-inline-item">
                      <em className="fa-2x mr-2 fas fa-store" />
                    </li>
                  )}
                  {displayOptions.power && (
                    <li className="list-inline-item">
                      <em className="fa-2x mr-2 fas fa-bolt" />
                    </li>
                  )}
                  {displayOptions.power && (
                    <li className="list-inline-item">
                      <em className="fa-2x mr-2 fas fa-user-shield" />
                    </li>
                  )}
                  {displayOptions.specialCharacter && (
                    <li className="list-inline-item">
                      <em className="fa-2x mr-2 fas fa-smile" />
                    </li>
                  )}
                </div>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

VendorContactCard.propTypes = {
  vendor: PropTypes.shape({
    citiesList: PropTypes.array,
    offeringList: PropTypes.array,
    products: PropTypes.array,
    logo: PropTypes.string,
    vendorName: PropTypes.string.isRequired,
    priceMin: PropTypes.number,
    priceMax: PropTypes.number,
    id: PropTypes.number.isRequired,
    contact: PropTypes.string,
    email: PropTypes.string
  }),
  phoneHref: PropTypes.string,
  emailHref: PropTypes.string,
  grabVendorId: PropTypes.func
};

export default React.memo(VendorContactCard);
