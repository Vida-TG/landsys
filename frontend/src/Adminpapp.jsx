import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';

function Adminpapp({applicationData}) {
  const [showSModal, setShowSModal] = useState(false);
  const [showEModal, setShowEModal] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('Pending');
  const [reason, setReason] = useState("Could not update application details");
  
  const openPopup = () => {
    setIsOpen(true); 
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleSave = async () => {
    if (status) {
        setLoading(true)
        try {
            console.log("results.data")
            const results = await axios.put(
              `http://localhost:4000/api/applications/${applicationData._id}`,
              { address:"yu", status },
              {}
            );
            
            console.log(results.data)
            setReason(results.data.message)
            if (results.data.status == "success") setShowSModal(true);
            else setShowEModal(true);
        } catch (err) {
            console.log(err)
        }
        setLoading(false)
    }
  };

  return (
    <div className="wrap" style={{marginTop:"5px"}}>
      <div className="contents">
          <div className="contentheading">
              <h3>{applicationData.applicationName}</h3>
          </div>
          <div className="stakeform">
              <p style={{marginTop:"20px", marginBottom:"10px", color:"#fff", fontSize:"17px", fontFamily:"monospace"}}>
                {applicationData.documents.length} pending documents
                <br/><br/>
                Status: {applicationData.status}
              </p>
              <br/>
              <button onClick={openPopup} id="claimRewardsBtn">Expand</button>
          </div>
      </div>
      {isOpen && (
        <div className='create-app-popup-container'>
          <div className="create-app-popup">
            <h2 style={{display:"block", width:"100vw"}}>{applicationData.applicationName}</h2>
            <div className='create-app-box'>
              {applicationData.documents.map((document, documentIndex) => (
                <div key={documentIndex}>
                  <p>Document: <a style={{cursor:"pointer"}} href={document.url}>{document.document} (CLICK TO OPEN)</a></p>
                </div>
              ))}
              Status:
                <select onChange={(e) => setStatus(e.target.value)} style={{width:"35%", padding:"5px", cursor:"pointer"}}>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                </select>
            </div>
            { loading ? 
            <button id="submitApplication" style={{cursor:"default"}}>Loading...</button>
            :
            <button id="submitApplication" onClick={handleSave}>Submit</button>
            }
            <button id="closeCAPopup" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
          { showSModal && <Modal text="Updated successfully" status="success" /> }
          { showEModal && <Modal text={reason} status="error" /> }
    </div>
  );
}

export default Adminpapp;
