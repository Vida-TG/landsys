import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

import customer1 from '../assets/admin/imgs/customer01.jpg'
import '../assets/admin/vendor/bootstrap/css/bootstrap.min.css'
import '../assets/admin/css/style.css'

const Application = ({ address }) => {
  const { applicationId } = useParams();
  const [application, setApplication] = useState();
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('');
  const [documentStatuses, setDocumentStatuses] = useState({});
  const [comments, setComments] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const results = await axios.post(
          `http://localhost:4000/api/applications/${applicationId}`,
          { address },
          {}
        );
        setApplication(results.data.application);

        const options = {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: 'numeric',
          minute: 'numeric',
          second: 'numeric',
          hour12: false,
        };
        const logsWithISOStrings = results.data.logs.map(log => {
          const isoDateString = new Date(log.date).toLocaleDateString(undefined, options);
          console.log(isoDateString)
          return { ...log, date: isoDateString };
        });
        setLogs(logsWithISOStrings)
  
        setStatus(results.data.application.status)
        const initialDocumentStatuses = {};
        results.data.application.documents.forEach((document) => {
          initialDocumentStatuses[document._id] = document.status;
        });
        setDocumentStatuses(initialDocumentStatuses);
      } catch (err) {
        console.log(err);
      }
    };
  
    fetchData();
  }, [applicationId]);


  const handleUpdateStatus = async () => {
    try {
        await axios.put(
            `http://localhost:4000/api/applications/status/${applicationId}`,
            { status, comments, address },
            {}
        );
        
        await Promise.all(
            Object.entries(documentStatuses).map(([documentId, documentStatus]) =>
            axios.put(
                `http://localhost:4000/api/documents/${documentId}/status`,
                { status: documentStatus },
                {}
            )
            )
        );
        navigate('/applications');
        
    } catch (err) {
      console.log(err);
    }
  };

  const handleDocumentStatusChange = (documentId, newStatus) => {
    setDocumentStatuses({
      ...documentStatuses,
      [documentId]: newStatus,
    });
  };


  return (
    <>
      <div className="container">
        <div style={{ marginTop: '40px' }}></div>
        <h3><strong>{application?.appType?.applicationName}</strong></h3><br/>
        <div className="row">
          <div className="col-md-6">
            <p><strong>Owner's Full Name:</strong> {application?.ownerFullName}</p>
            <p><strong>Owner's Address:</strong> {application?.ownerAddress}</p>
            <p><strong>Previous Owner Type:</strong> {application?.prevOwnerType}</p>
            <p><strong>Developed:</strong> {application?.developed ? 'Yes' : 'No'}</p>
          </div>
          <div className="col-md-6">
            <p><strong>Resident Type:</strong> {application?.residentType}</p>
            <p><strong>Size (Sqm):</strong> {application?.sizeSqm}</p>
            <p><strong>Location:</strong> {application?.location}</p>
            <p><strong>Occupied:</strong> {application?.occupied ? 'Yes' : 'No'}</p>
          </div>
          <label>
            <strong>Application status:</strong> {application?.status}
              <select value={status} onChange={(e) => setStatus(e.target.value)} className='col-md-3 form-control'>
                <option value="Pending">Pending</option>
                <option value="Approved">Approved</option>
                <option value="ActionNeeded">Action Needed</option>
                <option value="Completed">Completed</option>
              </select>
            </label>
            <br />
            <label>
                <strong>Comments:</strong>
                <textarea
                    value={comments}
                    onChange={(e) => setComments(e.target.value)}
                    className='form-control'
                />
            </label>

          <p><strong>Document Files:</strong></p>
            <ul>
            {application?.documents?.map((file) => (
                <div key={file._id}>
                    <div className="col-md-6">
                        {file.document} :{' '}
                        <a href={`http://localhost:4000/${file.url}`} target="_blank" rel="noopener noreferrer">
                        View in new tab
                        </a>
                    </div>

                    <label className="col-md-6">
                    <select
                        className='form-control'
                        value={documentStatuses[file._id] || ''}
                        onChange={(e) =>
                            handleDocumentStatusChange(file._id, e.target.value)
                        }
                    >
                        <option value="Pending">Pending</option>
                        <option value="Approved">Approved</option>
                        <option value="ActionNeeded">Action Needed</option>
                        <option value="Completed">Completed</option>
                    </select>
                    </label><br/>
                </div>
                ))}
            </ul>
            
            <button onClick={handleUpdateStatus} className='btn btn-primary form-control col-md-6'>Update Status</button>
        </div>

        <div>
          <div style={{height:"70px"}}></div>
          <div class="cardHeader">
            <h2>Logs</h2>
          </div>
          <table class="table table-striped table-hover table-bordered" style={{width: "100%"}}>
            <thead>
              <tr>
                <td>Date</td>
                <td>Data</td>
                <td>Admin</td>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr>
                  <td>{log?.date}</td>
                  <td>{log?.data}</td>
                  <td>{log?.adminId.address.substring(0, 5)}...{log?.adminId?.address.slice(-3)}</td>
                </tr>
              ))}

            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default Application;
