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

  // const clearSearch = () => {
  //   setSelectedTargetTenant(null);
  // };

  return (
    <div>
      {/* <div className="flex items-center">
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
      </div> */}
      <div className="table-container">
        <table>
          <tbody>
              <tr className="table-head">
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

export default TargetTenants;
