import React, { useState } from 'react';
import axios from 'axios';
import Modal from './Modal';

function Adminapp({ applicationData, address }) {
  const [documentName, setDocumentName] = useState('');
  const [price, setPrice] = useState(0);
  const [status, setStatus] = useState('Pending');
  const [nameLoading, setNameLoading] = useState(false);
  const [priceLoading, setPriceLoading] = useState(false);
  const [showSModal, setShowSModal] = useState(false);
  const [showEModal, setShowEModal] = useState(false);
  const [reason, setReason] = useState("Could not get application details");


  const handleAddDocument = async () => {
    if (documentName) {
        setNameLoading(true)
        console.log("data")
        try {
            console.log("results.data")
            const results = await axios.post(
              `http://localhost:4000/api/applications/${applicationData._id}/documents`,
              { address:"yu", documentName },
              {}
            );
            
            console.log(results.data)
            setReason(results.data.message)
            if (results.data.status == "success") setShowSModal(true);
            else setShowEModal(true);
        } catch (err) {
            console.log(err)
        }
        setDocumentName('');
        setNameLoading(false)
    }
  };

  const handleSavePrice = async () => {
    if (price) {
        setPriceLoading(true)
        try {
            console.log("results.data")
            const results = await axios.put(
              `http://localhost:4000/api/applications/${applicationData._id}`,
              { address:"yu", price },
              {}
            );
            
            console.log(results.data)
            setReason(results.data.message)
            if (results.data.status == "success") setShowSModal(true);
            else setShowEModal(true);
        } catch (err) {
            console.log(err)
        }
        setPrice('');
        setPriceLoading(false)
    }
  };

  return (
    <div className="wrap" style={{marginTop:"5px"}}>
      <div className="contents">
          <div className="contentheading">
              <h3>{applicationData.applicationName}</h3>
          </div>
          <div className="stakeform">
              <p style={{marginTop:"5px", marginBottom:"10px", color:"#fff", fontSize:"17px", fontFamily:"monospace"}}>
                <input
                    type="text"
                    placeholder="Document Name"
                    value={documentName}
                    onChange={(e) => setDocumentName(e.target.value)}
                    style={{width:"50%", marginRight:"5px", marginBottom:"5px", padding:"5px"}}
                />
                { nameLoading ? <button style={{width:"40%", marginBottom:"5px", padding:"5px"}}>Loading...</button>
                 :
                <button className="pointer" onClick={handleAddDocument} style={{width:"40%", marginBottom:"5px", padding:"5px", cursor:"pointer"}}>Add Document</button>
                }
                <br/>
                <input
                    type="number"
                    placeholder="Price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{width:"50%", marginRight:"5px", marginBottom:"5px", padding:"5px"}}
                />
                { priceLoading ? <button style={{width:"40%", marginBottom:"5px", padding:"5px"}}>Loading...</button>
                 :
                <button onClick={handleSavePrice} style={{width:"40%", marginBottom:"5px", padding:"5px", cursor:"pointer"}}>Save</button>
                }
                <br/>
                Status:
                <select onChange={(e) => setStatus(e.target.value)} style={{width:"45%", padding:"5px", cursor:"pointer"}}>
                    <option>Pending</option>
                    <option>Approved</option>
                    <option>Rejected</option>
                </select>
              </p>
              <br/>
              <button onClick={handleSavePrice} id="claimRewardsBtn">Save all</button>
          </div>
      </div>
          { showSModal && <Modal text={reason} status="success" /> }
          { showEModal && <Modal text={reason} status="error" /> }
    </div>
  );
}

export default Adminapp;
