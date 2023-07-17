import { useState, useContext, useEffect } from "react"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';

// import { format, setDate } from 'date-fns';
// import { DayPicker } from 'react-day-picker';
// import 'react-day-picker/dist/style.css';

import TargetTenants from "../components/TargetTenants"
import DestinationTenants from "../components/DestinationTenants"
import RestorePolicyPicker from '../components/RestorePolicyPicker'
import RestoreSettings from '../components/RestoreSettings'
import RestorePopup from "../components/RestorePopup";

import { GlobalContext } from '../contexts/GlobalContext'

import Axios from 'axios'
import DatePicker from "../components/DatePicker";
import BackUpCommentPicker from "../components/BackUpCommentPicker";

const Restore = () => {

  //Form Logic
  const formArray = [1, 2, 3, 4, 5]
  const [formNo, setFormNo] = useState(formArray[0])

  // context API loading state
  const { loadingState, setLoadingState } = useContext(GlobalContext)


 //Target tenants
 const [targetTenants, setTargetTenants] = useState([])
 const [targetTenantQuery, setTargetTenantQuery] = useState('')
 const [selectedTargetTenants, setSelectedTargetTenants] = useState([])
 const [selectedTargetTenant, setSelectedTargetTenant] = useState(null)

 //Backup dates
 const [dates, setDates] = useState('')
 const [selectedDate, setSelectedDate] = useState(null)
 const [backUpsByComment, setBackUpsByComment] = useState('')
 const [commentList, setCommentList] = useState('')

//Restore selector
const [selectedOption, setSelectedOption] = useState('date')
const [comment, setComment] = useState('')


  //Policy picker
  const [checkedItems, setCheckedItems] = useState({})
  const [selectedObjects, setSelectedObjects] = useState([])
  const [data, setData] = useState([])
  const [showChildren, setShowChildren] = useState({})
  const [selectAll, setSelectAll] = useState(false)
  const [openDropdowns, setOpenDropdowns] = useState([])

  const [policyError, setPolicyError] = useState('')


  //Additional options
  const [selectedChoices, setSelectedChoices] = useState([true, true, true, true, true])

  //Parse data for posting
  const [formResponses, setFormResponses] = useState([])

  //Final response
  const [finalResponse, setFinalResponse] = useState(null)
  const [backEndErrors, setBackEndErrors] = useState(null)
  const [openPopup, setOpenPopup] = useState(false)


    useEffect(() => {
      targetTenantSearch()
  
    }, [targetTenantQuery], [formResponses])
        

    const targetTenantSearch = async () => {
      try {
        setLoadingState(true);
        if (targetTenants.length === 0) {
          const response = await Axios.post('http://localhost:4040/list-tenants');
          const data = response.data.Data;
          setTargetTenants(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoadingState(false);
      }
    };
    
    useEffect(() => {
      targetTenantSearch();
    }, []);
 
 
    const handleParentCheckboxChange = (e) => {
      const { name, checked } = e.target
      const updatedCheckedItems = { ...checkedItems }
      const updatedShowChildren = { ...showChildren }
  
      updatedCheckedItems[name] = checked
      updatedShowChildren[name] = checked
  
      if (checked) {
        data[name].forEach((child) => {
          updatedCheckedItems[child.policyGuid] = true
          if (!selectedObjects.some((obj) => obj.policyGuid === child.policyGuid)) {
            setSelectedObjects((prevSelectedObjects) => [...prevSelectedObjects, child])
          }
        })
      } else {
        data[name].forEach((child) => {
          updatedCheckedItems[child.policyGuid] = false
          setSelectedObjects((prevSelectedObjects) =>
            prevSelectedObjects.filter((obj) => obj.policyGuid !== child.policyGuid)
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
      //   data[type].some((obj) => obj.policyGuid === parseInt(name))
      const parentType = Object.keys(data).find((type) =>
      data[type].some((obj) => obj.policyGuid.toString() === name)
      )
  
      if (checked) {
        // const selectedObject = data[parentType].find((obj) => obj.policyGuid === parseInt(name))
        const selectedObject = data[parentType].find((obj) => obj.policyGuid.toString() === name)
        setSelectedObjects((prevSelectedObjects) => [...prevSelectedObjects, selectedObject])
        
      } else {
        setSelectedObjects((prevSelectedObjects) =>
          prevSelectedObjects.filter((obj) => obj.policyGuid !== parseInt(name))
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
      const allChildrenChecked = data[parentType].map((child) => updatedCheckedItems[child.policyGuid.toString()])
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
            updatedCheckedItems[child.policyGuid] = true
            if (!updatedSelectedObjects.some((obj) => obj.policyGuid === child.policyGuid)) {
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
         <p><strong>Tenant to restore: </strong></p>
          <ul>{response.response.map((tenants, index) => (
          <li key={index}>{tenants.tenantFriendlyName}</li>
          ))}</ul>
        </div>
      );
} 
else if (response.step === 2) {
    let selectedDate = response.response.map((d) => d.value).join(", ")
    return (
      <p>
        <strong>Selected Backup </strong>
        <span>{selectedDate || Object.values(comment)[0]}</span>
      </p>
    );
  } else if (response.step === 3) {
    let policyRes = response.response.map((policy) => policy.displayName || policy.name || policy.PolicyName).join(", ")
    return (
      <p>
        <strong>Policies to Restore: </strong>
        <span>{policyRes}</span>
      </p>
    );
  } else if (response.step === 4) {
    let r1 = response.response[0] === true ? "Yes" : "No";
    let r2 = response.response[1] === true ? "Yes" : "No";
    let r3 = response.response[2] === true ? "Yes" : "No";
    let r4 = response.response[3] === true ? "Yes" : "No";
    let r5 = response.response[4] === true ? "Yes" : "No";
    return (
      <div>
        <p className="mb-2"><strong>Additional settings:</strong></p>
        <ul>
          <li><strong>Restore non-standard applications (only Conditional Access policy type, default yes):</strong> {r1}</li>
          <li><strong>Restore non-standard applications (only Conditional Access policy type, default yes):</strong> {r2}</li>
          <li><strong>Restore policy in disabled state (only conditional access policy type, default yes):</strong> {r3}</li>
          <li><strong>Restore original location information (only conditional access policy type, default yes):</strong> {r4}</li>
          <li><strong>Restore compliance policy actions (default yes):</strong> {r5}</li>
        </ul>
      </div>
    );
  }else {
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
          toast.error('Please select a source tenant');
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
  
  

          setData([])
            // Get clientTenantId so it can be passed
            const ctId = stepOneRes.response[0].clientTenantId

          const getBackUpDates = async () => {
  
            setLoadingState(true)
            const response = await fetch(`http://localhost:4040/get-backups-by-date`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                mode: 'cors',
                body: JSON.stringify({ ctId })
            })
        
            const backUpDates = await response.json()

            setDates(backUpDates)
            setLoadingState(false)
            }
  
          getBackUpDates()

          const getBackUpComments = async () => {
  
            setLoadingState(true)
            const response = await fetch(`http://localhost:4040/get-backups-by-comment`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                  },
                mode: 'cors',
                body: JSON.stringify({ ctId })
            })
        
            const backUpComments = await response.json()

            setComment(backUpComments)
            setLoadingState(false)
            }
  
          getBackUpComments()

        setFormNo(formNo + 1)
    
      }
      else if (formNo === 2) {

        if (selectedOption === 'date' && !selectedDate) {
          toast.error('Please choose a date');
          return;
        }
        if (selectedOption === 'comment' && !comment) {
          toast.error('Please enter a comment');
          return;
        }
    
        // Construct the step two response based on the selected option and comment
        const stepTwoRes = {
          step: formNo,
          response: [
            selectedOption === 'date' ? selectedDate : comment
          ]
        };
    
        // Find the existing response for step 2 in the formResponses array
        const existingResponseIndex = formResponses.findIndex(
          (response) => response.step === formNo
        );
    
        if (existingResponseIndex !== -1) {
          // If an existing response exists, replace it with the latest response
          const updatedResponses = [...formResponses];
          updatedResponses[existingResponseIndex] = stepTwoRes;
          setFormResponses(updatedResponses);
        } else {
          // Otherwise, add the response to the array
          setFormResponses((prevFormResponses) => [...prevFormResponses, stepTwoRes]);
        }
    
        console.log(Object.values(comment)[0])
        console.log(comment)
    
        //Reset state where policies are store before called
        setData([]);

        const policyRequest = async () => {
          setLoadingState(true);
        
          const ctId = formResponses.find((response) => response.step === 1)?.response[0]?.clientTenantId;
          const currentSelectedOption = selectedOption;
          const currentSelectedDate = selectedDate;
          const currentComment = Object.values(comment)[0];
          // const currentComment = comment;
        
          try {
            let policyRes;
        
            if (currentSelectedOption === 'date') {
              const burid = currentSelectedDate.key;
              // const burid = +formResponses[1].response[0].key
              console.log('burid:',burid)
        
              policyRes = await fetch(`http://localhost:4040/get-policies-by-backuprunid`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({ ctId, burid }),
              });
            } else {
              policyRes = await fetch(`http://localhost:4040/get-policies-by-comment`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                mode: 'cors',
                body: JSON.stringify({ ctId, comment: currentComment }),
              });
            }
        
            if (policyRes.ok) {
              const json = await policyRes.json();
              setData(json);
            } else {
              throw new Error('Failed to fetch policies');
            }
          } catch (error) {
            setPolicyError(error);
          } finally {
            setLoadingState(false);
          }
        };
        

        policyRequest()

        

        setFormNo(formNo + 1)

      } else if (formNo === 3)  {
        if (selectedObjects.length === 0) {
          toast.error('Please select at least one policy')
          return
        }

    
        let stepThreeRes = { step: formNo, response: selectedObjects}

        // Find the existing response for step 1 in the formResponses array
        const existingResponseIndex = formResponses.findIndex(
         (response) => response.step === formNo
       )
   
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

      } else if (formNo === 4)  {

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

      } 
      
      else {
        toast.error('Please complete all input fields')
      }
      console.log(formResponses)
      // console.log(formResponses[1].response)

    }

    const pre = () => {
      if (formNo === 2) {
        // Reset form responses and policy picker if the user goes back to the second step
        setFormResponses([]);
        setOpenDropdowns([]);
        setSelectedObjects([]);
        setCheckedItems({});
        setSelectAll(false);
      } else if (formNo === 3) {
        // Clear selected policies if the user goes back from the third step
        setSelectedObjects([]);
        setCheckedItems({});
        setSelectAll(false);
      }
    
      setFormNo(formNo - 1);
    }    
    
    const finalSubmit = () => {
      setOpenPopup(true)
        const clientTenantId = +formResponses[0].response[0].clientTenantId

        const restoreAssignments = formResponses[3].response[0]
        const restoreNonStandardApplications = formResponses[3].response[1]
        const restorePolicyDisabled = formResponses[3].response[2]
        const restoreLocations = formResponses[3].response[3]
        const restoreCompliancePolicyActions = formResponses[3].response[3]
  
        const restoreBody = []
  
        formResponses[2].response.forEach( response => {
          const policyGuid = response.policyGuid
          const policyTypeId = response.policyTypeId
          const policyId = response.policyId
  
          console.log(response)
          const eachPolicy = {
            clientTenantId,
            policyTypeId,
            policyGuid,
            policyId,
            restoreAssignments,
            restoreNonStandardApplications,
            restorePolicyDisabled,
            restoreLocations,
            restoreCompliancePolicyActions
          }
  
          restoreBody.push(eachPolicy)
        })
  
  
      const restorationRequest = async () => {
  
        console.log(restoreBody)
  
        try {
          
          const response = await Axios.post(`http://localhost:4040/send-restoration`, restoreBody)
  
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
  
      restorationRequest()
    }

    //Timeline step text
    let step_h1 = 'Restore'
    let step_h2 = 'Select Restore Point'
    let step_h3 = 'Select Policies'
    let step_h4 = 'Additional Settings'
    let step_h5 = 'Confirm Changes'
  

    let step_p1 = 'Select the Tenant(s) to Restore.'
    let step_p2 = 'Choose a point in time to Restore Polices from.'
    let step_p3 = 'Select the Policies you would like to Restore.'
    let step_p4 = 'Select how your Policies should be Restored.'
    let step_p5 = 'Confirm you are happy to proceed with Restore.'


    return (
      <div className="ui-panel restore-journey">
        <ToastContainer />
        <div className="heading">
            <h2>Restore</h2>
            <p>Restore Policies to your chosen Tenant(s)</p>
        </div>
        <div className="action-body">
            <div className="progress-bar">
            {
              formArray.map((v, i) => 
              <div key={uuidv4()}>
                <div className="flex">
                    <div className="flex">
                        <div className={`progress-number progress-number-${v} ${ formNo - 1 === i || formNo - 1 === i + 1 || formNo - 1 === i + 2 || formNo - 1 === i + 3 || formNo === formArray.length ? 'cyan-bg text-white' : 'bg-slate-300' }`} >
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
                {
                  i !== formArray.length - 1 && <div className="progress-bar-link"></div>
                }
                </div>)
                }
            </div>
            <div className="action-body-form">
          {
            formNo === 1 && <>

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
          {
            formNo === 2 && (
              <>
                <h4 className="mb-2">Select a Back Up type</h4>
                <div className="radio-buttons">
                  <label>
                    <input
                      type="radio"
                      name="option"
                      value="date"
                      checked={selectedOption === 'date'}
                      onChange={() => setSelectedOption('date')}
                    />
                    Automated /date
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="option"
                      value="comment"
                      checked={selectedOption === 'comment'}
                      onChange={() => setSelectedOption('comment')}
                    />
                    Manual / comment
                  </label>
                </div>
                {selectedOption === 'date' && (
                  <>
                    <h4>Select a Back Up by date</h4>

                    <DatePicker dates={dates} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                  </>
                )}
                {selectedOption === 'comment' && (
                  <>
                  <h4>Select a Back Up by comment</h4>

                  <BackUpCommentPicker dates={comment} selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
                </>
                )}
                <div className="mt-6 gap-3 flex">
                  <button onClick={pre} className="btn navy-btn">Previous</button>
                  <button onClick={next} className="btn cyan-btn">Next</button>
                </div>
              </>
            )
          }
          {
            formNo === 3 && (
              <>
                <h4>Select policies to Restore</h4>

                {loadingState ? (
                  <div id="loading-spinner">
                    <div className="loading"></div>
                  </div>
                ) : (
                  <RestorePolicyPicker
                    data={data}
                    checkedItems={checkedItems}
                    selectedObjects={selectedObjects}
                    showChildren={showChildren}
                    selectAll={selectAll}
                    handleParentCheckboxChange={handleParentCheckboxChange}
                    handleChildCheckboxChange={handleChildCheckboxChange}
                    handleSelectAll={handleSelectAll}
                    handleDropdownToggle={handleDropdownToggle}
                    pre={pre}
                    next={next}
                  />
                )}

                <div className="mt-6 gap-3 flex">
                  <button onClick={pre} className="btn navy-btn">
                    Previous
                  </button>
                  <button onClick={next} className="btn cyan-btn">
                    Next
                  </button>
                </div>
              </>
            )
          }
  
          {
            formNo === 4 && 
            <>
            <h4 className="mb-4">Additional Settings</h4>
            <RestoreSettings selectedChoices={selectedChoices} setSelectedChoices={setSelectedChoices} handleChoiceChange={handleChoiceChange} pre={pre} next={next} />
            </>
          }
          {
            formNo === 5 && 
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
                  <RestorePopup finalResponse={finalResponse} formResponses={formResponses} backEndErrors={backEndErrors} comment={comment}  />
                ) }
            </div>
          </div>
          }
  
            </div>
        </div>

      </div>
  )
}

export default Restore