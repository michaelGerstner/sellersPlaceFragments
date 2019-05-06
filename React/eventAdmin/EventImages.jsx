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

class EventImages extends Component {
  state = {
    banner: {
      crop: {
        aspect: 16.3 / 5.5,
        width: 50,
        x: 0,
        y: 0
      },
      croppedImg: "",
      src: ""
    },
    basic: {
      crop: {
        aspect: 0.95,
        width: 30,
        x: 0,
        y: 0
      },
      croppedImg: "",
      src: ""
    },
    bannerImageUploaded: false,
    uploaderText: "Choose Cover Image",
    imagesArr: [],
    bannerImageUrl: "",
    imgUrls: [],
    imgArrayDisp: []
  };

  onSelectImage = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        if (this.state.bannerImageUploaded === false) {
          const banner = { ...this.state.banner, src: reader.result };
          this.setState({ banner });
        } else {
          const basic = { ...this.state.basic, src: reader.result };
          this.setState({ basic });
        }
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onBannerComplete = croppedImg => {
    const banner = {
      ...this.state.banner,
      croppedImg: croppedImg.croppedImage
    };
    this.setState({ banner });
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

  onBannerCrop = crop => {
    const banner = { ...this.state.banner, crop };
    this.setState({ banner });
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
      const file = new File([u8arr], "eventImage", {
        type: mime
      });
      formData.append("files", file, "eventImage");
    }
    return formData;
  };

  upload = () => {
    let data = "";
    if (!this.state.bannerImageUploaded) {
      data = this.urlsToFile(this.state.banner.croppedImg);
    } else if (this.state.bannerImageUploaded) {
      data = this.urlsToFile(this.state.basic.croppedImg);
    }
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

  bannerPayload = url => {
    let payload = {
      entityId: this.props.match.params.id,
      entityTypeId: 12,
      url: url,
      title: "Event #" + this.props.match.params.id + " Primary Image",
      description: ""
    };
    return payload;
  };

  basicPayload = url => {
    let payload = {
      entityId: this.props.match.params.id,
      entityTypeId: 7,
      url: url,
      title: "Event #" + this.props.match.params.id + " Image",
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

    if (!this.state.bannerImageUploaded) {
      const payload = this.bannerPayload(urlsArr[0]);
      imagesService
        .uploadImage(payload)
        .then(this.toBasicImgs)
        .catch(this.error);
    } else {
      const payload = this.basicPayload(urlsArr[0]);
      imagesService
        .uploadImage(payload)
        .then(this.onAddImage)
        .catch(this.error);
    }
  };

  toBasicImgs = () => {
    const uploaderText = "Add additional images";
    toast("Image successfuly uploaded");
    this.setState({
      bannerImageUploaded: true,
      uploaderText
    });
  };

  onAddImage = () => {
    toast("Image successfuly uploaded");
    const imgUrls = [...this.state.imgUrls];
    const imgArrayDisp = [...this.state.imgArrayDisp];
    imgUrls.push(this.state.basic.croppedImg);
    imgArrayDisp.push(
      <div key={imgArrayDisp.length + 1}>
        <div className={Styles.basicPrev}>
          <img
            src={this.state.basic.croppedImg}
            alt="Event"
            style={{
              width: "100%",
              height: "100%",
              cover: "fit"
            }}
          />
        </div>
      </div>
    );
    this.setState({ imgArrayDisp, imgUrls });
  };

  nextPage = () =>
    this.props.history.push(
      "/admin/events/links/" + this.props.match.params.id
    );

  render() {
    const backgroundImage =
      "url(" + this.state.banner.croppedImg.split(" ").join("%20") + ")";
    return (
      <div className="col-12 ml-3">
        <h4>{this.state.uploaderText}</h4>
        <div className="row">
          <input type="file" onChange={this.onSelectImage} />
          {!this.state.bannerImageUploaded && this.state.banner.croppedImg && (
            <button
              className="btn btn-info mr-4"
              type="button"
              onClick={this.upload}
            >
              Save banner image
            </button>
          )}
          <div className="col-xs-12 col-md-3">
            {this.state.bannerImageUploaded && this.state.basic.croppedImg && (
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
              onClick={this.nextPage}
            >
              Next
            </button>
          </div>
        </div>

        {!this.state.bannerImageUploaded && (
          <div>
            <div className="layout-h" style={{ marginTop: "3%" }}>
              <div className={Styles.containing}>
                <div className="row">
                  <div className="col-xs-12 col-xl-12">
                    <div className={Styles.fiveHeight}>
                      {this.state.banner.croppedImg && (
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
        {this.state.banner.src && !this.state.bannerImageUploaded && (
          <div className="row">
            <div className="col-10 mt-3 align-center">
              <ImageCropper
                src={this.state.banner.src}
                crop={this.state.banner.crop}
                croppedImg={this.state.banner.croppedImg}
                onCropChange={this.onBannerCrop}
                croppedToParent={this.onBannerComplete}
              />
            </div>
          </div>
        )}
        {this.state.bannerImageUploaded && (
          <div>
            {this.state.basic.src && (
              <div className="col-12 mt-3">
                <div className="row">
                  <div className="col-4 mt-1">
                    <ImageCropper
                      src={this.state.basic.src}
                      crop={this.state.basic.crop}
                      croppedImg={this.state.basic.croppedImg}
                      onCropChange={this.onImageCrop}
                      croppedToParent={this.onImage}
                    />
                  </div>
                  {this.state.imgArrayDisp.length > 0 && (
                    <div className="col-8">
                      <div className="row">{this.state.imgArrayDisp}</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }
}

EventImages.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }),
  history: PropTypes.any
};

export default EventImages;
