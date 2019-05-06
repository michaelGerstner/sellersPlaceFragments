import React from "react";
import * as eventServices from "../../services/eventServices";
import EventForm from "./EventsForm";
import logger from "../../logger";
import PropTypes from "prop-types";
import { toast } from "react-toastify";
const _logger = logger.extend("eventsform");

function EventsEdit(props) {
  const eventId = Number(props.match.params.id);
  const formHeadline = "Event Edit";
  const editEvent = payload => {
    eventServices
      .edit(payload)
      .then(editSuccess)
      .catch(editError);
  };

  const editSuccess = () => {
    toast("You've edited this event");
    props.history.push("/admin/promoters/events/" + props.match.params.id);
    _logger("Success");
  };

  const editError = () => {
    toast.error("An error occured while making an edit");
  };

  return (
    <EventForm
      id={eventId}
      onSubmit={editEvent}
      headline={formHeadline}
      editData={props.location.state}
    />
  );
}

EventsEdit.propTypes = {
  match: PropTypes.object,
  location: PropTypes.object,
  history: PropTypes.any
};

export default React.memo(EventsEdit);
