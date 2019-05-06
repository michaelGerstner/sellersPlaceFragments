import React from "react";
import PropTypes from "prop-types";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../Carousel.css";
import Style from "./EventsPublic.module.css";

function EventImageCollage(props) {
  function imageContainer(image) {
    if (!props.container) {
      let backgroundImage = "url(" + image.url.split(" ").join("%20") + ")";
      return (
        <div key={image.id} className={"col-xs-12 col-md-4" + Style.nopadding}>
          <div
            className={Style.eventImage}
            style={{
              backgroundImage: backgroundImage,
              height: "500px",
              width: "100%"
            }}
          />
        </div>
      );
    } else {
      return (
        <div className="col-xs-12 col-md-4 mt-1 mb-2" key={image.id}>
          <props.container image={image} history={props.history} />
        </div>
      );
    }
  }

  function createSlides(images) {
    images = shuffleArray(images);
    let slides = [];
    slides = images.map(imageContainer);
    return slides;
  }

  function shuffleArray(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;

    while (0 !== currentIndex) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  const settings = {
    dots: false,
    infinite: true,
    lazyLoad: true,
    adaptiveHeight: true,
    arrows: true,
    className: "center",
    slidesToShow: 1,
    slidesToScroll: 1,
    rows: 2,
    slidesPerRow: 3,
    responsive: [
      {
        breakpoint: 1000,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 2,
          slidesPerRow: 2
        }
      },
      {
        breakpoint: 800,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 2,
          slidesPerRow: 3
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          rows: 2,
          slidesPerRow: 2
        }
      }
    ]
  };
  return (
    <div className="col-12">
      <div className="col-12">
        <Slider {...settings}>{createSlides(props.images)}</Slider>
      </div>
    </div>
  );
}

EventImageCollage.propTypes = {
  images: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      url: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string
    })
  ),
  container: PropTypes.any,
  history: PropTypes.any
};

export default React.memo(EventImageCollage);
