import React, { useState, useEffect } from 'react';
import axios from 'axios';

function CreateAppPopup({onApplicationAdded, address}) {
  const [isOpen, setIsOpen] = useState(false);
  const [applicationName, setApplicationName] = useState('');

  const openPopup = () => {
    setIsOpen(true);
  };

  const closePopup = () => {
    setIsOpen(false);
  };


  const handleApplicationSubmit = async () => {
    try {
        const results = await axios.post(
            `http://localhost:4000/api/applications`,
            { address, applicationName },
            {}
        );
        setApplicationName("")
        if (onApplicationAdded) {
          onApplicationAdded(results.data.application);
        }
    } catch (err) {
        console.log(err)
    }
    closePopup();
  };

  return (
    <div>
      <button className="point" onClick={openPopup} style={{width:"100%", margin: "30px auto", display:"block", padding:"13px", borderRadius:"8px"}}><h4>Apply for a land doc</h4></button>
      {isOpen && (
        <div className='create-app-popup-container'>
            <div className="create-app-popup">
                <h2>What are you applying for?</h2>
                <div className='create-app-box'>
                    <input
                        type="text"
                        value={applicationName}
                        onChange={(e) => setApplicationName(e.target.value)}
                        placeholder="Enter application name"
                        className='app-name-input'
                    />
                </div>
                <button id="submitApplication" onClick={handleApplicationSubmit}>Submit</button>
                <button id="closeCAPopup" onClick={closePopup}>Close</button>
            </div>
        </div>
      )}
    </div>
  );
}

export default CreateAppPopup;
