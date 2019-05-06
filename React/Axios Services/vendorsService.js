import axios from "axios";
import * as gHelper from "./serviceHelpers";

const vendorUrl = gHelper.API_NODE_HOST_PREFIX + "/api/vendors/";

const search = (searchTerm, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      gHelper.API_HOST_PREFIX +
      "/api/vendors/search?searchTerm=" +
      searchTerm +
      "&pageIndex=" +
      pageIndex +
      "&pageSize=" +
      pageSize,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};
const searchCity = (city, pageIndex, pageSize) => {
  //function obsolete
  const config = {
    method: "GET",
    url:
      gHelper.API_HOST_PREFIX +
      "/api/vendors/city?city=" +
      city +
      "&pageIndex=" +
      pageIndex +
      "&pageSize=" +
      pageSize,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const searchGeo = (lat, lng, radius, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      gHelper.API_HOST_PREFIX +
      "/api/vendors/geo?lat=" +
      lat +
      "&lng=" +
      lng +
      "&radius=" +
      radius +
      "&pageIndex=" +
      pageIndex +
      "&pageSize=" +
      pageSize,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};
const duoSearch = (lat, lng, radius, searchTerm, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      gHelper.API_HOST_PREFIX +
      "/api/vendors/searchduo?lat=" +
      lat +
      "&lng=" +
      lng +
      "&radius=" +
      radius +
      "&searchTerm=" +
      searchTerm +
      "&pageIndex=" +
      pageIndex +
      "&pageSize=" +
      pageSize,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalSuccess);
};
const getAll = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      gHelper.API_HOST_PREFIX +
      "/api/vendors?pageIndex=" +
      pageIndex +
      "&pageSize=" +
      pageSize,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalSuccess);
};

const getByEventId = eventId => {
  const config = {
    method: "GET",
    url: gHelper.API_HOST_PREFIX + "/api/vendors/event?eventId=" + eventId,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getByEventIdPaginated = (eventId, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url:
      gHelper.API_HOST_PREFIX +
      "/api/vendors/paged?eventId=" +
      eventId +
      "&pageIndex=" +
      pageIndex +
      "&pageSize=" +
      pageSize,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getByUserId = () => {
  const config = {
    method: "GET",
    url: gHelper.API_NODE_HOST_PREFIX + "/api/vendors/user",
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

const getVendors = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: gHelper.API_HOST_PREFIX + "/api/vendors/" + pageIndex + "/" + pageSize,
    withCredentials: true,
    crossdomain: true
  };
  return axios(config)
    .then(gHelper.onGlobalSuccess)
    .catch(gHelper.onGlobalError);
};

export {
  search,
  searchCity,
  searchGeo,
  duoSearch,
  getAll,
  getByEventId,
  getByEventIdPaginated,
};
