import React, { Component } from "react";
import VendorContactCard from "./VendorContactCard";
import * as services from "../../services/vendorsService";
import InviteModal from "../promoters/InviteVendorModal";
import logger from "../../logger";
import { DropdownItem } from "reactstrap";
import * as eventService from "../../services/eventServices.js";
import * as inviteEmailService from "../../services/inviteEmailService.js";
import SearchBar from "./SearchBar";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import "./VendorSearch.css";
import { toast } from "react-toastify";

const _logger = logger.extend("mike");

class VendorSearch extends Component {
  state = {
    vendorComponents: [],
    vendorStorage: [],
    pageIndex: 0,
    modal: false,
    dropdownOpen: false,
    dropDownData: [],
    dropDownComponents: [],
    selectedEvent: {},
    selectedVendor: {},
    dropDownValue: "",
    searchTerms: {
      text: "",
      geo: "",
      miles: "50"
    },
    latLng: "",
    mileMenuOpen: false,
    onLoad: false,
    onError: false
  };

  componentDidMount() {
    this.getAll(0);
  }

  onLoad = () => {
    this.setState({ onLoad: true });
  };

  onError = () => {
    this.setState({ onError: true });
  };

  clearSearch = () => {
    const searchTerms = {
      text: "",
      geo: "",
      miles: "50"
    };
    this.setState({
      vendorComponents: [],
      vendorStorage: [],
      pageIndex: 0,
      dropDownValue: "",
      searchTerms,
      latLng: ""
    });
    this.getAll(0);
  };

  cardComponent = vendor => {
    return (
      <VendorContactCard
        key={vendor.id}
        vendor={vendor}
        phoneHref={"tel:" + vendor.contact}
        emailHref={"mailto:" + vendor.email}
        grabVendorId={this.grabVendorId}
      />
    );
  };

  handleClick = e => {
    if (e.target.name === "next" && this.state.hasNextPage) {
      const pageIndex = this.state.pageIndex + 1;
      this.search(pageIndex);
    }
    if (e.target.name === "prev" && this.state.hasPreviousPage) {
      const pageIndex = this.state.pageIndex - 1;
      this.search(pageIndex);
    }
    if (e.target.name === "search") {
      this.search(0);
    }
    if (e.target.name === "dropDown") {
      this.setState(prevState => ({
        mileMenuOpen: !prevState.mileMenuOpen
      }));
    }
    if (e.target.name === "clear") {
      this.clearSearch();
    }
    if (e.target.name === "miles") {
      this.handleChange(e);
    }
  };

  search = pageIndex => {
    if (!pageIndex) {
      pageIndex = 0;
    }
    let pageSize = 6;
    if (window.innerWidth > 600) {
      pageSize = 12;
    }
    debugger;
    if (this.state.latLng) {
      const coords = { ...this.state.latLng };
      const lat = coords.lat;
      const lng = coords.lng;
      const radius = this.state.searchTerms.miles / 0.0006213712;
      if (this.state.searchTerms.text) {
        services
          .duoSearch(
            lat,
            lng,
            radius,
            this.state.searchTerms.text,
            pageIndex,
            pageSize
          )
          .then(this.componentsToState)
          .catch(this.axiosError);
      } else {
        services
          .searchGeo(lat, lng, radius, pageIndex, pageSize)
          .then(this.componentsToState)
          .catch(this.axiosError);
      }
    } else if (this.state.searchTerms.geo) {
      services
        .searchCity(this.state.searchTerms.geo, pageIndex, pageSize)
        .then(this.componentsToState)
        .catch(this.axiosError);
    } else if (this.state.searchTerms.text) {
      services
        .search(this.state.searchTerms.text, pageIndex, pageSize)
        .then(this.componentsToState)
        .catch(this.axiosError);
    } else {
      this.getAll(pageIndex);
    }
  };

  getAll = pageIndex => {
    let pageSize = 6;
    if (window.innerWidth > 600) {
      pageSize = 12;
    }
    services
      .getAll(pageIndex, pageSize)
      .then(this.componentsToState)
      .catch(this.axiosError);
  };

  handleChange = e => {
    let searchTerms = { ...this.state.searchTerms };
    let mileMenuOpen = this.state.mileMenuOpen;
    if (e.type === "change" || e.type === "click") {
      const keyName = e.target.name;
      searchTerms[keyName] = e.target.value;
    } else if (e[0] && e[0].formatted_address) {
      searchTerms.geo = e[0].formatted_address;
      this.setState({ searchTerms });
      return e;
    } else {
      searchTerms.geo = e;
    }
    if (this.state.mileMenuOpen) {
      mileMenuOpen = !this.state.mileMenuOpen;
    }
    this.setState({ searchTerms, mileMenuOpen });
  };

  handleSelect = address => {
    geocodeByAddress(address)
      .then(this.handleChange)
      .then(results => getLatLng(results[0]))
      .then(this.latLng)
      .catch(this.axiosError);
  };

  latLng = latLng => {
    this.setState({ latLng });
  };

  toggle = xtr => {
    xtr = xtr || {};
    this.setState(prevState => {
      xtr.modal = !prevState.modal;
      xtr.dropDownValue = "";
      return xtr;
    });
  };

  componentsToState = data => {
    const vendors = data.item.pagedItems;
    const vendorComponents = vendors.map(this.cardComponent);
    const newState = {
      vendors: vendors,
      vendorComponents: vendorComponents,
      hasNextPage: data.item.hasNextPage,
      hasPreviousPage: data.item.hasPreviousPage,
      pageIndex: data.item.pageIndex
    };
    window.scrollTo(0, 0);
    this.setState(newState);
  };

  axiosError = data => {
    toast("No results found");
    _logger("shits fucked yo", data);
  };

  toggle = xtr => {
    xtr = xtr || {};
    this.setState(prevState => {
      xtr.modal = !prevState.modal;
      xtr.dropDownValue = "";
      return xtr;
    });
  };

  getEvent = () => {
    eventService
      // .getByPromoterIdV2(Number(this.props.match.params.id))
      .getByPromoterIdV2(47)
      .then(this.onGetSuccess)
      .catch(this.onErrorFunc);
  };

  onGetSuccess = data => {
    const dropDownData = data.items;
    const dropDownComponents = dropDownData.map(this.mapDropDownItems);
    this.setState({
      dropDownComponents,
      dropDownData
    });
  };

  onErrorFunc = data => {
    logger(data);
  };

  getSelectedEvent = e => {
    const dropDownValue = e.target.name;
    const dropDownData = [...this.state.dropDownData];
    const index = dropDownData.findIndex(
      event => event.eventId === Number(e.target.value)
    );
    const selectedEvent = dropDownData[index];
    this.setState({
      dropDownValue,
      selectedEvent
    });
  };

  mapDropDownItems = event => {
    return (
      <DropdownItem
        key={event.eventId}
        value={event.eventId}
        name={event.name}
        onClick={this.getSelectedEvent}
      >
        {event.name}
      </DropdownItem>
    );
  };

  grabVendorId = (e, vendor) => {
    logger(e, vendor, "clicked");
    this.toggle({ selectedVendor: vendor });
  };

  inviteVendor = () => {
    inviteEmailService
      .addEventAndVendor(
        this.state.selectedEvent.eventId,
        this.state.selectedVendor.id
      )
      .then(this.onAddEventVendorSuccess)
      .catch(this.onAddEventVendorError);
  };

  onAddEventVendorSuccess = data => {
    logger(data, "LETS GOOOOOOOOOOOOOO");
    const payload = this.state.selectedEvent;
    payload.vendorInfo = this.state.selectedVendor;

    inviteEmailService
      .sendInvite(payload)
      .then(this.onInviteSuccess)
      .catch(this.onInviteErrorFunc);
  };

  onAddEventVendorError = data => {
    logger(data.response.data.number, "nahhhhh");
    if (data.response.data.number === 2627) {
      toast.error("Oops! Already invited this vendor!");
      this.toggle({ dropDownValue: "" });
    } else {
      toast.error("Error, something went wrong :(");
    }
  };

  onInviteSuccess = data => {
    logger(data, "LETS GOOOOOOOOOOOOOO");
    this.toggle({ dropDownValue: "" });
    toast("Invite Sent!");
  };

  onInviteErrorFunc = data => {
    logger(data, "try again buddy");
    this.toggle({ dropDownValue: "" });
    toast.error("Something went wrong");
  };

  toggleDrop = () => {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  };

  render() {
    return (
      <div className="content-wrapper">
        <div className="content-heading">
          <div className="header">Search Vendors</div>
        </div>
        <SearchBar
          handleChange={this.handleChange}
          handleSelect={this.handleSelect}
          handleClick={this.handleClick}
          text={this.state.searchTerms.text}
          geo={this.state.searchTerms.geo}
          dropDownOpen={this.state.mileMenuOpen}
          miles={this.state.searchTerms.miles}
          load={this.state.onLoad}
          error={this.state.onError}
          onLoad={this.onLoad}
          onError={this.onError}
        />
        <div className="container-fluid">
          <div className="row content-wrapper">
            {this.state.vendorComponents}
            {this.state.modal && (
              //jay made this modal component, if it dont work talk to him - mike
              <InviteModal
                isOpen={this.state.modal}
                toggle={this.toggle}
                toggleDrop={this.toggleDrop}
                dropdownOpen={this.state.dropdownOpen}
                dropDownData={this.state.dropDownData}
                dropDownComponents={this.state.dropDownComponents}
                selectedEvent={this.state.selectedEvent}
                dropDownValue={this.state.dropDownValue}
                getEvent={this.getEvent}
                inviteVendor={this.inviteVendor}
              />
            )}
          </div>
        </div>
        <nav>
          <ul className="pagination justify-content-center">
            <li className="page-item">
              {this.state.hasPreviousPage && (
                <button
                  className="page-link fa-1x mr-2 fas fa-arrow-left"
                  name="prev"
                  onClick={this.handleClick}
                />
              )}
            </li>
            <li className="page-item">
              {this.state.hasNextPage && (
                <button
                  className="page-link fa-1x mr-2 fas fa-arrow-right"
                  name="next"
                  onClick={this.handleClick}
                />
              )}
            </li>
          </ul>
        </nav>
      </div>
    );
  }
}

export default VendorSearch;
