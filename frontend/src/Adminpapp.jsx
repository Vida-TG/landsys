import React, { useState } from 'react';
import Modal from './Modal';

function Adminpapp({applicationData}) {
  const [showSModal, setShowSModal] = useState(false);
  const [showEModal, setShowEModal] = useState(false);
  const [reason, setReason] = useState("Could not get application details");
  
  const handleExpand = async () => {
    try {
      console.log('App');
      setShowSModal(true)
    } catch (error) {
      setShowEModal(true)
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
              <button onClick={handleExpand} id="claimRewardsBtn">Expand</button>
          </div>
      </div>
          { showSModal && <Modal text="Application submitted successfully" status="success" /> }
          { showEModal && <Modal text={reason} status="error" /> }
    </div>
  );
}

export default Adminpapp;
