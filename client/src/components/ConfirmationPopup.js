import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'
import {Link} from 'react-router-dom'



const ConfirmationPopup = ({
    finalResponse,
    formResponses,
    backEndErrors
}) => {

    const tenantName = formResponses[0].response[0].tenantFriendlyName
    const backUpName = formResponses[2].response

  return (
    <div className="popup-bg">
        <div className="popup-container">
        {console.log(formResponses)}
        {console.log(finalResponse)}
            <h3>Back Up Summary</h3>
            {finalResponse === null ? (
                <div id="loading-spinner">
                    <div className="loading"></div>
                </div> 
            ) : (
                finalResponse && finalResponse.length > 0 ? (
                    <div>
                        <p className="my-2"><strong>Selected Tenant: </strong> {tenantName}</p>
                        <ul className="">
                            <li><strong>Policies successfully backed up [{finalResponse.length}]:</strong></li>
                        {finalResponse.map((item, index) => (
                            <li key={index}>{item} <FontAwesomeIcon icon={faCheckCircle} className="ml-1" /></li>
                        ))}
                        </ul>
                        <ul>
                            <li><strong>Back Up name: </strong>{backUpName}</li>
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


            <div className="footer mt-3">
                <Link to="/" className="btn cyan-btn">Home</Link>
            </div>
        </div>
    </div>
  )
}

export default ConfirmationPopup