import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMinusCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons'

const PolicyPicker = ({
  data,
  checkedItems,
  selectedObjects,
  showChildren,
  selectAll,
  handleParentCheckboxChange,
  handleChildCheckboxChange,
  handleSelectAll,
  handleDropdownToggle
}) => {
  return (
    <div>
      <div style={{ margin: '0 0 20px 0' }}>
      </div>
      <div className="nested-checkboxes">
        <div className="select-all-container">
          <label>
            <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
            &nbsp;&nbsp;Select all
          </label>
        </div>
        {Object.entries(data).map(([parentType, children]) => (
          <div key={parentType} className="parent-checkbox-container">
            <div className="parent-checkbox">
              <div className="parent-check-label">
                <label className="round">
                  <input
                    type="checkbox"
                    name={parentType}
                    checked={checkedItems[parentType] || false}
                    onChange={handleParentCheckboxChange}
                  />
                </label>
                &nbsp;&nbsp;{parentType}
              </div>
              <button onClick={() => handleDropdownToggle(parentType)}>
                {showChildren[parentType] ? (
                  <FontAwesomeIcon icon={faMinusCircle} />
                ) : (
                  <FontAwesomeIcon icon={faPlusCircle} />
                )}
              </button>
            </div>
            {showChildren[parentType] && (
              <ul className="checkbox-children">
                {Array.isArray(children) && children.length > 0 ? (
                  children.map((child) => (
                    <li key={child.id}>
                      <label className="round">
                        <input
                          type="checkbox"
                          name={child.id.toString()}
                          checked={checkedItems[child.id] || false}
                          onChange={handleChildCheckboxChange}
                        />
                      </label>
                      &nbsp;&nbsp;{child.displayName || child.name}
                    </li>
                  ))
                ) : (
                  <li>No children found.</li>
                )}
              </ul>
            )}
          </div>
        ))}
      </div>
      {/* <div style={{ marginTop: '40px' }}>Selected Objects: {JSON.stringify(selectedObjects)}</div> */}
    </div>
  );
};

export default PolicyPicker