// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faCheckCircle } from '@fortawesome/free-solid-svg-icons'

// const TargetTenants = ({
//     targetTenants,
//     targetTenantQuery,
//     setTargetTenantQuery,
//     selectedTargetTenants,
//     setSelectedTargetTenants,
// }) => {

//     const targetTenantClick = (e) => {
        
//         const tenantNameNode = e.target.parentNode?.childNodes[1];
//         if (tenantNameNode && tenantNameNode.classList.contains('tenant-name')) {
//           const tenantFriendlyName = tenantNameNode.innerText;
//           const tenantId = e.target.parentNode?.childNodes[0]?.innerText;
//           const updatedTenant = { tenantFriendlyName, clientTenantId: tenantId };
      
//           if (selectedTargetTenants.some(tenant => tenant.tenantFriendlyName === tenantFriendlyName)) {
//             setSelectedTargetTenants(selectedTargetTenants.filter((tenant) => tenant.tenantFriendlyName !== tenantFriendlyName));
//           } else {
//             setSelectedTargetTenants([...selectedTargetTenants, updatedTenant]);
//           }
//           setTargetTenantQuery('');
//         }
//       };
      

//     const clearSearch = () => {
//         setSelectedTargetTenants([])
//     }

//     return (
//         <div>
//             <div className="flex items-center">
//                 <input
//                     className="flex w-[350px] focus:outline-sky-900 rounded-md light-grey-bg p-2 text-gray-700 mb-4 mt-4"
//                     type="text"
//                     placeholder="Search"
//                     value={targetTenantQuery}
//                     onChange={(e) => setTargetTenantQuery(e.target.value)}
//                 />
//                 <button className="btn navy-btn clear-btn" onClick={clearSearch}>
//                     Clear
//                 </button>
//             </div>
//             <div className="table-container">
//                 <table>
//                     <tbody>
//                         <tr>
//                             <td>Tenant ID</td>
//                             <td>Tenant Name</td>
//                             <td></td>
//                         </tr>
//                         {targetTenants.map((tenant) => (
//                             <tr
//                                 key={tenant.guid}
//                                 onClick={targetTenantClick}
//                                 className={`tenant-row cursor-pointer ${
//                                 selectedTargetTenants.some(selectedTenant => selectedTenant.tenantFriendlyName === tenant.tenantFriendlyName) ? 'selected' : ''
//                                 }`}
//                             >
//                                 <td className="tenant-id">{tenant.clientTenantId}</td>
//                                 <td className="tenant-name">{tenant.tenantFriendlyName}</td>
//                                 <td className="check-cell">
//                                 {selectedTargetTenants.some(selectedTenant => selectedTenant.tenantFriendlyName === tenant.tenantFriendlyName) ? (
//                                     <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
//                                 ) : null}
//                                 </td>
//                             </tr>
//                             ))}

//                         {targetTenants.length === 0 && (
//                             <tr>
//                                 <td>No tenants found</td>
//                                 <td></td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     )
// }

// export default TargetTenants






import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

const TargetTenants = ({
  targetTenants,
  targetTenantQuery,
  setTargetTenantQuery,
  selectedTargetTenant,
  setSelectedTargetTenant,
}) => {
  const targetTenantClick = (e) => {
    const tenantNameNode = e.target.parentNode?.childNodes[1];
    if (tenantNameNode && tenantNameNode.classList.contains('tenant-name')) {
      const tenantFriendlyName = tenantNameNode.innerText;
      const tenantId = e.target.parentNode?.childNodes[0]?.innerText;

      if (selectedTargetTenant?.tenantFriendlyName === tenantFriendlyName) {
        setSelectedTargetTenant(null); // Unselect the item
      } else {
        const updatedTenant = { tenantFriendlyName, clientTenantId: tenantId };
        setSelectedTargetTenant(updatedTenant); // Select the clicked item
      }

      setTargetTenantQuery('');
    }
  };

  const clearSearch = () => {
    setSelectedTargetTenant(null);
  };

  return (
    <div>
      <div className="flex items-center">
        <input
          className="flex w-[350px] focus:outline-sky-900 rounded-md light-grey-bg p-2 text-gray-700 mb-4 mt-4"
          type="text"
          placeholder="Search"
          value={targetTenantQuery}
          onChange={(e) => setTargetTenantQuery(e.target.value)}
        />
        <button className="btn navy-btn clear-btn" onClick={clearSearch}>
          Clear
        </button>
      </div>
      <div className="table-container">
        <table>
          <tbody>
            <tr>
              <td>Tenant ID</td>
              <td>Tenant Name</td>
              <td></td>
            </tr>
            {targetTenants.map((tenant) => (
              <tr
                key={tenant.guid}
                onClick={targetTenantClick}
                className={`tenant-row cursor-pointer ${
                  selectedTargetTenant?.tenantFriendlyName === tenant.tenantFriendlyName
                    ? 'selected'
                    : ''
                }`}
              >
                <td className="tenant-id">{tenant.clientTenantId}</td>
                <td className="tenant-name">{tenant.tenantFriendlyName}</td>
                <td className="check-cell">
                  {selectedTargetTenant?.tenantFriendlyName === tenant.tenantFriendlyName ? (
                    <FontAwesomeIcon icon={faCheckCircle} className="ml-2" />
                  ) : null}
                </td>
              </tr>
            ))}

            {targetTenants.length === 0 && (
              <tr>
                <td>No tenants found</td>
                <td></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TargetTenants

    //Timeline navigation
    // const next = () => {

    //     // if (formNo === 1) {
    //     //   let allTenants = selectedOption === 'All Tenants'
      
    //     //   if (!allTenants && selectedTargetTenants.length === 0) {
    //     //     toast.error('Please select at least one target tenant')
    //     //     return
    //     //   }
      
    //     //   let stepOneRes = { step: formNo, response: allTenants ? ['All Tenants'] : selectedTargetTenants }
      
    //     //   // Find the existing response for step 1 in the formResponses array
    //     //   const existingResponseIndex = formResponses.findIndex((response) => response.step === formNo)
      
    //     //   if (existingResponseIndex !== -1) {
    //     //     // If an existing response exists, replace it with the latest response
    //     //     const updatedResponses = [...formResponses]
    //     //     updatedResponses[existingResponseIndex] = stepOneRes
    //     //     setFormResponses(updatedResponses)
  
    //     //   } 
          
    //     //   else {
    //     //     // Otherwise, add the response to the array
    //     //     setFormResponses((prevFormResponses) => [...prevFormResponses, stepOneRes])
  
    //     //   }
  
    //     if (formNo === 1) {
    //       let allTenants = selectedOption === 'All Tenants';
      
    //       if (!allTenants && !selectedTargetTenant) {
    //         toast.error('Please select a target tenant');
    //         return;
    //       }
      
    //       let stepOneRes = { step: formNo, response: allTenants ? ['All Tenants'] : [selectedTargetTenant] };
      
    //       // Find the existing response for step 1 in the formResponses array
    //       const existingResponseIndex = formResponses.findIndex((response) => response.step === formNo);
      
    //       if (existingResponseIndex !== -1) {
    //         // If an existing response exists, replace it with the latest response
    //         const updatedResponses = [...formResponses];
    //         updatedResponses[existingResponseIndex] = stepOneRes;
    //         setFormResponses(updatedResponses);
    //       } else {
    //         // Otherwise, add the response to the array
    //         setFormResponses((prevFormResponses) => [...prevFormResponses, stepOneRes]);
    //       }
  
  
  
    //       //Get clientTenantId so it can be passed
    //       const ctId = stepOneRes.response[0].clientTenantId
    //       setData([])
  
    //       const policyRequest = async () => {
  
    //         setLoadingState(true)
    //         const response = await fetch(`http://localhost:4040/list-policies`, {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //               },
    //             mode: 'cors',
    //             body: JSON.stringify({ ctId })
    //         })
        
    //         const json = await response.json()
    //         console.log(json)
  
    //         //reset policies so state can be repopulated with policies based on clientTenantID 
    //         // setData([])
    //         setData(json)
    //         setLoadingState(false)
            
    //         }
  
    //         policyRequest()
    //         //send post request containing selected tenants to get data to populate policy picker            
  
    //       setFormNo(formNo + 1)
    //       console.log(formResponses)
  
    //     } else if (formNo === 2) {
    //       if (selectedObjects.length === 0) {
    //         toast.error('Please select at least one policy')
    //         return
    //       }
      
    //       let stepTwoRes = { step: formNo, response: selectedObjects }
      
    //       // Find the existing response for step 1 in the formResponses array
    //       const existingResponseIndex = formResponses.findIndex((response) => response.step === formNo)
      
    //       if (existingResponseIndex !== -1) {
    //         // If an existing response exists, replace it with the latest response
    //         const updatedResponses = [...formResponses]
    //         updatedResponses[existingResponseIndex] = stepTwoRes
    //         setFormResponses(updatedResponses)
    //       } else {
    //         // Otherwise, add the response to the array
    //         setFormResponses((prevFormResponses) => [...prevFormResponses, stepTwoRes])
    //       }
      
    //       setFormNo(formNo + 1)
    //       console.log(formResponses)
    //     } else {
    //       toast.error('Please complete all input fields')
    //     }
    //   }
