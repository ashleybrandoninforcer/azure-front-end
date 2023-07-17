const RadioButtons = ({ selectedOption, onOptionChange }) => {

    const handleOptionChange = (e) => {
        const option = e.target.value;
        onOptionChange(option);
      }

  return (
    <>
        <div className="flex justify-between">
            <label className={`w-[48%] cursor-pointer rounded-md p-3 text-gray-600 ring-2 transition-all hover:shadow  ${selectedOption === 'All Tenants' ? 'cyan-text ring-blue-400 bg-white' : 'text-gray-700 ring-slate-100 light-grey-bg'}`}>
                <input checked={selectedOption === 'All Tennants'} onChange={handleOptionChange} id="bordered-radio-1" type="radio" value="All Tenants" name="bordered-radio" className="peer sr-only"  />
                <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-700">All Tenants</p>
                    <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" /></svg>
                </div>
            </label>

            <label className={`w-[48%] cursor-pointer rounded-md p-3 text-gray-600 ring-2 transition-all hover:shadow ${selectedOption === 'Specific Tenants' ? 'cyan-text ring-blue-400 bg-white' : 'text-gray-700 ring-slate-100 light-grey-bg'}`}>
                <input checked={selectedOption === 'Specific Tennants'} onChange={handleOptionChange} id="bordered-radio-2" type="radio" value="Specific Tenants" name="bordered-radio" className="peer sr-only" />
                <div className="flex items-center justify-between">
                <p className="font-semibold text-slate-700">Specific Tenants</p>
                    <svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="m10.6 13.8l-2.175-2.175q-.275-.275-.675-.275t-.7.3q-.275.275-.275.7q0 .425.275.7L9.9 15.9q.275.275.7.275q.425 0 .7-.275l5.675-5.675q.275-.275.275-.675t-.3-.7q-.275-.275-.7-.275q-.425 0-.7.275ZM12 22q-2.075 0-3.9-.788q-1.825-.787-3.175-2.137q-1.35-1.35-2.137-3.175Q2 14.075 2 12t.788-3.9q.787-1.825 2.137-3.175q1.35-1.35 3.175-2.138Q9.925 2 12 2t3.9.787q1.825.788 3.175 2.138q1.35 1.35 2.137 3.175Q22 9.925 22 12t-.788 3.9q-.787 1.825-2.137 3.175q-1.35 1.35-3.175 2.137Q14.075 22 12 22Z" /></svg>
                </div>
            </label>

        </div>
    </>
  )
}

export default RadioButtons