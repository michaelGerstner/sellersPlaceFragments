import React from "react";
import PropTypes from "prop-types";
import ImageCarousel from "../../common/public/events/ImageCollage";
import EditEventImages from "../EditEventImages";
import Styles from "../EventImages.module.css";
import logger from "../../../logger";
import * as filesService from "../../../services/filesService";
import * as imagesService from "../../../services/imagesService";
import { toast } from "react-toastify";

const _logger = logger.extend("mike");

class ImageGalleryCard extends React.PureComponent {
  state = {
    cropObj: {
      crop: {
        aspect: 0.95,
        width: 30,
        x: 0,
        y: 0
      },
      croppedImg: "",
      src: ""
    },
    imageEditOpen: false,
    imgObjArr: [],
    imgDispArr: []
  };

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      this.displayImages();
    }
  }

  displayImages = () => {
    const imgObjArr = this.props.images;
    let imgDispArr = [];
    if (imgObjArr !== null) {
      imgDispArr = imgObjArr.map(this.imageContainer);
    }
    this.setState({ imgObjArr, imgDispArr });
  };
  imageBackground(image) {
    const imgSrc = image.image.url;
    return (
      <div key={image.image.id} className="col-xs-12 col-md-4 ">
        <img className={Styles.carouselItem} src={imgSrc} alt="Event" />
      </div>
    );
  }

  uploadSucc = data => {
    _logger(data);
    const imagesArr = data.item;
    let urlsArr = [];
    for (var i = 0; i < imagesArr.length; i++) {
      if (imagesArr[i]) {
        urlsArr.push(imagesArr[i].url);
      }
    }
    const payload = this.addPayload(urlsArr[0]);
    imagesService
      .uploadImage(payload)
      .then(this.onAddImage)
      .catch(this.error);
  };

  addPayload = url => {
    let payload = {
      entityId: this.props.eventId,
      entityTypeId: 7,
      url: url,
      title: "Event #" + this.props.eventId + " Image",
      description: ""
    };
    return payload;
  };

  imageContainer = image => {
    return (
      <div key={image.id} className={Styles.cropObjPrev}>
        <img
          id={image.id}
          src={image.url}
          alt="Event"
          style={{
            width: "100%",
            height: "100%",
            cover: "fit"
          }}
        />
        <button
          id={image.id}
          className="btn btn-danger"
          style={{ width: "100%", objectFit: "contain" }}
          onClick={this.delete}
        >
          Delete
        </button>
      </div>
    );
  };

  onAddImage = data => {
    _logger(data);
    toast("Image successfuly uploaded");
    let newImage = this.addPayload(this.state.cropObj.croppedImg);
    newImage.id = data.item;
    const imgObjArr = [...(this.state.imgObjArr || [])];
    imgObjArr.push(newImage);
    const imgDispArr = [...(this.state.imgDispArr || [])];
    imgDispArr.push(this.imageContainer(newImage));
    this.setState({ imgDispArr, imgObjArr });
  };

  onImage = croppedImg => {
    const cropObj = {
      ...this.state.cropObj,
      croppedImg: croppedImg.croppedImage
    };
    this.setState({ cropObj });
  };

  error = data => {
    _logger(data);
  };

  onImageCrop = crop => {
    const cropObj = {
      ...this.state.cropObj,
      crop
    };
    this.setState({ cropObj });
  };

  onSelectImage = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        const cropObj = { ...this.state.cropObj, src: reader.result };
        this.setState({ cropObj });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
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
        mime = arr[0].match(/:(.*?);/)[1], //grabs image/jpeg from the string (grabs the mime or type)
        bstr = atob(arr[1]), //Window atob( ) Method. The Window atob() method is used for decoding a base-64 encoded string. It is used to decode a string of data which has been encoded using the btoa() method. It returns a string which represents the decoded string.
        n = bstr.length, // length of atob
        u8arr = new Uint8Array(n); // typed array represents an array of 8-bit unsigned integers. The contents are initialized to 0. Once established, you can reference elements in the array using the object's methods, or using standard array index syntax
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

  delete = e => {
    imagesService
      .deleteImg(e.target.id)
      .then(this.localDelete)
      .catch(this.error);
  };

  localDelete = data => {
    toast("Image successfully deleted");
    const tempImgDispArr = [...this.state.imgDispArr];
    const tempImgObjArr = [...this.state.imgObjArr];
    const imgDispArr = tempImgDispArr.filter(function(value) {
      return Number(value.key) !== Number(data);
    });
    const imgObjArr = tempImgObjArr.filter(function(value) {
      return Number(value.id) !== Number(data);
    });
    this.setState({ imgDispArr, imgObjArr });
  };

  upload = () => {
    filesService
      .uploadFile(this.urlsToFile(this.state.cropObj.croppedImg))
      .then(this.uploadSucc)
      .catch(this.error);
  };

  toggleImagesModal = () => {
    this.setState(prevState => ({ imageEditOpen: !prevState.imageEditOpen }));
  };
  render() {
    return (
      <div className="col-xl-12">
        <div className="card border-primary mb-3">
          <div className="card-header text-white bg-primary">
            Images
            <button
              className="float-right btn btn-xs btn-pill-left bg-secondary"
              onClick={this.toggleImagesModal}
            >
              Edit Images
            </button>
          </div>
          <div className={"card-body " + Styles.carouselContainer}>
            {this.props.mainImage && this.props.mainImage.url ? (
              <a onClick={this.props.toEditMain}>
                <img
                  id={this.props.mainImage.id}
                  value={this.props.eventId}
                  src={this.props.mainImage.url}
                  alt="Cover"
                  className={this.props.eventId}
                  style={{ width: "100%", height: "auto" }}
                />
              </a>
            ) : (
              <div>
                <p className="card-text">
                  <strong>
                    Oh no! It looks like you currently do not have an event
                    cover photo. Please click on the button below to add one!
                  </strong>
                </p>
                <button
                  className="btn btn-primary"
                  id={this.props.eventId}
                  onClick={this.props.toMakeMain}
                >
                  Add Cover Image
                </button>
              </div>
            )}
            {this.state.imgObjArr && this.state.imgObjArr.length > 0 && (
              <ImageCarousel
                images={this.state.imgObjArr}
                container={this.imageBackground}
              />
            )}
            {this.state.imageEditOpen && (
              <EditEventImages
                isOpen={this.state.imageEditOpen}
                toggle={this.toggleImagesModal}
                images={this.state.imgObjArr}
                eventId={this.props.eventId}
                onSelectImage={this.onSelectImage}
                onImage={this.onImage}
                onAddImage={this.onAddImage}
                onImageCrop={this.onImageCrop}
                delete={this.delete}
                imgDispArr={this.state.imgDispArr}
                cropObj={this.state.cropObj}
                upload={this.upload}
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

ImageGalleryCard.propTypes = {
  mainImage: PropTypes.shape({
    id: PropTypes.number.isRequired,
    url: PropTypes.string.isRequired
  }),
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired
    })
  ),
  toEditMain: PropTypes.func.isRequired,
  toMakeMain: PropTypes.func.isRequired,
  buttonDisplay: PropTypes.bool,
  onClick: PropTypes.func,
  eventId: PropTypes.string.isRequired
};

export default ImageGalleryCard;
