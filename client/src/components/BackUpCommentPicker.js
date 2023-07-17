import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const BackUpCommentPicker = ({
  dates,
  selectedDate,
  setSelectedDate,
}) => {
  const dateClick = (key, value) => {
    if (selectedDate && selectedDate.key === key) {
      setSelectedDate(null); // Unselect the date
    } else {
      const updatedDate = { key, value };
      setSelectedDate(updatedDate); // Select the clicked date
    }
  };

  return (
    <div>
      <div className="table-container">
        <table>
          <tbody>
            <tr className="table-head">
              <td>Comment Index</td>
              <td>Back Up Comment</td>
              <td></td>
            </tr>
            {Object.entries(dates).map(([key, value]) => (
                
              <tr
                key={key}
                onClick={() => dateClick(parseInt(key), value)}
                className={`date-row cursor-pointer ${
                  selectedDate && selectedDate.key === parseInt(key) ? 'selected' : ''
                }`}
              >
                <td className="date-key">{key}</td>
                <td className="date-value">{value}</td>
                <td className="check-cell">
                  {selectedDate && selectedDate.key === parseInt(key) ? (
                    <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
                  ) : null}
                </td>
              </tr>
            ))}

            {Object.keys(dates).length === 0 && (
              <tr>
                <td colSpan="3">No dates found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BackUpCommentPicker;
