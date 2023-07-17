import { useState, useContext, useEffect } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

import RadioButtons from "../components/RadioButtons";
import TargetTenants from "../components/TargetTenants";
import PolicyPicker from "../components/PolicyPicker";
import { GlobalContext } from '../contexts/GlobalContext'
import ConfirmationPopup from "../components/ConfirmationPopup";

import Axios from 'axios'

const Backup = () => {

    // context API loading state
    const { loadingState, setLoadingState } = useContext(GlobalContext)

    //Form Logic
    const formArray = [1, 2, 3, 4]
    const [formNo, setFormNo] = useState(formArray[0])

    //All/Specific tenant radio
    // const [selectedPolicyText, setSelectedPolicyText] = useState('')
    const [selectedOption, setSelectedOption] = useState('All Tenants')


    //Target tenants
    const [targetTenants, setTargetTenants] = useState([])
    const [targetTenantQuery, setTargetTenantQuery] = useState('')
    // const [selectedTargetTenants, setSelectedTargetTenants] = useState([])
    const [selectedTargetTenant, setSelectedTargetTenant] = useState(null)


    const [selectedText, setSelectedText] = useState('')

    //Policy picker
    const [checkedItems, setCheckedItems] = useState({})
    const [selectedObjects, setSelectedObjects] = useState([])
    const [data, setData] = useState([])
    const [showChildren, setShowChildren] = useState({})
    const [selectAll, setSelectAll] = useState(false)
    const [openDropdowns, setOpenDropdowns] = useState([])

    //Back Up name
    const [backUpName, setBackUpName] = useState('')


    //Parse data for posting
    const [formResponses, setFormResponses] = useState([])

    //Final response
    const [finalResponse, setFinalResponse] = useState(null)
    const [backEndErrors, setBackEndErrors] = useState(null)
    const [openPopup, setOpenPopup] = useState(false)



    useEffect(() => {
        targetTenantSearch()

    }, [targetTenantQuery], [formResponses])

    useEffect(() => {
      if (formNo === 1) {
        setFormResponses([]);
      }
    }, [formNo])

    const targetTenantSearch = async () => {
      try {
        setLoadingState(true)
        const response = await Axios.post('http://localhost:4040/list-tenants')
  
        const data = response.data.Data;
        // console.log(data)
        setTargetTenants(data)
        // setTargetTenants(data.map(item => item.targetTenants))
  
      } catch (error) {
        console.error('Error:', error);
      }

      finally {
        setLoadingState(false)
      }
    }
        

    // const targetTenantSearch = async () => {
    //   const response = await fetch(`http://localhost:4040/company-names?q=${targetTenantQuery}`)
    //   const data = await response.json()
    //   setTargetTenants(data)
    // };




  //If All Tenants is selected, remove previously selected specific tenant
  const handleOptionChange = (option) => {
      setSelectedOption(option);
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
             <p><strong>Tenants to backup: </strong></p>
              <ul>{response.response.map((tenants, index) => (
              <li key={index}>{tenants.tenantFriendlyName}</li>
              ))}</ul>
            </div>
          );
    } else if (response.step === 2) {
      // let policyRes = response.response.map((policy) => policy.displayName)
      return (
        <div>
        <p><strong>Policies to backup [{response.response.length}]: </strong></p>
        <ul>
          {response.response.map((policy, index) => (
            <li key={index}>{policy.displayName || policy.name}</li>
          ))}
        </ul>
      </div>
      );
    } else if (response.step === 3) {
      let buName = formResponses[2].response
      return (
        <div>
        <p><strong>Back up Name: </strong></p>
        <p>{buName}</p>
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




    //Timeline navigation
    const next = () => {


      if (formNo === 1) {
        // let allTenants = selectedOption === 'All Tenants';
    
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
          console.log(json)

          //reset policies so state can be repopulated with policies based on clientTenantID 
          // setData([])
          setData(json)
          setLoadingState(false)
          
          }

          policyRequest()
          //send post request containing selected tenants to get data to populate policy picker            

        setFormNo(formNo + 1)

      } else if (formNo === 2) {
        if (selectedObjects.length === 0) {
          toast.error('Please select at least one policy')
          return
        }
    
        let stepTwoRes = { step: formNo, response: selectedObjects }
    
        // Find the existing response for step 1 in the formResponses array
        const existingResponseIndex = formResponses.findIndex((response) => response.step === formNo)
    
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
        if (backUpName < 2) {
          toast.error('Please enter Back Up Name')
          return
        }
    
        let stepThreeRes = { step: formNo, response: backUpName }

    
        // Find the existing response for step 1 in the formResponses array
        const existingResponseIndex = formResponses.findIndex((response) => response.step === formNo)
    
        if (existingResponseIndex !== -1) {
          // If an existing response exists, replace it with the latest response
          const updatedResponses = [...formResponses]
          updatedResponses[existingResponseIndex] = stepThreeRes
          setFormResponses(updatedResponses)
        } else {
          // Otherwise, add the response to the array
          setFormResponses((prevFormResponses) => [...prevFormResponses, stepThreeRes])
        }
    
        
        setFormNo(formNo + 1)
      } else {
        toast.error('Please complete all input fields')
      }
    }
    

    const pre = () => {

      if (formNo === 2) {
        // Reset form responses and policy picker if the user goes back to the first stage
        setFormResponses([])
        setOpenDropdowns([])
        setSelectedObjects([])
        setCheckedItems({})
        setSelectAll(false)
      }

      setFormNo(formNo - 1)
    }
    
    const finalSubmit = () => {
      setOpenPopup(true)
      const clientTenantId = +formResponses[0].response[0].clientTenantId
      const backupComment = formResponses[2].response

      const backUpBody = []

      formResponses[1].response.forEach( response => {
        const policyGUid = response.id
        const PolicyTypeId = response.PolicyTypeId

        const eachPolicy = {
          clientTenantId,
          policyGUid,
          PolicyTypeId,
          backupComment
        }

        backUpBody.push(eachPolicy)
      })


    const backUpRequest = async () => {

      console.log(backUpBody)

      try {
        
        const response = await Axios.post(`http://localhost:4040/send-backup`, backUpBody)

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

    backUpRequest()
        

  }
    //Timeline step text
    let step_h1 = 'Back Up'
    let step_h2 = 'Select Policies'
    let step_h3 = 'Enter Back Up name'
    let step_h4 = 'Confirm changes'

    let step_p1 = 'Select Tenant(s) to Back-Up'
    let step_p2 = 'Select Policies to Back-Up'
    let step_p3 = 'Enter Back Up name for reference'
    let step_p4 = 'Confirm you are happy to proceed with Back-Up.'


    return (
      <div className="ui-panel">
        <ToastContainer />
        <div className="heading">
            <h2>Back Up</h2>
            <p>Back Up Policies in your chosen Tenant(s)</p>
        </div>
        <div className="action-body">
            <div className="progress-bar">
            {
              formArray.map((v, i) => 
              <div key={uuidv4()}>
                <div className="flex">
                    <div className="flex">
                        <div className={`progress-number progress-number-${v} ${formNo - 1 === i || formNo - 1 === i + 1 ||  formNo - 1 === i + 2 || formNo === formArray.length ? 'cyan-bg text-white' : 'bg-slate-300'}`}>
                        {v} 
                        </div>
                        <div className="progress-text">
                            <p className="navy-text">
                                <strong>{v === 1 && step_h1 || v === 2 && step_h2 || v === 3 && step_h3 || v === 4 && step_h4}</strong>
                            </p>
                            <p className="text-gray-400">{v === 1 && step_p1 || v === 2 && step_p2 || v === 3 && step_p3 || v === 4 && step_p4}</p>
                        </div>
                    </div>
                </div>
                {
                  i !== formArray.length - 1 && <div className="progress-bar-link"></div>
                }
                </div>)
                }
            </div>
            <div className="action-body-form">
          { formNo === 1 && <>



                <>
                  <h4 className="mb-4">Select Tenant to Backup</h4>

                  {loadingState ? (
                    <div id="loading-spinner">
                        <div className="loading"></div>
                    </div>
                    ) : ( 

                  <TargetTenants targetTenants={targetTenants} targetTenantQuery={targetTenantQuery} selectedTargetTenant={selectedTargetTenant} setSelectedTargetTenant={setSelectedTargetTenant}
                  setTargetTenantQuery={setTargetTenantQuery}
                  pre={pre} next={next} />
                    )}
                 </>

                <div className="mt-6 gap-3 flex">
                    <button onClick={next} className="btn cyan-btn">Next</button>
                </div>
            </>
          }
  
          {
            formNo === 2 && 
            <>
            <h4>Select policies to backup</h4>

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
  
          {
            formNo === 3 && 
            <>
            <h4>Enter Back Up Name</h4>


            <input
            className="flex w-[350px] focus:outline-blue-400 rounded-md light-grey-bg p-2 text-gray-700 mb-4 mt-4"
            type="text"
            placeholder="Search"
            value={backUpName}
            onChange={(e) => setBackUpName(e.target.value)}
            />

            <div className="mt-6 gap-3 flex">
              <button onClick={pre} className="btn navy-btn">Previous</button>
              <button onClick={next} className="btn cyan-btn">Next</button>
            </div>
            </>
            }
  
          {
            formNo === 4 && 
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
                  <ConfirmationPopup finalResponse={finalResponse} formResponses={formResponses} backEndErrors={backEndErrors} />
                ) }
            </div>
          </div>
          }
  
            </div>
        </div>

      </div>
  )
}

export default Backup

