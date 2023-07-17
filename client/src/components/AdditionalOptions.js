import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/free-regular-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const AdditionalOptions = ({
  selectedChoices,
  handleChoiceChange,
  pre,
  next
}) => {
  return (
    <div className="additional-options">
      {/* Question 1 */}
      <div className="additional-option-1">
        <h4>Restore original assignments (all policy types, default yes)</h4>
        <label>
          <input
            type="radio"
            name="question1"
            checked={selectedChoices[0]}
            onChange={() => handleChoiceChange(0, true)}
          />
          {selectedChoices[0] ? (
            <FontAwesomeIcon icon={faCheckCircle} />
          ) : (
            <FontAwesomeIcon icon={faCircle} />
          )}{' '}
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="question1"
            checked={!selectedChoices[0]}
            onChange={() => handleChoiceChange(0, false)}
          />
          {!selectedChoices[0] ? (
            <FontAwesomeIcon icon={faCheckCircle} />
          ) : (
            <FontAwesomeIcon icon={faCircle} />
          )}{' '}
          No
        </label>
      </div>

      {/* Question 2 */}
      <div className="additional-option-2">
        <h4>Restore non-standard applications (only Conditional Access policy type, default yes)</h4>
        <label>
          <input
            type="radio"
            name="question2"
            checked={selectedChoices[1]}
            onChange={() => handleChoiceChange(1, true)}
          />
          {selectedChoices[1] ? (
            <FontAwesomeIcon icon={faCheckCircle} />
          ) : (
            <FontAwesomeIcon icon={faCircle} />
          )}{' '}
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="question2"
            checked={!selectedChoices[1]}
            onChange={() => handleChoiceChange(1, false)}
          />
          {!selectedChoices[1] ? (
            <FontAwesomeIcon icon={faCheckCircle} />
          ) : (
            <FontAwesomeIcon icon={faCircle} />
          )}{' '}
          No
        </label>
      </div>

      {/* Question 3 */}
      <div className="additional-option-3">
        <h4>Restore policy in disabled state (only conditional access policy type, default yes)</h4>
        <label>
          <input
            type="radio"
            name="question3"
            checked={selectedChoices[2]}
            onChange={() => handleChoiceChange(2, true)}
          />
          {selectedChoices[2] ? (
            <FontAwesomeIcon icon={faCheckCircle} />
          ) : (
            <FontAwesomeIcon icon={faCircle} />
          )}{' '}
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="question3"
            checked={!selectedChoices[2]}
            onChange={() => handleChoiceChange(2, false)}
          />
          {!selectedChoices[2] ? (
            <FontAwesomeIcon icon={faCheckCircle} />
          ) : (
            <FontAwesomeIcon icon={faCircle} />
          )}{' '}
          No
        </label>
      </div>

      {/* Question 4 */}
      <div className="additional-option-4">
        <h4>Restore original location information (only conditional access policy type, default yes)</h4>
        <label>
          <input
            type="radio"
            name="question4"
            checked={selectedChoices[3]}
            onChange={() => handleChoiceChange(3, true)}
          />
          {selectedChoices[3] ? (
            <FontAwesomeIcon icon={faCheckCircle} />
          ) : (
            <FontAwesomeIcon icon={faCircle} />
          )}{' '}
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="question4"
            checked={!selectedChoices[3]}
            onChange={() => handleChoiceChange(3, false)}
          />
          {!selectedChoices[3] ? (
            <FontAwesomeIcon icon={faCheckCircle} />
          ) : (
            <FontAwesomeIcon icon={faCircle} />
          )}{' '}
          No
        </label>
      </div>

      {/* Render choice summary */}
      {/* {renderChoiceSummary()} */}

      <div className="mt-6 gap-3 flex">
        <button onClick={pre} className="btn slate-btn">Previous</button>
        <button onClick={next} className="btn cyan-btn">Next</button>
      </div>
    </div>
  );
};

export default AdditionalOptions;
