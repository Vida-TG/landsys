import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const SingleApp = ({ application, address, onGoBack }) => {
    
  const [selectedApplication, setSelectedApplication] = useState({});
  const [documents, setDocuments] = useState({});
  const [documentsURL, setDocumentsURL] = useState({});
  
  const [ownerFullName, setOwnerFullName] = useState("")
  const [ownerAddress, setOwnerAddress] = useState("")
  const [prevOwnerType, setPrevOwnerType] = useState("")
  const [developed, setDeveloped] = useState("")
  const [occupied, setOccupied] = useState("")
  const [residentType, setResidentType] = useState("")
  const [sizeSqm, setSizeSqm] = useState("")
  const [location, setLocation] = useState("")
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await axios.post(
          `http://localhost:4000/api/applications/${application._id}`,
          { address },
          {}
        );
        setSelectedApplication(results.data.application);
        setOwnerFullName(results.data.application.ownerFullName)
        setOwnerAddress(results.data.application.ownerAddress)
        setPrevOwnerType(results.data.application.prevOwnerType)
        setDeveloped(results.data.application.developed)
        setOccupied(results.data.application.occupied)
        setResidentType(results.data.application.residentType)
        setSizeSqm(results.data.application.sizeSqm)
        setLocation(results.data.application.location)
        setIsLoading(false)
      } catch (err) {
        console.log(err);
        setIsLoading(false)
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {

  }, [selectedApplication])

  const handleUpdateApplication = async () => {
    try {
        console.log(documentsURL)
        
        const updatedDocuments = selectedApplication.documents.map((file) => {
            const newURL = documentsURL[file.document];
            return {
              ...file,
              url: newURL || file.url,
            };
          });

        const results = await axios.put(
            `http://localhost:4000/api/applications/${selectedApplication._id}`,
            { address, ownerFullName, ownerAddress, prevOwnerType, developed, occupied, residentType, sizeSqm, location, documentsURL:updatedDocuments },
            {}
          );
          console.log(results)
          

    } catch (err) {
      console.log(err);
    }
  };

  const handleFileChange = (documentName, file) => {
    setDocuments((prevUploads) => ({
      ...prevUploads,
      [documentName]: file,
    }));
  };

  const handleDocumentUpload = async (documentName) => {
    try {
      const formData = new FormData();
      formData.append('documentName', documentName);
      formData.append('file', documents[documentName]);

      const results = await axios.post(
        'http://localhost:4000/api/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setDocumentsURL((prevUploads) => ({
        ...prevUploads,
        [documentName]: results.data.application,
      }));
      console.log(documentsURL)
    } catch (err) {
      console.log(err);
    }
  };


  if (isLoading) {
    return <p>Loading...</p>
  }


  return (
    <>
      <div className="container" style={{ paddingLeft:"50px", paddingRight:"50px", minHeight:"100vh", minWidth:"100vw", maxHeight:"100vh", maxWidth:"100vw", zIndex:"1000", position:"absolute", top:"0", background:"#fff"}}>
        <div className="text-center" style={{ marginTop: '40px' }}></div>
        <Link
        to="/"
        onClick={() => {
            onGoBack();
        }}
        >
        Back
        </Link>
        <h3 className="text-center"><strong>{selectedApplication?.appType?.applicationName}</strong></h3><br/>
        <div className="row justify-content-center">
          <div className="col-md-6">
            <p><strong>Owner's Full Name:</strong> <input onChange={(e)=>setOwnerFullName(e.target.value)} defaultValue={ownerFullName} className='col-md-4 form-control' /></p>
            <p><strong>Owner's Address:</strong> <input onChange={(e)=>setOwnerAddress(e.target.value)}  defaultValue={ownerAddress} className='col-md-4 form-control' /></p>
            <p><strong>Previous Owner Type:</strong> <input onChange={(e)=>setPrevOwnerType(e.target.value)}  defaultValue={prevOwnerType} className='col-md-4 form-control' /></p>
            <strong>Developed</strong>
            <select className="col-md-3 form-control" name="developed" id="developed"  defaultValue={developed} onChange={(e)=>setDeveloped(e.target.value)} required>
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>
            <strong>Occupied</strong>
            <select className="col-md-3 form-control" name="developed" id="occupied"  defaultValue={occupied} onChange={(e)=>setOccupied(e.target.value)} required>
                <option value="true">Yes</option>
                <option value="false">No</option>
            </select>
            </div>
          <div className="col-md-6">
            <p><strong>Resident Type:</strong> <input  defaultValue={residentType} onChange={(e)=>setResidentType(e.target.value)} className='col-md-4 form-control' /></p>
            <p><strong>Size (Sqm):</strong> <input  defaultValue={sizeSqm} onChange={(e)=>setSizeSqm(e.target.value)} className='col-md-4 form-control' /></p>
            <p><strong>Location:</strong> <input  defaultValue={location} onChange={(e)=>setLocation(e.target.value)} className='col-md-4 form-control' /></p>
            <p><strong>Status:</strong> <input className='col-md-4 form-control' placeholder={selectedApplication?.status} disabled /></p>
          </div>
            <p style={{marginTop:"10px"}}><strong>Comments:</strong> {selectedApplication.comments ? selectedApplication.comments : "None"}</p>

          <p><strong>Document Files:</strong></p>
            <ul>
            {selectedApplication?.documents?.map((file) => (
                <div key={file._id}>
                    <div className="col-md-6">
                        <span style={{marginRight:"10px"}}><strong>Document:</strong> {file.document}</span> <span style={{marginRight:"10px"}}><strong>Status:</strong> {file.status}</span> {' '}
                        <a href={`http://localhost:4000/${file.url}`} target="_blank" rel="noopener noreferrer">
                        View in new tab
                        </a>
                    </div>

                    <input
                                type="file"
                                onChange={(e) =>
                                  handleFileChange(file.document, e.target.files[0])
                                }
                                style={{ marginLeft: '10px' }}
                              />
                              <button
                                type="button"
                                className='btn btn-secondary'
                                onClick={() => handleDocumentUpload(file.document)}
                              >
                                Upload
                              </button>
                </div>
                ))}
            </ul>
            
            <button onClick={handleUpdateApplication} className='btn btn-primary col-md-6 justify-content-center form-control'>Update Application</button>
        </div>
      </div>
    </>
  );
};

export default SingleApp;
