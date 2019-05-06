import axios from "axios";
import * as serviceHelper from "./serviceHelpers";

const apiRoot = serviceHelper.API_HOST_PREFIX + "/api/images";

const getPaginatedImages = entityTypeId => {
  const apiSuffix = "/entityType/" + entityTypeId + "?pageIndex=0&pageSize=6";

  const config = {
    method: "GET",
    url: apiRoot + apiSuffix,
    crossdomain: true,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};

const getByEntityIdType = payload => {
  const apiSuffix = "/" + payload.entityId + "/" + payload.entityTypeId

  const config = {
    method: "GET",
    url: apiRoot + apiSuffix,
    crossdomain: true,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
}

const uploadImage = payload => {
  const config = {
    method: "POST",
    url: apiRoot,
    crossdomain: true,
    withCredentials: true,
    data: payload,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};
const updateUrl = payload => {
  const config = {
    method: "PUT",
    url: apiRoot + "/url",
    data: payload,
    crossdomain: true,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
};
const deleteImg = id => {
  const config = {
    method: "Delete",
    url: apiRoot + "/" + id,
    crossdomain: true,
    withCredentials: true,
    headers: {
      "Content-Type": "application/json"
    }
  };
  return axios(config)
    .then(() => id)
    .catch(serviceHelper.onGlobalError);
};

const update = payload => {
  const config = {
    method: "PUT",
    url: apiRoot + "/" + payload.id,
    crossdomain: true,
    withCredentials: true,
    data: payload,
    headers: {
      "Content-Type": "application/json"
    }
  }
  return axios(config)
    .then(serviceHelper.onGlobalSuccess)
    .catch(serviceHelper.onGlobalError);
}

export {
  getPaginatedImages,
  uploadImage,
  updateUrl,
  deleteImg,
  update,
  getByEntityIdType
};