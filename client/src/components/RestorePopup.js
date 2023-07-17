import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom'



const RestorePopup = ({
    finalResponse,
    formResponses,
    backEndErrors,
    selectedDate
}) => {

    const sourceTenant = formResponses[0].response[0].tenantFriendlyName
    const destinationTenant = formResponses[2].response[0].tenantFriendlyName
    const r1 = formResponses[3].response[0] === true ? "Yes" : "No";
    const r2 = formResponses[3].response[1] === true ? "Yes" : "No";
    const r3 = formResponses[3].response[2] === true ? "Yes" : "No";
    const r4 = formResponses[3].response[3] === true ? "Yes" : "No";
    const r5 = formResponses[3].response[4] === true ? "Yes" : "No";

  return (
    
    <div className="popup-bg">
        <div className="popup-container">
        {console.log(formResponses)}
        {console.log(finalResponse)}
            <h3>Restore Summary</h3>
            {finalResponse === null ? (
                <div id="loading-spinner">
                    <div className="loading"></div>
                </div> 
            ) : (
                finalResponse && finalResponse.length > 0 ? (
                    <div>
                        <p className="my-2"><strong>Selected Tenant: </strong> {sourceTenant}</p>
                        <p className="my-2"><strong>Selected Backup: </strong> {selectedDate || 'Manual'}</p>
                        {/* <p className="my-2"><strong>Destination Tenant: </strong> {destinationTenant}</p> */}
                        <ul className="">
                            <li><strong>Policies successfully Restored [{finalResponse.length}]:</strong></li>
                        {finalResponse.map((item, index) => (
                            <li key={index}>{item.Data[0].name || item.Data[0].displayName} <FontAwesomeIcon icon={faCheckCircle} className="ml-1" /></li>
                        ))}
                        </ul>
                        <p className="mb-2"><strong>Additional settings:</strong></p>
                        <ul>
                            <li><strong>Restore non-standard applications (only Conditional Access policy type, default yes):</strong> {r1}</li>
                            <li><strong>Restore non-standard applications (only Conditional Access policy type, default yes):</strong> {r2}</li>
                            <li><strong>Restore policy in disabled state (only conditional access policy type, default yes):</strong> {r3}</li>
                            <li><strong>Restore original location information (only conditional access policy type, default yes):</strong> {r4}</li>
                            <li><strong>Restore compliance policy actions (default yes):</strong> {r5}</li>
                        </ul>
                    </div>
                ) : (
                    <p>Back Up data not available</p>
                )
                
            )}
            
            {backEndErrors && (
            <ul>
                <li><strong>Errors [{backEndErrors.length}]:</strong></li>
                {backEndErrors.map((err, index) => (
                <li key={index}>{err.message}</li>
                ))}
            </ul>
            )}

            {/* <ul>
                <li><strong>Back Up name: </strong>{backUpName}</li>
            </ul> */}
            <div className="footer mt-4">
                <Link to="/" className="btn cyan-btn">Home</Link>
            </div>
        </div>
    </div>
  )
}

export default RestorePopup

