import React, { useState, useEffect } from 'react';


import { Route, Routes } from 'react-router-dom';
import Navigation from './admin/Navigation';
import Applications from './admin/Applications';
import Settings from './admin/Settings';
import Recent from './admin/Recent';
import Application from './admin/Application';

import axios from 'axios';
import { ethers } from 'ethers';
import AOS from 'aos';
import 'aos/dist/aos.css';
import './assets/css/style.css'
import './assets/vendor/aos/aos.css'
import './assets/vendor/bootstrap/css/bootstrap.min.css'
import './assets/vendor/bootstrap-icons/bootstrap-icons.css'
import './assets/vendor/boxicons/css/boxicons.min.css'
import './assets/vendor/glightbox/css/glightbox.min.css'
import './assets/vendor/swiper/swiper-bundle.min.css'
import Modal from './Modal';
import Apps from './Apps';

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState({});
  const [showApps, setShowApps] = useState(false)

  
  const [requirements, setRequirements] = useState([]);
  const [selectedRequirement, setSelectedRequirement] = useState(null);
  const [documents, setDocuments] = useState({});
  const [documentsURL, setDocumentsURL] = useState({});
  const [totalFees, setTotalFees] = useState(0);

  const [ownerFullName, setOwnerFullName] = useState('')
  const [ownerAddress, setOwnerAddress] = useState('')
  const [prevOwnerType, setPrevOwnerType] = useState('')
  const [developed, setDeveloped] = useState('')
  const [occupied, setOccupied] = useState('')
  const [residentType, setResidentType] = useState('')
  const [sizeSqm, setSizeSqm] = useState('')
  const [location, setLocation] = useState('')
  const [isAdminLoaded, setIsAdminLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState();


  const contractAddress = '0x0173627B52159CB065978Dc79d19124bB1861126';
  const abi = [];

  const checkDBForUser = async (address) => {
    try {
      console.log(address)
      const results = await axios.post(
        `http://localhost:4000/api/check-user`,
        { address },
        {}
      );
      setApplications(results.data.applications);
      setUserRole(results.data.role);
      console.log(results.data.role)
      if(results.data.role == "admin") {
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
      }
    } catch (err) {
      console.log(err)
    }
  }

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });

        const web3Provider = new ethers.BrowserProvider(window.ethereum);
        setProvider(web3Provider);
        const signer = await web3Provider.getSigner();

        const chainId = '0x61';
        const isNetworkAdded = await window.ethereum.request({
          method: 'eth_chainId',
        });

        if (isNetworkAdded !== chainId) {
          const networkParams = {
            chainId: '0x61',
            chainName: 'Binance Smart Chain Testnet',
            nativeCurrency: {
              name: 'BNB',
              symbol: 'bnb',
              decimals: 18,
            },
            rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
            blockExplorerUrls: ['https://testnet.bscscan.com/'],
          };

          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [networkParams],
          });
        }

        const accounts = await web3Provider.listAccounts();
        setUserAddress(accounts[0].address);
        checkDBForUser(accounts[0].address)
        console.log("HHHHHHHHH")
        
        const contractInstance = new ethers.Contract(contractAddress, abi, signer);
        setContract(contractInstance);

        setIsConnected(true);
      } catch (error) {
        console.error('Error connecting wallet:', error);
      }
    } else {
      alert('Please install a compatible wallet extension or use MetaMask.');
    }
  };

  const disconnectWallet = () => {
    window.location.reload();
  };

  useEffect(() => {
    if (window.ethereum) {
      if (window.ethereum.selectedAddress) {
        const initiateContract = async () => {
          const web3Provider = new ethers.BrowserProvider(window.ethereum);
          setProvider(web3Provider);
          setUserAddress(window.ethereum.selectedAddress);
          checkDBForUser(window.ethereum.selectedAddress)
          const signer = await web3Provider.getSigner();

          const chainId = '0x61';
          const isNetworkAdded = await window.ethereum.request({
            method: 'eth_chainId',
          });

          if (isNetworkAdded !== chainId) {
            const networkParams = {
              chainId: '0x61',
              chainName: 'Binance Smart Chain Testnet',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
              },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
              blockExplorerUrls: ['https://testnet.bscscan.com/'],
            };

            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [networkParams],
            });

          }

          const contractInstance = new ethers.Contract(contractAddress, abi, signer);
          setContract(contractInstance);
          setIsConnected(true);
        };

        initiateContract();
      }

      window.ethereum.on('accountsChanged', (accounts) => {
        if (accounts.length === 0) {
          setProvider(null);
          setUserAddress('');
          setIsConnected(false);
        } else {
          setUserAddress(accounts[0]);
          checkDBForUser(accounts[0])

          connectWallet();
        }
      });

    }
  }, []);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }, []);
  
  useEffect(() => {
    if (provider && userAddress) {
      const fetchBalance = async () => {
        const balance = await provider.getBalance(userAddress);
        setTokenBalance(ethers.formatEther(balance));
      };

      fetchBalance();
    }
  }, [provider, userAddress, applications]);



  const getRequirements = async () => {
    try {
      const results = await axios.get(
        `http://localhost:4000/api/requirements`,
        {}
      );
      setRequirements(results.data);
    } catch (err) {
      console.log(err);
    }
  };

  const calculateTotalFees = () => {
    if (selectedRequirement) {
      const fees = selectedRequirement.requiredDocuments.reduce(
        (total, doc) => total + doc.fee,
        0
      );
      setTotalFees(fees);
    }
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
        [documentName]: results.data,
      }));
    } catch (err) {
      console.log(err);
    }
  };

  const handleApplicationSubmit = async () => {
    if (!ownerFullName || !ownerAddress || !prevOwnerType || !developed || !occupied || !residentType || !sizeSqm || !location) {
      alert("Fill in the required fields")
      return
    } 
    calculateTotalFees();

    if (window.ethereum) {
      try {
        const account = await window.ethereum.request({
          method: "eth_accounts",
        });
        const paymentTransaction = {
          from: account[0],
          to: '0x36C29A945be74516303B367a6aFEF0692A9Ae4cb',
          value: totalFees.toString(),
        };

        await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [paymentTransaction],
        });
        

        const results = await axios.post(
          'http://localhost:4000/api/applications',
          { address:userAddress, ownerFullName, ownerAddress, prevOwnerType, developed, occupied, residentType, sizeSqm, location, documentsURL, 'applicationName': selectedRequirement.applicationName },
          {}
        );
        console.log(results)

      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('MetaMask extension not detected');
    }
  };

  const handleRequirementChange = (e) => {
    const selectedReqName = e.target.value;
    const selectedReq = requirements.find(
      (req) => req.applicationName === selectedReqName
    );
    setSelectedRequirement(selectedReq);
  };

  const handleFileChange = (documentName, file) => {
    setDocuments((prevUploads) => ({
      ...prevUploads,
      [documentName]: file,
    }));
  };

  useEffect(() => {
    getRequirements();
    calculateTotalFees();
  }, [selectedRequirement]);

  useEffect(() => {
    if (isConnected && userRole === 'admin' && allApplications && Object.keys(allApplications).length > 0 && !isAdminLoaded) {
      setIsAdminLoaded(true);
      setIsAdmin(true)
      console.log("ADMINNNNNNN")
    }
  }, [isConnected, userRole, allApplications, isAdminLoaded, isAdmin]);


  if (isAdminLoaded && isAdmin) {
      return (
        <div className="container-fluid">
          <div className="main">
            <Navigation />

            <Routes>
                <Route path="/" element={<Recent address={userAddress} />} />
                <Route path="/applications" element={<Applications address={userAddress} />} />
                <Route path="/application/:applicationId" element={<Application address={userAddress} />} />
                <Route path="/settings" element={<Settings address={userAddress}/>} />
            </Routes>
          </div>
        </div>
      )
    }



    return (
      <>
      <header id="header" className="fixed-top d-flex align-items-center">
        <div className="container d-flex align-items-center">
          <div className="logo me-auto">
            <h1><a href="index.html">Land Doc</a></h1>
          </div>
          <nav id="navbar" className="navbar order-last order-lg-0">
            <ul>
              <li><a className="nav-link scrollto active" href="#hero">Home</a></li>
              <li className="dropdown"><a href="#"><span>About</span> <i className="bi bi-chevron-down"></i></a>
                <ul>
                  <li><a className="nav-link scrollto" href="#about">About Us</a></li>
                  <li className="dropdown"><a href="#"><span>Applications</span> <i className="bi bi-chevron-right"></i></a>
                    <ul>
                      <li><a href="#">Legitimacy Search</a></li>
                      <li><a href="#">Survey Plan</a></li>
                      <li><a href="#">Regularization</a></li>
                      <li><a href="#">Certificate of Occupancy</a></li>
                      <li><a href="#">Deed of Assignment</a></li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li><a className="nav-link" style={{cursor:"pointer"}} onClick={()=>{ if(isConnected) setShowApps(true); else alert("Wallet not connected")}}>Applications</a></li>
            </ul>
            <i className="bi bi-list mobile-nav-toggle"></i>
          </nav>
          <div className="header-social-links d-flex align-items-center">
            <a href="#" className="twitter"><i className="bi bi-twitter"></i></a>
            <a href="#" className="facebook"><i className="bi bi-facebook"></i></a>
            <a href="#" className="instagram"><i className="bi bi-instagram"></i></a>
            <a href="#" className="linkedin"><i className="bi bi-linkedin"></i></a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section id="hero">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 pt-5 pt-lg-0 order-2 order-lg-1 d-flex flex-column justify-content-center" data-aos="fade-up">
              <div>
                <h1>Our Trust is Guaranteed</h1>
                <h2>We offer a decentralized application to store land documents that cannot be tampered with. Every record inserted into the blockchain is immutable.</h2>
                <button className="btn-get-started scrollto" onClick={isConnected ? disconnectWallet : connectWallet}>{isConnected ? "Disconnect Wallet" : "Connect Wallet"}</button>
                {isConnected && (
                  <div>
                    {userAddress}<br/>Balance: {tokenBalance} BNB
                  </div>
                )}
                {(isConnected && isAdmin) ?
                    <Link to="/admin">Admin Dashboard</Link>
                    :
                    <></>
                }
              </div>
            </div>
            <div className="col-lg-6 order-1 order-lg-2 hero-img" data-aos="fade-left">
              <img src="assets/img/hero-img.png" className="img-fluid" alt="" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main id="main">
        {/* Contact Section */}
        <section id="contact" className="contact section-bg">
          <div className="container">
            <div className="section-title" data-aos="fade-up">
              <h2>Apply For Documents</h2>
            </div>
            <div className="row">
              <div className="col-lg-12 mt-5 mt-lg-0 d-flex align-items-stretch" data-aos="fade-left">
                <div className="php-email-form">
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="name">Owner's full name</label>
                      <input type="text" name="name" onChange={(e)=>setOwnerFullName(e.target.value)} className="form-control" id="name" required />
                    </div>
                    <div className="form-group col-md-6 mt-3 mt-md-0">
                      <label htmlFor="address">Owner's address</label>
                      <input type="text" onChange={(e)=>setOwnerAddress(e.target.value)} className="form-control" name="address" id="address" required />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="ownerType">Previous owner type</label>
                      <input type="text" onChange={(e)=>setPrevOwnerType(e.target.value)} name="ownerType" className="form-control" id="ownerType" required />
                    </div>
                    <div className="form-group col-md-6 mt-3 mt-md-0">
                      <label htmlFor="developed">Developed</label>
                      <select className="form-control" name="developed" id="developed" onChange={(e)=>setDeveloped(e.target.value)} required>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="name">Occupied</label>
                      <select className="form-control" name="developed" id="occupied" onChange={(e)=>setOccupied(e.target.value)} required>
                        <option value="true">Yes</option>
                        <option value="false">No</option>
                      </select>
                    </div>
                    <div className="form-group col-md-6 mt-3 mt-md-0">
                      <label htmlFor="residentType">Resident type</label>
                      <input type="text" onChange={(e)=>setResidentType(e.target.value)} className="form-control" name="residentType" id="residentType" required />
                    </div>
                  </div>
                  <div className="row">
                    <div className="form-group col-md-6">
                      <label htmlFor="size">Size (Sqm)</label>
                      <input type="number" onChange={(e)=>setSizeSqm(e.target.value)} name="size" className="form-control" id="size" required />
                    </div>
                  </div>
                  <div className="form-group mt-3">
                    <label htmlFor="location">Location</label>
                    <input type="text" onChange={(e)=>setLocation(e.target.value)} className="form-control" name="location" id="location" required />
                  </div>

                  <div className="form-group mt-3">
                    <select
                      onChange={handleRequirementChange}
                      className="app-name-input form-control"
                      style={{
                        width: '35%',
                        padding: '8px',
                        cursor: 'pointer',
                      }}
                      defaultValue="Type of application"
                    >
                      <option value="Type of application" disabled hidden>Type of application</option>
                      {requirements.map((requirement) => (
                        <option key={requirement._id} value={requirement.applicationName}>
                          {requirement.applicationName}
                        </option>
                      ))}
                    </select>
                    {selectedRequirement && (
                      <div>
                        <h5 style={{marginTop:"20px", marginLeft:"10px", fontWeight:"bold"}}>Required Documents:</h5>
                        <ul>
                          {selectedRequirement.requiredDocuments.map((doc) => (
                            <li key={doc._id}>
                              {`${doc.document}: $${doc.fee}`}
                              <input
                                type="file"
                                onChange={(e) =>
                                  handleFileChange(doc.document, e.target.files[0])
                                }
                                style={{ marginLeft: '10px' }}
                              />
                              <button
                                type="button"
                                className='btn btn-secondary'
                                onClick={() => handleDocumentUpload(doc.document)}
                              >
                                Upload
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="text-center">
                    <button
                    className='btn btn-primary'
                    style={{padding:"7px 12px"}}
                      id="submitApplication"
                      onClick={ isConnected ? handleApplicationSubmit : connectWallet}
                    >
                      { isConnected ? `Apply - (Pay ${totalFees} BNB)` : 'Connect Wallet' }
                    </button>
                  </div>
                  {/*
                  <div className="form-group mt-3">
                    <label htmlFor="message">Message</label>
                    <textarea className="form-control" name="message" rows="10" required></textarea>
                  </div>
                  <div className="my-3">
                    <div className="loading">Loading</div>
                    <div className="error-message"></div>
                    <div className="sent-message">Your message has been sent. Thank you!</div>
                  </div>
                  <div className="text-center"><button type="submit">Send Message</button></div>
                  */}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="footer">
        <div className="container">
          <div className="copyright">
            &copy; Copyright <strong><span>Scaffold</span></strong>. All Rights Reserved
          </div>
          <div className="credits">
            Designed by <a href="#">Mrs Beautiful Lady</a>
          </div>
        </div>
      </footer>

      {/* Back-to-top button */}
      <a href="#" className="back-to-top d-flex align-items-center justify-content-center">
        <i className="bi bi-arrow-up-short"></i>
      </a>
      {showApps && (<Apps address={userAddress} setShowApps={setShowApps}/>)}
    </>
    );
  }

export default App;

