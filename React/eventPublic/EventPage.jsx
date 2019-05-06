import eventStyles from "./EventsPublic.module.css";
import React from "react";
import * as eventServices from "../../../../services/eventServices";
import NavBarNew from "../NavBarNew";
import Cover from "../Cover";
import WideCol from "../WideCol";
import EventList from "./EventList";
import Footer from "../Footer";
import Helmet from "react-helmet";
import logger from "../../../../logger";
import PropTypes from "prop-types";

const _logger = logger.extend("EventPage");

class EventPage extends React.PureComponent {
  state = {
    eventsArray: []
  };

  componentDidMount() {
    this.loadPage();
  }

  loadPage = () => {
    eventServices
      .getAllPaginated(0, 6)
      .then(this.loadEventData)
      .catch(this.loadError);
  };

  loadEventData = data => {
    _logger(data);
    let eventsArray = { ...this.state.eventsArray };
    eventsArray = data.item.pagedItems;
    const hasPrevious = data.item.hasPreviousPage;
    const hasNext = data.item.hasNextPage;
    const pageIndex = data.item.pageIndex;
    this.setState({
      eventsArray,
      hasPrevious,
      hasNext,
      pageIndex
    });
  };

  loadError = data => _logger(data);

  handleViewClick = e => {
    _logger(e);
    this.props.history.push("events/" + e.target.id);
  };
  handleViewAllClick = () => {
    this.props.history.push("events/all");
  };

  toPreviousPage = () => {
    if (this.state.hasPrevious === true) {
      const pageIndex = this.state.pageIndex - 1;
      this.getEvents(pageIndex, 6);
    }
  };

  toNextPage = () => {
    if (this.state.hasNext === true) {
      const pageIndex = this.state.pageIndex + 1;
      this.getEvents(pageIndex, 6);
    }
  };

  getEvents = (pageIndex, pageSize) => {
    eventServices
      .getAllPaginated(pageIndex, pageSize)
      .then(this.loadEventData)
      .catch(this.loadError);
  };

  render() {
    return (
      <div>
        <NavBarNew {...this.props} />
        <Cover
          backgroundImage={"url(/img/Bg_Events.jpg)"}
          coverTitle={"Upcoming Events"}
          coverBody={
            "Find the perfect event to sell your merchandise or to buy niche goods. Find events across major cities in the U.S and start showing your talents."
          }
          showWidget={false}
        />
        <WideCol
          wideColTitle={"Support Our Creative Community!"}
          wideColBody={
            "Support designers and vendors in our community and checkout their upcoming events below."
          }
          showWidget={false}
        />
        <div className={eventStyles.containing}>
          {this.state.eventsArray.length > 0 && (
            <EventList
              eventsArray={this.state.eventsArray}
              handleViewClick={this.handleViewClick}
              handleViewAllClick={this.handleViewAllClick}
              viewButtons={true}
              hasPrevious={this.state.hasPrevious}
              hasNext={this.state.hasNext}
              toPreviousPage={this.toPreviousPage}
              toNextPage={this.toNextPage}
            />
          )}
        </div>
        <Footer />
      </div>
    );
  }

  renderMetaTags() {
    return (
      <Helmet>
        <title>Sellers Place Home</title>
      </Helmet>
    );
  }
}

EventPage.propTypes = {
  history: PropTypes.any
};

export default EventPage;
