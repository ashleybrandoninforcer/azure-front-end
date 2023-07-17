import { useState, useContext, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { v4 as uuidv4 } from 'uuid'

import TargetTenants from "../components/TargetTenants"
import DestinationTenants from "../components/DestinationTenants"
import PolicyPicker from '../components/PolicyPicker'
import AdditionalOptions from '../components/AdditionalOptions'
import DeployPopup from "../components/DeployPopup";

import { GlobalContext } from '../contexts/GlobalContext'

import Axios from 'axios'

const Deploy = () => {
  //Form Logic  
  const formArray = [1, 2, 3, 4, 5]
  const [formNo, setFormNo] = useState(formArray[0])

  // context API loading state
  const { loadingState, setLoadingState } = useContext(GlobalContext)


  //Policy picker
  const [checkedItems, setCheckedItems] = useState({})
  const [selectedObjects, setSelectedObjects] = useState([])
  const [data, setData] = useState([])
  const [showChildren, setShowChildren] = useState({})
  const [selectAll, setSelectAll] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState([])

  //Target tenants
  const [targetTenants, setTargetTenants] = useState([])
  const [targetTenantQuery, setTargetTenantQuery] = useState('')
  const [selectedTargetTenants, setSelectedTargetTenants] = useState([])
  const [selectedTargetTenant, setSelectedTargetTenant] = useState(null)

  //Destination tenants
  const [destinationTenants, setDestinationTenants] = useState([])
  const [destinationTenantQuery, setDestinationTenantQuery] = useState('')
  const [selectedDestinationTenants, setSelectedDestinationTenants] = useState([])
  const [selectedDestinationTenant, setSelectedDestinationTenant] = useState(null)

  //Additional options
  const [selectedChoices, setSelectedChoices] = useState([true, true, true, true])

  //Parse data for posting
  const [formResponses, setFormResponses] = useState([])

  //Final response
  const [finalResponse, setFinalResponse] = useState(null)
  const [backEndErrors, setBackEndErrors] = useState(null)
  const [openPopup, setOpenPopup] = useState(false)


  useEffect(() => {

    targetTenantSearch()
    destinationTenantSearch()

  }, [targetTenantQuery], [formResponses])


  const targetTenantSearch = async () => {
    try {
      setLoadingState(true)
      const response = await Axios.post('http://localhost:4040/list-tenants')

      const data = response.data.Data;
      console.log(data)
      setTargetTenants(data)
      // setTargetTenants(data.map(item => item.targetTenants))
console.log(targetTenants)
    } catch (error) {
      console.error('Error:', error);
    }

    finally {
      setLoadingState(false)
    }
  }

  const destinationTenantSearch = async () => {
    try {
      setLoadingState(true)
      const response = await Axios.post('http://localhost:4040/list-tenants')

      const data = response.data.Data;
      // console.log(data)
      setDestinationTenants(data)
      // setTargetTenants(data.map(item => item.targetTenants))

    } catch (error) {
      console.error('Error:', error);
    }

    finally {
      setLoadingState(false)
    }
  }

 

const handleParentCheckboxChange = (e) => {
  const { name, checked } = e.target
  const updatedCheckedItems = { ...checkedItems }
  const updatedShowChildren = { ...showChildren }

  updatedCheckedItems[name] = checked
  updatedShowChildren[name] = checked

  if (checked) {
    data[name].forEach((child) => {
      updatedCheckedItems[child.id] = true
      if (!selectedObjects.some((obj) => obj.id === child.id)) {
        setSelectedObjects((prevSelectedObjects) => [...prevSelectedObjects, child])
      }
    })
  } else {
    data[name].forEach((child) => {
      updatedCheckedItems[child.id] = false
      setSelectedObjects((prevSelectedObjects) =>
        prevSelectedObjects.filter((obj) => obj.id !== child.id)
      )
    })
  }

  setCheckedItems(updatedCheckedItems)
  setShowChildren(updatedShowChildren)

  checkParentCheckbox(name, updatedCheckedItems)

  const containsFalse = Object.values(updatedCheckedItems).includes(false)

  if (containsFalse === true) {
    setSelectAll(false)
  }
}

const handleChildCheckboxChange = (e) => {
  const { name, checked } = e.target
  const updatedCheckedItems = { ...checkedItems }

  updatedCheckedItems[name] = checked

  // const parentType = Object.keys(data).find((type) =>
  //   data[type].some((obj) => obj.id === parseInt(name))
  const parentType = Object.keys(data).find((type) =>
  data[type].some((obj) => obj.id.toString() === name)
  )

  if (checked) {
    // const selectedObject = data[parentType].find((obj) => obj.id === parseInt(name))
    const selectedObject = data[parentType].find((obj) => obj.id.toString() === name)
    setSelectedObjects((prevSelectedObjects) => [...prevSelectedObjects, selectedObject])
    
  } else {
    setSelectedObjects((prevSelectedObjects) =>
      prevSelectedObjects.filter((obj) => obj.id !== parseInt(name))
    )
  }

  setCheckedItems(updatedCheckedItems)

  checkParentCheckbox(parentType, updatedCheckedItems)

  const containsFalse = Object.values(updatedCheckedItems).includes(false)

  if (containsFalse === true) {
    setSelectAll(false)
  }
}

const checkParentCheckbox = (parentType, updatedCheckedItems) => {
  const allChildrenChecked = data[parentType].map((child) => updatedCheckedItems[child.id.toString()])
  updatedCheckedItems[parentType] = allChildrenChecked.every(Boolean)

  setCheckedItems(updatedCheckedItems)
}

const handleSelectAll = () => {
  const updatedCheckedItems = {}
  let updatedSelectedObjects = []

  if (!selectAll) {
    Object.entries(data).forEach(([parentType, children]) => {
      updatedCheckedItems[parentType] = true
      children.forEach((child) => {
        updatedCheckedItems[child.id] = true
        if (!updatedSelectedObjects.some((obj) => obj.id === child.id)) {
          updatedSelectedObjects.push(child)
        }
      })
    })

    setShowChildren({}) // Hide all dropdowns when select all is checked
  } else {
    // Uncheck all checkboxes when select all is unchecked
    Object.keys(updatedCheckedItems).forEach((key) => {
      updatedCheckedItems[key] = false
    })
  }

  setCheckedItems(updatedCheckedItems)
  setSelectedObjects(updatedSelectedObjects)
  setSelectAll(!selectAll)
}

const handleDropdownToggle = (parentType) => {
  if (parentType === 'selectAll') {
    return // Ignore dropdown toggle triggered by "Select All" checkbox
  }

  const updatedShowChildren = { ...showChildren }
  updatedShowChildren[parentType] = !showChildren[parentType]
  setShowChildren(updatedShowChildren)

  if (updatedShowChildren[parentType]) {
    setOpenDropdowns([...openDropdowns, parentType])
  } else {
    setOpenDropdowns(openDropdowns.filter((type) => type !== parentType))
  }
}


//Output responses for review on final step
  const renderDisplayValue = (response) => {
    if (response.step === 1) {
      return (
          <div>
           <p><strong>Source tenant: </strong></p>
            <ul>{response.response.map((tenants, index) => (
            <li key={index}>{tenants.tenantFriendlyName}</li>
            ))}</ul>
          </div>
        );
  } else if (response.step === 2) {
      let policyRes = response.response.map((policy) => policy.displayName || policy.name).join(", ")
      return (
        <p>
          <strong>Policies to deploy: </strong>
          <span>{policyRes}</span>
        </p>
      );
    } else if (response.step === 3) {
      return (
        <div>
          <p>
          <strong>Destination tenants: </strong>
        </p>
          <ul>{response.response.map((tenants, index) => (
            <li key={index}>{tenants.tenantFriendlyName}</li>
            ))}
        </ul>
        </div>

      );
    } else if (response.step === 4) {
      let r1 = response.response[0] === true ? "Yes" : "No";
      let r2 = response.response[1] === true ? "Yes" : "No";
      let r3 = response.response[2] === true ? "Yes" : "No";
      let r4 = response.response[3] === true ? "Yes" : "No";
      return (
        <div>
          <p className="mb-2"><strong>Additional settings:</strong></p>
          <ul>
            <li><strong>Restore non-standard applications (only Conditional Access policy type, default yes):</strong> {r1}</li>
            <li><strong>Restore non-standard applications (only Conditional Access policy type, default yes):</strong> {r2}</li>
            <li><strong>Restore policy in disabled state (only conditional access policy type, default yes):</strong> {r3}</li>
            <li><strong>Restore original location information (only conditional access policy type, default yes):</strong> {r4}</li>
          </ul>
        </div>
      );
    } else {
      // Handle string values separately
      if (typeof response.response === "string") {
        return <p>{response.response}</p>;
      } else {
        return <p>{response.response.join(", ")}</p>
      }
    }
  }

  const handleChoiceChange = (questionIndex, choiceIndex) => {
    const newSelectedChoices = selectedChoices.map((choice, index) =>
      index === questionIndex ? !choice : choice
    )
    setSelectedChoices(newSelectedChoices)
  }  


  //Timeline navigation
  const next = () => {

    if (formNo === 1) {

    
      if (!selectedTargetTenant) {
        toast.error('Please select a target tenant');
        return;
      }
  
      let stepOneRes = { step: formNo, response: [selectedTargetTenant] };
  
      // Find the existing response for step 1 in the formResponses array
      const existingResponseIndex = formResponses.findIndex((response) => response.step === formNo);
  
      if (existingResponseIndex !== -1) {
        // If an existing response exists, replace it with the latest response
        const updatedResponses = [...formResponses];
        updatedResponses[existingResponseIndex] = stepOneRes;
        setFormResponses(updatedResponses);
      } else {
        // Otherwise, add the response to the array
        setFormResponses((prevFormResponses) => [...prevFormResponses, stepOneRes]);
      }



        //Get clientTenantId so it can be passed
        const ctId = stepOneRes.response[0].clientTenantId
        setData([])

        const policyRequest = async () => {

          setLoadingState(true)
          const response = await fetch(`http://localhost:4040/list-policies`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
                },
              mode: 'cors',
              body: JSON.stringify({ ctId })
          })
      
          const json = await response.json()

          //reset policies so state can be repopulated with policies based on clientTenantID 
          // setData([])
          setData(json)
          setLoadingState(false)
          
          }

          policyRequest()
          //send post request containing selected tenants to get data to populate policy picker   
          // console.log(stepOneRes)

  
      setFormNo(formNo + 1)


    } else if (formNo === 2) {

        if (selectedObjects.length === 0) {
            toast.error('Please select at least one policy')
            return;
          }
  
          let stepTwoRes = { step: formNo, response: selectedObjects }
  
          // Find the existing response for step 1 in the formResponses array
          const existingResponseIndex = formResponses.findIndex(
            (response) => response.step === formNo
          );
      
          if (existingResponseIndex !== -1) {
            // If an existing response exists, replace it with the latest response
            const updatedResponses = [...formResponses]
            updatedResponses[existingResponseIndex] = stepTwoRes
            setFormResponses(updatedResponses)
          } else {
            // Otherwise, add the response to the array
            setFormResponses((prevFormResponses) => [...prevFormResponses, stepTwoRes])
          }
      
          setFormNo(formNo + 1)

    } else if (formNo === 3) {
    
        if (!selectedDestinationTenant) {
          toast.error('Please select a target tenant');
          return;
        }
    
        let stepThreeRes = { step: formNo, response: [selectedDestinationTenant] };
    
        // Find the existing response for step 1 in the formResponses array
        const existingResponseIndex = formResponses.findIndex((response) => response.step === formNo);
    
        if (existingResponseIndex !== -1) {
          // If an existing response exists, replace it with the latest response
          const updatedResponses = [...formResponses];
          updatedResponses[existingResponseIndex] = stepThreeRes;
          setFormResponses(updatedResponses);
        } else {
          // Otherwise, add the response to the array
          setFormResponses((prevFormResponses) => [...prevFormResponses, stepThreeRes]);
        }
    
        setFormNo(formNo + 1)

    } else if (formNo === 4) {
      let stepFourRes = { step: formNo, response: selectedChoices}
        


       // Find the existing response for step 1 in the formResponses array
       const existingResponseIndex = formResponses.findIndex(
        (response) => response.step === formNo
      )
  
      if (existingResponseIndex !== -1) {
        // If an existing response exists, replace it with the latest response
        const updatedResponses = [...formResponses]
        updatedResponses[existingResponseIndex] = stepFourRes
        setFormResponses(updatedResponses)
      } else {
        // Otherwise, add the response to the array
        setFormResponses((prevFormResponses) => [...prevFormResponses, stepFourRes])
      }


      setFormNo(formNo + 1)

    } else if (formNo === 5) {
        
      setFormNo(formNo + 1)
    } else {
      toast.error('Please complete all input fields')
    }
  }

  const pre = () => {
    setFormNo(formNo - 1)
  }

  const finalSubmit = () => {
    setOpenPopup(true)
      const clientTenantIdDeployFrom = +formResponses[0].response[0].clientTenantId
      const clientTenantIdDeployTo = +formResponses[2].response[0].clientTenantId
      const deployAssignments = formResponses[3].response[0]
      const deployNonStandardApplications = formResponses[3].response[1]
      const deployPolicyDisabled = formResponses[3].response[2]
      const deployLocations = formResponses[3].response[3]


      const deploymentBody = []

      formResponses[1].response.forEach( response => {
        const policyGUid = response.id
        const PolicyTypeId = response.PolicyTypeId

        const eachPolicy = {
          clientTenantIdDeployFrom,
          clientTenantIdDeployTo,
          policyGUid,
          PolicyTypeId,
          deployAssignments,
          deployNonStandardApplications,
          deployPolicyDisabled,
          deployLocations
        }

        deploymentBody.push(eachPolicy)
      })


    const deploymentRequest = async () => {

      console.log(deploymentBody)

      try {
        
        const response = await Axios.post(`http://localhost:4040/send-deployment`, deploymentBody)

        const confirmationData = response.data.confirmationData
        const errorMessages = response.data.errorMessages

        setBackEndErrors(errorMessages)
        setFinalResponse(confirmationData)
        console.log(confirmationData)
        console.log(errorMessages)

      } catch (error) {
        
        console.log(error);

      }
    }

    deploymentRequest()
  }

  //Timeline step text
  const step_h1 = 'Select Source'
  const step_h2 = 'Select Policies'
  const step_h3 = 'Select Destination'
  const step_h4 = 'Additional settings'
  const step_h5 = 'Confirm changes'

  const step_p1 = 'Pick the Tenant to Deploy from.'
  const step_p2 = 'Select the Policies you would like to Deploy from Source.'
  const step_p3 = 'Select destination Tenant(s) to Deploy your Policies to.'
  const step_p4 = 'Select how your Policies should be Deployed.'
  const step_p5 = 'Confrim you are happy to proceed with Deployment.'

  return (
    <div className="ui-panel deploy-journey">
      <ToastContainer />
      <div className="heading">
        <h2>Deploy</h2>
        <p>Deploy Policies to your chosen Tenant(s)</p>
      </div>
      <div className="action-body">
        <div className="progress-bar">
          {formArray.map((v, i) => (
            <div key={uuidv4()}>
              <div className="flex">
                <div className="flex">
                  <div
                    className={`progress-number ${
                      formNo - 1 === i || formNo - 1 === i + 1 || formNo - 1 === i + 2 || formNo - 1 === i + 3 || formNo === formArray.length
                        ? 'cyan-bg text-white'
                        : 'bg-slate-300'
                    }`}
                  >
                    {v}
                  </div>
                  <div className="progress-text">
                    <p className="navy-text">
                      <strong>
                        {v === 1 && step_h1 || v === 2 && step_h2 || v === 3 && step_h3 || v === 4 && step_h4 || v === 5 && step_h5}
                      </strong>
                    </p>
                    <p className="text-gray-400">
                      {v === 1 && step_p1 || v === 2 && step_p2 || v === 3 && step_p3 || v === 4 && step_p4 || v === 5 && step_p5}
                    </p>
                  </div>
                </div>
              </div>
              {i !== formArray.length - 1 && <div className="progress-bar-link"></div>}
            </div>
          ))}
        </div>
        <div className="action-body-form">
          {formNo === 1 && 
          <>
            <h4 className="mb-4">Select Tenant(s) to Backup</h4>

            {loadingState ? (
              <div id="loading-spinner">
                  <div className="loading"></div>
              </div>
              ) : ( 

            <TargetTenants targetTenants={targetTenants} targetTenantQuery={targetTenantQuery} selectedTargetTenant={selectedTargetTenant} setSelectedTargetTenant={setSelectedTargetTenant}
            setTargetTenantQuery={setTargetTenantQuery}
            pre={pre} next={next} />
              )}


            <div className="mt-6 gap-3 flex">
              <button onClick={next} className="btn cyan-btn">Next</button>
            </div>
          </>
          }
          {formNo === 2 && 
          <>
            <h4>Select policies to deploy</h4>
            {loadingState ? ( 
                    <div id="loading-spinner">
                        <div className="loading"></div>
                    </div> 
                   ) : ( 

            <PolicyPicker data={data} checkedItems={checkedItems} selectedObjects={selectedObjects} showChildren={showChildren} selectAll={selectAll} handleParentCheckboxChange={handleParentCheckboxChange} handleChildCheckboxChange={handleChildCheckboxChange} handleSelectAll={handleSelectAll} handleDropdownToggle={handleDropdownToggle} pre={pre} next={next} />

            )}
            <div className="mt-6 gap-3 flex">
              <button onClick={pre} className="btn navy-btn">Previous</button>
              <button onClick={next} className="btn cyan-btn">Next</button>
            </div>
          </>
          }
          {formNo === 3 && 
          <>
            <h4 className="mb-4">Deploy to Destination Tenants</h4>
                  {loadingState ? (
                    <div id="loading-spinner">
                        <div className="loading"></div>
                    </div>
                    ) : ( 

                    <DestinationTenants destinationTenants={destinationTenants} targetTenantQuery={destinationTenantQuery} selectedDestinationTenant={selectedDestinationTenant} setSelectedDestinationTenant={setSelectedDestinationTenant}
                    setDestinationTenantQuery={setDestinationTenantQuery}
                    formResponses={formResponses}
                    pre={pre} next={next} />
                    )}
              
                <div className="mt-6 gap-3 flex">
                  <button onClick={pre} className="btn navy-btn">Previous</button>
                  <button onClick={next} className="btn cyan-btn">Next</button>
                </div>
            
          </>
          }
          {formNo === 4 && 
          <>
          <h4 className="mb-4">Additional Settings</h4>
          <AdditionalOptions selectedChoices={selectedChoices} setSelectedChoices={setSelectedChoices} handleChoiceChange={handleChoiceChange} pre={pre} next={next} />
          </>
          }

          {formNo === 5 && (
            <div>
              <div className="final-confirmation">
                <h3>Review and confirm your changes</h3>

                <div className="mt-4">
                  <ul>
                  {formResponses.map((response, index) => (
              <li key={index}>
                {/* Step {response.step}:  */}
                {renderDisplayValue(response)}
              </li>
            ))}
            {console.log(formResponses)}
                  </ul>
                </div>
                <div className="mt-4 gap-3 flex">
                  <button onClick={pre} className="btn navy-btn">
                    Previous
                  </button>
                  <button onClick={finalSubmit} className="btn cyan-btn">
                    Submit
                  </button>
                </div>
                {openPopup === true && (
                  <DeployPopup finalResponse={finalResponse} formResponses={formResponses} backEndErrors={backEndErrors} />
                ) }
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default Deploy