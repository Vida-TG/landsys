import React, { useState } from 'react';
import Modal from './Modal';
import axios from 'axios';
import cloudinary from 'cloudinary';


cloudinary.config({
  cloud_name: 'dvuzscy9c',
  api_key: '752753436834878',
  api_secret: '_BjKO1558GxI3lnfQQRIju4V3CQ',
});

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
        `http://localhost:4000/api/applications`,
        { address:"yu", applicationName },
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

      const file = selectedFiles[documentIndex][0];

      try {
        const uploadResponse = await cloudinary.v2.uploader.upload(file.path, {
          folder: 'land_docs',
        });

        const fileUrl = uploadResponse.secure_url;
        console.log('File uploaded:', fileUrl);
        // Now you can do something with the uploaded URL, e.g., save it to your database or display it to the user

        setUploading(false);
      } catch (error) {
        console.error('Error uploading file to Cloudinary:', error);
        setUploading(false);
      }
    }
  }

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
            Fee: {applicationData.fee}
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
