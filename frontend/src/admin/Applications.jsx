import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

import customer1 from '../assets/admin/imgs/customer01.jpg'
import '../assets/admin/vendor/bootstrap/css/bootstrap.min.css'
import '../assets/admin/css/style.css'

const Applications = ({address}) => {

    const [allApplications, setAllApplications] = useState();
  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const results = await axios.post(
                  `http://localhost:4000/api/applications/admin`,
                  { address },
                  {}
                );
                setAllApplications(results.data);
                setIsAdmin(true)
                setIsAdminLoaded(true);
                console.log("ADMINNNNNNN")
              } catch (err) {
                console.log(err)
              }
        };
    
        fetchData();
    }, []);
    
  return (
    <>
        <div class="container">
            <div class="row">
            
                <div style={{height:"50px"}}></div>
                <div class=" col-lg-12">
                    <div class="cardHeader">
                        <h2>Pending Applications</h2>
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
                            {allApplications?.Pending.applications.map((application, index) => (
                                <tr>
                                    <td>{index}</td>
                                    <td>{application.appType.applicationName}</td>
                                    <td>Paid</td>
                                    <td><span className="status pending">{application.status}</span></td>
                                    <td><Link to={`/application/${application._id}`}>View Info</Link> / <a href="#">Print</a></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>


                <div style={{height:"30px"}}></div>
                <div class=" col-lg-12">
                    <div class="cardHeader">
                        <h2>Approved Applications</h2>
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
                            {allApplications?.Approved.applications.map((application, index) => (
                                <tr>
                                    <td>{index}</td>
                                    <td>{application.appType.applicationName}</td>
                                    <td>Paid</td>
                                    <td><span className="status inProgress">{application.status}</span></td>
                                    <td><Link to={`/application/${application._id}`}>View Info</Link> / <a href="#">Print</a></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>



                <div style={{height:"30px"}}></div>
                <div class=" col-lg-12">
                    <div class="cardHeader">
                        <h2>Action Needed</h2>
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
                            {allApplications?.ActionNeeded.applications.map((application, index) => (
                                <tr>
                                    <td>{index}</td>
                                    <td>{application.appType.applicationName}</td>
                                    <td>Paid</td>
                                    <td><span className="status return">{application.status}</span></td>
                                    <td><Link to={`/application/${application._id}`}>View Info</Link> / <a href="#">Print</a></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>


                <div style={{height:"30px"}}></div>
                <div class=" col-lg-12">
                    <div class="cardHeader">
                        <h2>Completed Applications</h2>
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
                            {allApplications?.Completed.applications.map((application, index) => (
                                <tr>
                                    <td>{index}</td>
                                    <td>{application.appType.applicationName}</td>
                                    <td>Paid</td>
                                    <td><span className="status delivered">{application.status}</span></td>
                                    <td><Link to={`/application/${application._id}`}>View Info</Link> / <a href="#">Print</a></td>
                                </tr>
                            ))}

                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </>
  )
}

export default Applications