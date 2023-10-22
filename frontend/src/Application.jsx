import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';

function Application({ applicationData }) {
  const [showSModal, setShowSModal] = useState(false);
  const [showEModal, setShowEModal] = useState(false);
  const [reason, setReason] = useState("Could not get application details");

  const [isOpen, setIsOpen] = useState(false);
  const [applicationName, setApplicationName] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const openPopup = () => {
    setIsOpen(true); 
  };

  const closePopup = () => {
    setIsOpen(false);
  };

  const handleApplicationSubmit = async () => {
    try {
      const results = await axios.post(
        `https://landdocs-backend-vkud.onrender.com/api/applications`,
        { address, applicationName },
        {}
      );
 
      setApplicationName("");

      if (onApplicationAdded) {
        onApplicationAdded(results.data.application);
      }
    } catch (err) {
      console.log(err);
    }

    closePopup();
  };

  const handleFileSelect = (event, documentIndex) => {
    const files = event.target.files;
    const newSelectedFiles = [...selectedFiles];
 
    newSelectedFiles[documentIndex] = files;
    setSelectedFiles(newSelectedFiles);
  };

  const handleFileUpload = async (documentIndex) => {
    if (selectedFiles[documentIndex]) {
      setUploading(true);
      console.log("upload")
      // Cloudinary selectedFiles[documentIndex]

      setUploading(false);
    }
  };

  return (
    <div className="wrap">
      <div className="contents">
        <div className="contentheading">
          <h3>{applicationData.applicationName}</h3>
        </div>
        <div className="stakeform">
          <p style={{ marginTop: "20px", marginBottom: "10px", color: "#fff", fontSize: "17px", fontFamily: "monospace" }}>
            {applicationData.documents.length} pending document submission(s)
            <br /><br />
            Status: {applicationData.status}
          </p>
          <br />
          <button onClick={openPopup} id="claimRewardsBtn">Expand</button>
        </div>
      </div>
      {isOpen && (
        <div className='create-app-popup-container'>
          <div className="create-app-popup">
            <h2>{applicationData.applicationName}</h2>
            <div className='create-app-box'>
              {applicationData.documents.map((document, documentIndex) => (
                <div key={documentIndex}>
                  <p>Document: {document.document}</p>
                  <input type="file" accept="image/*, .pdf" onChange={(event) => handleFileSelect(event, documentIndex)} />
                  <button onClick={() => handleFileUpload(documentIndex)}>Upload</button>
                </div>
              ))}
            </div>
            <button id="submitApplication" onClick={handleApplicationSubmit}>Submit</button>
            <button id="closeCAPopup" onClick={closePopup}>Close</button>
          </div>
        </div>
      )}
      {showSModal && <Modal text="Application submitted successfully" status="success" />}
      {showEModal && <Modal text={reason} status="error" />}
    </div>
  );
}

export default Application;
