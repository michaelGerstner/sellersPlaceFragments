import axios from "axios";
import * as gHelper from "./serviceHelpers";

const add = payload => {
  const config = {
    method: "POST",
    url: gHelper.API_NODE_HOST_PREFIX + "/api/events/",
    data: payload,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getAll = () => {
  const config = {
    method: "GET",
    url: gHelper.API_NODE_HOST_PREFIX + "/api/events/",
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getById = id => {
  const config = {
    method: "GET",
    url: gHelper.API_NODE_HOST_PREFIX + "/api/events/" + id,
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getAllPaginated = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: gHelper.API_HOST_PREFIX + "/api/events/" + pageIndex + "/" + pageSize,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const edit = payload => {
  const config = {
    method: "PUT",
    url: gHelper.API_NODE_HOST_PREFIX + "/api/events",
    withCredentials: true,
    data: payload,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getByUserId = () => {
  const config = {
    method: "GET",
    url: gHelper.API_NODE_HOST_PREFIX + "/api/events/user",
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getByPromoterId = (promoterId, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      gHelper.API_HOST_PREFIX +
      "/api/events?promoterId=" +
      promoterId +
      "&pageIndex=" +
      pageIndex +
      "&pageSize=" +
      pageSize,
    withCredentials: true,
    crossdomain: true,

    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getEventsByPromoterId = id => {
  const config = {
    method: "GET",
    url: gHelper.API_NODE_HOST_PREFIX + "/api/events/all/promoter/" + id,
    withCredentials: true,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getByVenueIdPaginated = (venueId, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      gHelper.API_NODE_HOST_PREFIX +
      "/api/events/" +
      venueId +
      "/" +
      pageIndex +
      "/" +
      pageSize,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getByPromoterIdV2 = promoterId => {
  const config = {
    method: "GET",
    url: gHelper.API_NODE_HOST_PREFIX + "/api/events/promoter/" + promoterId,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getDetails = eventId => {
  const config = {
    method: "GET",
    url: gHelper.API_HOST_PREFIX + "/api/events/details?eventId=" + eventId,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getByVendorId = (id, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      gHelper.API_HOST_PREFIX +
      "/api/events/vendor/" +
      id +
      "/" +
      pageIndex +
      "/" +
      pageSize,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getByUser = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      gHelper.API_HOST_PREFIX +
      "/api/events/vendors/" +
      pageIndex +
      "/" +
      pageSize,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getEventUrls = id => {
  const config = {
    method: "GET",
    url: gHelper.API_HOST_PREFIX + "/api/urls/events/" + id,
    crossdomain: true,
    withCredentials: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const insertEventUrls = (payload, id) => {
  const config = {
    method: "POST",
    url: gHelper.API_HOST_PREFIX + "/api/urls/events/xtr/" + id,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json"
    },
    data: payload
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const updateStatus = (id, eventStatusId) => {
  const config = {
    method: "PUT",
    url:
      gHelper.API_HOST_PREFIX +
      "/api/events/status/" +
      id +
      "/" +
      eventStatusId,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json"
    },
    data: eventStatusId
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const copyEvent = id => {
  const config = {
    method: "POST",
    url: gHelper.API_HOST_PREFIX + "/api/events/copy/" + id,
    crossdomain: true,
    headers: {
      "Content-Type": "application/json"
    },
    data: id
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

export {
  add,
  getAll,
  getById,
  getByUserId,
  edit,
  getAllPaginated,
  getByPromoterId,
  getEventsByPromoterId,
  getByVenueIdPaginated,
  getByPromoterIdV2,
  getDetails,
  getByVendorId,
  getByUser,
  getEventUrls,
  insertEventUrls,
  updateStatus,
  copyEvent
};
