import React from "react";
import PropTypes from "prop-types";
import eventStyles from "./EventsPublic.module.css";

function PaginationButtons(props) {
  return (
    <div>
      <nav>
        <ul className="pagination justify-content-center">
          <li className="page-item">
            {props.hasPrevious && (
              <button
                className={eventStyles.pageButtons}
                type="button"
                onClick={props.toPreviousPage}
              >
                <i className="fas fa-arrow-left" />
              </button>
            )}
          </li>
          <li className="page-item">
            {props.hasNext && (
              <button
                className={eventStyles.pageButtons}
                type="button"
                onClick={props.toNextPage}
              >
                <i className="fas fa-arrow-right" />
              </button>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}

PaginationButtons.propTypes = {
  hasNext: PropTypes.bool,
  hasPrevious: PropTypes.bool,
  toPreviousPage: PropTypes.func,
  toNextPage: PropTypes.func
};
export default React.memo(PaginationButtons);
