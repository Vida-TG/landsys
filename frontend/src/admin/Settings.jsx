import React, {useState, useEffect} from 'react'
import axios from 'axios';
import Modal from '../Modal';

import '../assets/admin/vendor/bootstrap/css/bootstrap.min.css'
import '../assets/admin/css/style.css'

const Settings = ({address}) => {
    const [applicationName, setApplicationName] = useState('');
    const [document, setDocument] = useState('');
    const [loading, setLoading] = useState(false);
    const [adminLoading, setAdminLoading] = useState(false);
    const [fee, setFee] = useState();
    const [documents, setDocuments] = useState({});
    const [showSModal, setShowSModal] = useState(false);
    const [showEModal, setShowEModal] = useState(false);
    const [adminAddress, setAdminAddress] = useState("");
    const [reason, setReason] = useState("Could not get application details");


    const handleCreate = async () => {
        if (applicationName && (Object.keys(documents).length > 0)) {
            setLoading(true)
            console.log("data")
            try {
                console.log("results.data")
                const results = await axios.post(
                  `http://localhost:4000/api/requirements`,
                  { address, requiredDocuments:documents, applicationName },
                  {}
                );
                
                console.log(results.data)
                setReason(results.data.message)
                if (results.data.status == "success") setShowSModal(true);
                else setShowEModal(true);
            } catch (err) {
                console.log(err)
            }
            setLoading(false);
            setApplicationName('');
            setFee();
            setDocuments([]);
        }
      };
    
      const handleSaveDoc = async () => {
        if (document && fee) {
          setDocuments({ ...documents, [document]: fee });
          setDocument('');
          setFee('');
        }
      };

      const handleAddAdmin = async () => {
        if (adminAddress) {
            setAdminLoading(true)
            try {
                const results = await axios.post(
                  `http://localhost:4000/api/users/make-admin`,
                  { address, adminAddress },
                  {}
                );
                
                setReason(results.data.message)
                setAdminAddress("")
                if (results.data.status == "success") setShowSModal(true);
                else setShowEModal(true);
            } catch (err) {
                console.log(err)
            }
            setAdminLoading(false);
        }
      }

      
  return (
    <>
        <div className="main">
            <div style={{height:"40px"}}></div>
            <div className="row">
                <div className="col-lg-offset-1 col-lg-7">
                    <div className="cardHeader">
                        <h2>Add requirements for an application type</h2>
                    </div>

                    <div className="form-container">
                        <div className="form-group">
                            <label>Application Name</label>
                            <input
                                type="text"
                                placeholder="Application Name"
                                value={applicationName}
                                onChange={(e) => setApplicationName(e.target.value)}
                                className="form-control input-lg"
                                required
                            />
                        </div>
                        <div className="form-group">
                        <div className="form-group">
                            <label>Add Document</label>
                            <input
                                type="text"
                                placeholder="Document name"
                                value={document}
                                onChange={(e) => setDocument(e.target.value)}
                                className="form-control input-md"
                                required
                                style={{marginBottom:"2px"}}
                            />
                            <input
                                type="number"
                                placeholder="Fee"
                                value={fee}
                                onChange={(e) => setFee(e.target.value)}
                                className="form-control input-md"
                                style={{marginBottom:"5px"}}
                                required
                            />
                            <button onClick={handleSaveDoc} className='btn btn-secondary input-lg form-control'>Add Document</button>
                        </div>
                        
                        { loading ? 
                            <button style={{cursor:"default"}} className='btn btn-warning form-control'>...loading</button>
                            :
                            <button onClick={handleCreate} className='btn btn-primary form-control'>Save all</button>
                        }
                    </div>
                    <div style={{fontSize:"17px", fontFamily:"monospace", margin:"5px auto"}}>
                    {Object.keys(documents).length > 0 && (
                        <>
                        <span style={{ fontWeight: "bold", fontSize: "20px" }}>Docs: </span>
                        {Object.entries(documents).map(([doc, fee], index, array) => (
                            <span key={index}>
                            {`${doc}: $${fee}${index < array.length - 1 ? ", " : ""}`}
                            </span>
                        ))}
                        </>
                    )}
                        {Object.keys(documents).length > 0 && (<button onClick={() => setDocuments({})} style={{ margin:"5px", fontFamily:"monospace", padding:"4px 8px", cursor:"pointer"}}>Clear</button>)}
                    </div>
                    
                    <br/><br/>


                    <div className="cardHeader">
                        <h2>Add an admin</h2>
                    </div>
                    <div className="form-container">
                        <div className="form-group">
                            <label>Wallet address</label>
                            <input
                                type="text"
                                placeholder="Address"
                                value={adminAddress}
                                onChange={(e) => setAdminAddress(e.target.value)}
                                className="form-control input-lg"
                                required
                            />
                        </div>
                        { loading ? 
                            <button style={{cursor:"default"}} className='btn btn-warning form-control'>...loading</button>
                            :
                            <button onClick={handleAddAdmin} className='btn btn-primary form-control'>Add admin</button>
                        }
                    </div>
                </div>
                    { showSModal && <Modal text={reason} status="success" /> }
                    { showEModal && <Modal text={reason} status="error" /> }

                </div>
            </div>
        </div>
    </>
  )
}

export default Settings