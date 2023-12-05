import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SingleApp from './SingleApp';

const Apps = ({address, setShowApps}) => {
    const [applicationList, setApplicationList] = useState();
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            console.log(address)
          try {
            const results = await axios.post(
              'http://localhost:4000/api/my-applications',
              { address },
              {}
            );
            console.log(results.data);
            setApplicationList(results.data);
      
          } catch (err) {
            console.log(err);
          }
        };
      
        fetchData();
    }, []);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, []);
    
    const handleViewInfo = (application) => {
        setSelectedApplication(application);
    };
      
    const handleGoBackToList = () => {
        setSelectedApplication(null);
    };

  return (
    <>
        <div style={{minHeight:"100vh", minWidth:"100vw", maxHeight:"100vh", maxWidth:"100vw", zIndex:"999", position:"absolute", top:"0", background:"#fff"}}>
            <div class="row">
                <div class="col-lg-12">
                    <div class="cardHeader text-center p-3">
                        <h2>Applications</h2>
                        <Link
                            to="/"
                            onClick={() => {
                            setShowApps(false);
                            }}
                        >
                            Back to Home
                        </Link>
                    </div>
                    <table class="table table-striped table-hover table-bordered" style={{width: "100%"}}>
                        <thead>
                            <tr>
                                <td>Owner Hash</td>
                                <td>Application Type</td>
                                <td>Payment Status</td>
                                <td>Status</td>
                                <td>Action</td>
                            </tr>
                        </thead>
                        <tbody>
                            {applicationList?.map((application, index) => (
                                <tr>
                                    <td>{index}</td>
                                    <td>{application?.appType?.applicationName}</td>
                                    <td>Paid</td>
                                    <td><span className="status pending">{application?.status}</span></td>
                                    <td><Link onClick={() => handleViewInfo(application)}>View Info</Link> / <a href="#">Print</a></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        {selectedApplication && (
        <SingleApp
            application={selectedApplication}
            address={address}
            onGoBack={handleGoBackToList}
        />
        )}
    </>
  )
}

export default Apps