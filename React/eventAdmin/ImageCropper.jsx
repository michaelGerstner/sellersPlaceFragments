import React, { Component } from "react";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import PropTypes from "prop-types";

class ImageCropper extends Component {
  state = {};

  onImageLoaded = image => {
    this.imageRef = image;
  };

  onCropComplete = (crop, pixelCrop) => {
    this.makeClientCrop(crop, pixelCrop);
  };

  async makeClientCrop(crop, pixelCrop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImage = await this.getCroppedImg(
        this.imageRef,
        pixelCrop,
        "newFile.jpeg"
      );
      this.props.croppedToParent({ croppedImage });
    }
  }

  getCroppedImg(image, pixelCrop) {
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    const base64Image = canvas.toDataURL("image/jpeg");
    return base64Image;
  }
  render() {
    return (
      <div>
        {this.props.src && (
          <ReactCrop
            src={this.props.src}
            crop={this.props.crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.props.onCropChange}
          />
        )}
      </div>
    );
  }
}

ImageCropper.propTypes = {
  croppedToParent: PropTypes.func.isRequired, //put cropped image into State
  src: PropTypes.string, //Image source you want cropped
  onCropChange: PropTypes.func.isRequired, //Sets state of crop object w/ parameters being passed from parent
  crop: PropTypes.shape({
    aspect: PropTypes.number, //Forced ratio cropper, ex: 16 / 9 wide screen 1, square.
    height: PropTypes.number, //Initial height for cropper (Only width needed if aspect is being used)
    width: PropTypes.number, //Initial width for cropper
    x: PropTypes.number, //Initial x coordinate for center of cropper
    y: PropTypes.number //Initial y coordinate for center of cropper
  })
};

export default React.memo(ImageCropper);
