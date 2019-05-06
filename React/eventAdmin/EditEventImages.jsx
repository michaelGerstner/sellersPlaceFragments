import React from "react";
import "react-image-crop/dist/ReactCrop.css";
import ImageCropper from "./ImageCropper";
import "../common/public/Home.module.css";
import PropTypes from "prop-types";
import "react-toastify/dist/ReactToastify.css";
import { Modal } from "reactstrap";
import Styles from "./EventImages.module.css";

function EditEventImages(props) {
  return (
    <Modal isOpen={props.isOpen} toggle={props.toggle} size="xl">
      <div className={Styles.container}>
        <h4>Add or Remove Photos</h4>
        <div className="col-xs-12 col-md-12">
          <div className="row">
            <div className="col-xs-12 col-md-4">
              <div className="row">
                <input
                  className="mb-2"
                  type="file"
                  onChange={props.onSelectImage}
                />
                <button
                  className="btn btn-info float-right mr-5"
                  onClick={props.toggle}
                >
                  Done
                </button>
              </div>
              {props.cropObj && props.cropObj.src && (
                <div className={Styles.imageCropper}>
                  <ImageCropper
                    src={props.cropObj.src}
                    crop={props.cropObj.crop}
                    croppedImg={props.cropObj.croppedImg}
                    onCropChange={props.onImageCrop}
                    croppedToParent={props.onImage}
                  />
                </div>
              )}
            </div>
            <div className="col-xs-12 col-md-8">
              {props.cropObj && props.cropObj.croppedImg && (
                <div className={Styles.cropObjPrev}>
                  <img
                    src={props.cropObj.croppedImg}
                    alt="Event"
                    style={{
                      width: "100%",
                      height: "100%",
                      cover: "fit"
                    }}
                  />
                  <button
                    className="btn btn-success"
                    style={{ width: "100%" }}
                    onClick={props.upload}
                  >
                    Add Image
                  </button>
                </div>
              )}
            </div>
            {props.imgDispArr && props.imgDispArr.length > 0 && (
              <div className={"col-xs-12 col-md-12 " + Styles.modal}>
                <div className="row">{props.imgDispArr}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

EditEventImages.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string.isRequired
    })
  }),
  history: PropTypes.any,
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string.isRequired
    })
  ),

  cropObj: PropTypes.shape({
    crop: PropTypes.shape({
      aspect: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired,
      x: PropTypes.number.isRequired,
      y: PropTypes.number.isRequired
    }),
    croppedImg: PropTypes.string,
    src: PropTypes.string
  }),

  imgDispArr: PropTypes.array,
  eventId: PropTypes.string.isRequired,
  toggle: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onImage: PropTypes.func.isRequired,
  onAddImage: PropTypes.func.isRequired,
  onImageCrop: PropTypes.func.isRequired,
  onSelectImage: PropTypes.func.isRequired,
  delete: PropTypes.func.isRequired,
  upload: PropTypes.func.isRequired
};

export default React.memo(EditEventImages);
