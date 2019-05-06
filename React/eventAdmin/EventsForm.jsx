import React from "react";
import logger from "../../logger";
import { Formik, Form, Field } from "formik";
import * as schema from "./schemas/addEventSchema";
import PropTypes from "prop-types";
import * as venuesServices from "../../services/venuesService.js";
import * as promotersServices from "../../services/promotersService.js";

const _logger = logger.extend("eventsform");
const _loggerTwo = logger.extend("mike");

class EventForm extends React.PureComponent {
  state = {
    formData: {
      eventStatusId: 3,
      promoterId: "",
      name: "",
      summary: "",
      headline: "",
      description: "",
      venueId: "",
      eventTypeId: 3,
      license: "",
      setupDate: "",
      setupTime: "",
      startDate: "",
      startTime: "",
      endDate: "",
      endTime: ""
    },
    isFree: true,
    venueOptions: [],
    promoterOptions: [],
    targetSchema: schema.addSchema
  };

  componentDidMount() {
    venuesServices
      .venuesDropDown()
      .then(this.venueOptions)
      .catch(this.axiosError);
    promotersServices
      .promoterDropDown()
      .then(this.promoterOptions)
      .catch(this.axiosError);
    this.editCheck();
  }

  dateFormat = date => {
    let localDate = new Date(date);
    let month = localDate.getMonth() + 1;
    let day = localDate.getDate();
    const year = localDate.getFullYear();
    if (month < 10) {
      month = `0${month}`;
    }
    if (day < 10) {
      day = `0${day}`;
    }
    return `${year}-${month}-${day}`;
  };

  editCheck = () => {
    const dataToEdit = this.props.editData;
    if (dataToEdit) {
      let setUpTimeUTC = null;
      let startTimeUTC = null;
      let endTimeUTC = null;
      if (dataToEdit.setupTime.includes("Z")) {
        setUpTimeUTC = dataToEdit.setupTime.replace("Z", "");
        startTimeUTC = dataToEdit.dateStart.replace("Z", "");
        endTimeUTC = dataToEdit.dateEnd.replace("Z", "");
      } else {
        setUpTimeUTC = dataToEdit.setupTime + "Z";
        startTimeUTC = dataToEdit.dateStart + "Z";
        endTimeUTC = dataToEdit.dateEnd + "Z";
      }
      const setUpTime = new Date(setUpTimeUTC).toLocaleTimeString(undefined, {
        hour12: false
      });
      const setUpDate = this.dateFormat(setUpTimeUTC);
      const startTime = new Date(startTimeUTC).toLocaleTimeString(undefined, {
        hour12: false
      });
      const startDate = this.dateFormat(startTimeUTC);
      const endTime = new Date(endTimeUTC).toLocaleTimeString(undefined, {
        hour12: false
      });
      const endDate = this.dateFormat(endTimeUTC);
      const formData = { ...this.state.formData };
      formData.eventStatusId = dataToEdit.eventStatusId;
      formData.promoterId = dataToEdit.promoterId;
      formData.name = dataToEdit.name;
      formData.summary = dataToEdit.summary;
      formData.headline = dataToEdit.headline;
      formData.description = dataToEdit.description;
      formData.venueId = dataToEdit.venueId;
      formData.eventTypeId = 3;
      formData.license = dataToEdit.license;
      formData.setupDate = setUpDate;
      formData.setupTime = setUpTime;
      formData.startDate = startDate;
      formData.startTime = startTime;
      formData.endDate = endDate;
      formData.endTime = endTime;

      this.setState({
        formData,
        isFree: dataToEdit.isFree
      });
    }
  };

  parseDateTime = datetime => {
    return datetime.split("T");
  };

  axiosError = data => _loggerTwo(data);

  optionHtml = option => (
    <option
      key={option.id}
      value={option.id}
      label={option.shortDescription || option.name}
    />
  );

  mapData = data => {
    if (data.items) {
      const array = data.items;
      return array.map(this.optionHtml);
    }
  };

  venueOptions = data => {
    let formData = { ...this.state.formData };
    formData.venueId = data.items[0].id;
    const venueOptions = this.mapData(data);
    this.setState({ venueOptions, formData });
  };
  promoterOptions = data => {
    let formData = { ...this.state.formData };
    formData.promoterId = data.items[0].id;
    const promoterOptions = this.mapData(data);
    this.setState({ promoterOptions, formData });
  };
  handleRadio = e => {
    const isFree = e.target.value === "true";
    this.setState({ isFree });
  };

  composePayload = values => {
    let payload = {
      id: this.props.id,
      eventStatusId: this.state.formData.eventStatusId,
      eventTypeId: this.state.formData.eventTypeId,
      isFree: this.state.isFree,
      name: values.name,
      summary: values.summary,
      headline: values.headline,
      description: values.description,
      venueId: values.venueId,
      license: values.license,
      promoterId: values.promoterId,
      setupTime: values.setupDate + " " + values.setupTime,
      dateStart: values.setupDate + " " + values.startTime,
      dateEnd: values.endDate + " " + values.endTime
    };
    return payload;
  };

  onSubmit = (values, actions) => {
    let payload = this.composePayload(values);
    _loggerTwo(payload);
    this.props.onSubmit(payload);
    actions.setSubmitting(false);
  };

  submitSuccess = data => {
    _logger("You've submitted an event", data);
  };

  submitError = () => {
    _logger("An error occured while submitting");
  };

  render() {
    return (
      <div>
        <Formik
          enableReinitialize={true}
          validationSchema={this.state.targetSchema}
          initialValues={this.state.formData}
          onSubmit={this.onSubmit}
          isSubmitting={false}
        >
          {props => {
            const {
              values,
              touched,
              errors,
              handleBlur,
              handleSubmit,
              isSubmitting,
              handleChange
            } = props;
            return (
              <div>
                <Form onSubmit={handleSubmit}>
                  <div className="container">
                    <div className="card card-default">
                      <div className="card-header">
                        <h2>{this.props.headline}</h2>
                      </div>
                      <div className="card-body">
                        <div className="form-group">
                          <label>Name</label>
                          <Field
                            value={values.name}
                            id="name"
                            type="text"
                            className={
                              errors.name && touched.name
                                ? "text-input error form-control"
                                : "text-input form-control"
                            }
                          />
                          {errors.name && touched.name && (
                            <span className="input-feedback">
                              {errors.name}
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label>Summary</label>
                          <Field
                            value={values.summary}
                            className={
                              errors.summary && touched.summary
                                ? "text-input error form-control"
                                : "text-input form-control"
                            }
                            id="summary"
                            onBlur={handleBlur}
                            type="text"
                          />
                          {errors.summary && touched.summary && (
                            <span className="input-feedback">
                              {errors.summary}
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label>Headline</label>
                          <Field
                            value={values.headline}
                            className={
                              errors.headline && touched.headline
                                ? "text-input error form-control"
                                : "text-input form-control"
                            }
                            id="headline"
                            onBlur={handleBlur}
                            type="text"
                          />
                          {errors.headline && touched.headline && (
                            <span className="input-feedback">
                              {errors.headline}
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label>Description</label>
                          <Field
                            value={values.description}
                            className={
                              errors.description && touched.description
                                ? "text-input error form-control"
                                : "text-input form-control"
                            }
                            id="description"
                            onBlur={handleBlur}
                          />
                          {errors.description && touched.description && (
                            <span className="input-feedback">
                              {errors.description}
                            </span>
                          )}
                        </div>
                        {this.state.venueOptions.length > 0 && (
                          <div className="form-group">
                            <label>Venue</label>
                            <select
                              value={values.venueId}
                              className={
                                errors.venueId && touched.venueId
                                  ? "text-input error form-control"
                                  : "text-input form-control"
                              }
                              id="venueId"
                              onBlur={handleBlur}
                              type="text"
                              onChange={handleChange}
                            >
                              {this.state.venueOptions}
                            </select>
                            {errors.venueId && touched.venueId && (
                              <span className="input-feedback">
                                {errors.venueId}
                              </span>
                            )}
                          </div>
                        )}
                        <div className="form-group">
                          <label>License</label>
                          <Field
                            value={values.license}
                            className={
                              errors.license && touched.license
                                ? "text-input error form-control"
                                : "text-input form-control"
                            }
                            onBlur={handleBlur}
                            id="license"
                            type="text"
                          />
                          {errors.license && touched.license && (
                            <span className="input-feedback">
                              {errors.license}
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label>Free Event?</label>
                          <div>
                            <input
                              id="isFree"
                              name="isFree"
                              type="radio"
                              value={true}
                              checked={this.state.isFree === true}
                              onChange={this.handleRadio}
                            />
                            &nbsp;&nbsp; Yes
                          </div>
                          <div>
                            <input
                              id="isFree"
                              name="isFree"
                              type="radio"
                              value={false}
                              checked={this.state.isFree === false}
                              onChange={this.handleRadio}
                            />
                            &nbsp;&nbsp; No
                          </div>
                          {errors.isFree && touched.isFree && (
                            <span className="input-feedback">
                              {errors.isFree}
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label>Setup Time</label>
                          <Field
                            className={
                              errors.setupDate && touched.setupDate
                                ? "date-input error form-control"
                                : "date-input form-control"
                            }
                            onBlur={handleBlur}
                            id="setupDate"
                            type="date"
                            //onChange={this.handleDates}
                            value={values.setupDate}
                          />
                          <Field
                            className={
                              errors.setupTime && touched.setupTime
                                ? "text-input error form-control"
                                : "text-input form-control"
                            }
                            onBlur={handleBlur}
                            id="setupTime"
                            type="time"
                            value={values.setupTime}
                          />
                          {errors.setupTime && touched.setupTime && (
                            <span className="input-feedback">
                              {errors.setupTime}
                              {"  "}
                            </span>
                          )}
                          {errors.setupDate && touched.setupDate && (
                            <span className="input-feedback">
                              {errors.setupDate}
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label>Date Start</label>
                          <Field
                            className={
                              errors.startDate && touched.startDate
                                ? "text-input error form-control"
                                : "text-input form-control"
                            }
                            onBlur={handleBlur}
                            id="startDate"
                            type="date"
                            value={values.startDate}
                          />

                          <Field
                            className={
                              errors.startTime && touched.startTime
                                ? "text-input error form-control"
                                : "text-input form-control"
                            }
                            onBlur={handleBlur}
                            id="startTime"
                            type="time"
                            value={values.startTime}
                          />
                          {errors.startTime && touched.startTime && (
                            <span className="input-feedback">
                              {errors.startTime}
                              {"  "}
                            </span>
                          )}
                          {errors.startDate && touched.startDate && (
                            <span className="input-feedback">
                              {errors.startDate}
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label>Date End</label>
                          <Field
                            className={
                              errors.endDate && touched.endDate
                                ? "text-input error form-control"
                                : "text-input form-control"
                            }
                            onBlur={handleBlur}
                            id="endDate"
                            type="date"
                            value={values.endDate}
                          />
                          <Field
                            className={
                              errors.endTime && touched.endTime
                                ? "text-input error form-control"
                                : "text-input form-control"
                            }
                            onBlur={handleBlur}
                            id="endTime"
                            type="time"
                            value={values.endTime}
                          />
                          {errors.endTime && touched.endTime && (
                            <span className="input-feedback">
                              {errors.endTime}
                              {"  "}
                            </span>
                          )}
                          {errors.endDate && touched.endDate && (
                            <span className="input-feedback">
                              {errors.endDate}
                            </span>
                          )}
                        </div>
                        <div className="form-group">
                          <label>Select Promotion Account</label>
                          <select
                            value={values.promoterId}
                            className={
                              errors.promoterId && touched.promoterId
                                ? "text-input error form-control"
                                : "text-input form-control"
                            }
                            onBlur={handleBlur}
                            id="promoterId"
                            type="text"
                            onChange={handleChange}
                          >
                            {this.state.promoterOptions}
                          </select>
                          {errors.promoterId && touched.promoterId && (
                            <span className="input-feedback">
                              {errors.promoterId}
                            </span>
                          )}
                        </div>
                        <button
                          className="btn btn-primary"
                          type="submit"
                          disabled={isSubmitting}
                        >
                          Submit
                        </button>
                        &nbsp;
                      </div>
                    </div>
                  </div>
                </Form>
              </div>
            );
          }}
        </Formik>
      </div>
    );
  }
}

EventForm.propTypes = {
  id: PropTypes.number,
  onSubmit: PropTypes.func.isRequired,
  headline: PropTypes.string,
  editData: PropTypes.object
};

export default EventForm;
