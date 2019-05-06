import React from "react";
import * as eventServices from "../../services/eventServices";
import EventForm from "./EventsForm";
import logger from "../../logger";
import { toast } from "react-toastify";
import PropTypes from "prop-types";

const _logger = logger.extend("eventsform");

function EventsNew(props) {
  const formHeadline = "Event Registration";
  const handleOnSubmit = payload => {
    eventServices
      .add(payload)
      .then(submitSuccess)
      .catch(submitError);
  };

  const submitSuccess = data => {
    _logger(data);
    props.history.push("/admin/events/offerings/" + data.item);
    toast("You've successfully submitted an event");
  };

  const submitError = () => {
    toast.error("An error occured while submitting");
  };

  return (
    <div>
      <EventForm onSubmit={handleOnSubmit} headline={formHeadline} />
    </div>
  );
}

EventsNew.propTypes = {
  history: PropTypes.object
};

export default React.memo(EventsNew);
