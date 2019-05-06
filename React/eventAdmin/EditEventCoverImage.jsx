import React, { Component } from "react";
import "react-image-crop/dist/ReactCrop.css";
import ImageCropper from "./ImageCropper";
import "../common/public/Home.module.css";
import Styles from "./EventImages.module.css";
import PropTypes from "prop-types";
import * as filesService from "../../services/filesService";
import logger from "../../logger";
import * as imagesService from "../../services/imagesService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const _logger = logger.extend("mike");

class EditEventCoverImage extends Component {
  state = {
    cover: {
      crop: {
        aspect: 16.3 / 5.5,
        width: 50,
        x: 0,
        y: 0
      },
      croppedImg: "",
      src: ""
    },
    uploaderText:
      "Upload new cover photo (this will replace your current cover photo)",
    coverImageUrl: ""
  };

  onSelectImage = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const cover = { ...this.state.cover, src: reader.result };
        this.setState({ cover });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  oncoverComplete = croppedImg => {
    const cover = {
      ...this.state.cover,
      croppedImg: croppedImg.croppedImage
    };
    this.setState({ cover });
  };

  onImage = croppedImg => {
    const basic = {
      ...this.state.basic,
      croppedImg: croppedImg.croppedImage
    };
    this.setState({ basic });
  };

  onImageCrop = crop => {
    const basic = {
      ...this.state.basic,
      crop
    };
    this.setState({ basic });
  };

  oncoverCrop = crop => {
    const cover = { ...this.state.cover, crop };
    this.setState({ cover });
  };

  error = data => {
    _logger(data);
  };

  urlsToFile = urls => {
    let urlArr = [];
    if (typeof urls !== "object") {
      urlArr.push(urls);
    } else {
      urlArr = urls;
    }
    const formData = new FormData();
    for (var i = 0; i < urlArr.length; i++) {
      let arr = urlArr[i].split(","),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      const file = new File([u8arr], "event image", {
        type: mime
      });
      formData.append("files", file, "event image");
    }
    return formData;
  };

  upload = () => {
    const data = this.urlsToFile(this.state.cover.croppedImg);

    filesService
      .uploadFile(data)
      .then(this.uploadSucc)
      .catch(this.error);
  };

  uploadFile = data => {
    filesService
      .uploadFile(data)
      .then(this.uploadSucc)
      .catch(this.error);
  };

  payload = data => {
    const payload = {
      entityId: this.props.match.params.eventId,
      entityTypeId: 12,
      url: data,
      title: "Event #" + this.props.match.params.eventId + " Primary Image",
      description: ""
    };
    return payload;
  };

  uploadSucc = data => {
    _logger(data);
    const imagesArr = data.item;
    let urlsArr = [];
    for (var i = 0; i < imagesArr.length; i++) {
      if (imagesArr[i]) {
        urlsArr.push(imagesArr[i].url);
      }
    }

    if (Number(this.props.match.params.imageId) !== 0) {
      const payload = { id: this.props.match.params.imageId, url: urlsArr[0] };
      imagesService
        .updateUrl(payload)
        .then(this.onUpdateComplete)
        .catch(this.error);
    } else {
      const payload = this.payload(urlsArr[0]);
      imagesService
        .uploadImage(payload)
        .then(this.onUpdateComplete)
        .catch(this.error);
    }
  };

  onUpdateComplete = () => {
    toast("Photo uploaded successfully!");
    this.props.history.push(
      "/admin/promoters/events/" + this.props.match.params.eventId
    );
  };

  cancel = () =>
    this.props.history.push(
      "/admin/promoters/events/" + this.props.match.params.eventId
    );

  render() {
    const backgroundImage =
      "url(" + this.state.cover.croppedImg.split(" ").join("%20") + ")";
    return (
      <div className="col-12 ml-3">
        <h4>{this.state.uploaderText}</h4>
        <div className="row">
          <input type="file" onChange={this.onSelectImage} />
          {!this.state.coverImageUploaded && this.state.cover.croppedImg && (
            <button
              className="btn btn-info mr-4"
              type="button"
              onClick={this.upload}
            >
              Save cover image
            </button>
          )}
          <div className="col-xs-12 col-md-3">
            {this.state.coverImageUploaded && this.state.basic.croppedImg && (
              <div>
                <button
                  className="btn btn-info mr-4"
                  type="button"
                  onClick={this.upload}
                >
                  Add Image
                </button>
              </div>
            )}
            <button
              className="btn btn-info mr-4"
              type="button"
              onClick={this.cancel}
            >
              Cancel
            </button>
          </div>
        </div>

        {!this.state.coverImageUploaded && (
          <div>
            <div className="layout-h" style={{ marginTop: "3%" }}>
              <div className={Styles.containing}>
                <div className="row">
                  <div className="col-xs-12 col-xl-12">
                    <div className={Styles.fiveHeight}>
                      {this.state.cover.croppedImg && (
                        <div
                          className={Styles.cover}
                          style={{
                            height: "100%",
                            width: "auto",
                            backgroundImage: backgroundImage
                          }}
                        />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {this.state.cover.src && (
          <div className="row">
            <div className="col-10 mt-3 align-center">
              <ImageCropper
                src={this.state.cover.src}
                crop={this.state.cover.crop}
                croppedImg={this.state.cover.croppedImg}
                onCropChange={this.oncoverCrop}
                croppedToParent={this.oncoverComplete}
              />
            </div>
          </div>
        )}
      </div>
    );
  }
}

EditEventCoverImage.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      eventId: PropTypes.string,
      imageId: PropTypes.string
    })
  }),
  history: PropTypes.any
};

export default EditEventCoverImage;
