import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ethers } from 'ethers';
import Adminapp from './Adminapp';
import Adminpapp from './Adminpapp';
import Application from './Application';
import DashboardDet from './DashboardDet';
import Modal from './Modal';
import CreateAppPopup from './CreateAppPopup';

function App() {
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [userAddress, setUserAddress] = useState('');
  const [userRole, setUserRole] = useState('user');
  const [tokenBalance, setTokenBalance] = useState('0');
  const [isConnected, setIsConnected] = useState(false);
  const [applications, setApplications] = useState([]);
  const [allApplications, setAllApplications] = useState({Requested: {count: 0, applications: []}, Pending:  {count: 0, applications: []}});


  const contractAddress = '0x0173627B52159CB065978Dc79d19124bB1861126';
  const abi = [];

  const checkDBForUser = async (address) => {
    try {
      const results = await axios.post(
        `https://landdocs-backend-vkud.onrender.com/api/check-user`,
        { address },
        {}
      );
      setApplications(results.data.applications);
      setUserRole(results.data.role);
      
      if(results.data.role == "admin") {
        try {
          const results = await axios.post(
            `https://landdocs-backend-vkud.onrender.com/api/applications/admin`,
            { address },
            {}
          );
          console.log(results.data)
          setAllApplications(results.data);
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
    if (provider && userAddress) {
      const fetchBalance = async () => {
        const balance = await provider.getBalance(userAddress);
        setTokenBalance(ethers.formatEther(balance));
      };

      fetchBalance();
    }
  }, [provider, userAddress, applications]);



  if (isConnected) {
    if (userRole === 'admin') {
      return (
        <div className="App">
          <div className="container">
            <>
                <nav>
                    <div className="logo">
                        <h4 className="logo">Land <br/> DOCS</h4>
                    </div>
                    <div className="dashboard">
                        <button className="point dashboard" onClick={disconnectWallet} id="connectBtn">Disconnect</button>
                    </div>
                </nav>
              </>
              <div className="wrapper">
                <h3  style={{width:"100%", color:"#fff", textAlign:"center", marginTop:"20px", fontFamily:"monospace", fontSize:"25px"}}>REQUESTED</h3>
                {allApplications.Requested.applications.map((application, index) => (
                  <Adminapp applicationData={application} />
                ))}
              </div>
              <div className="wrapper">
                <h3  style={{width:"100%", color:"#fff", textAlign:"center", marginTop:"20px", fontFamily:"monospace", fontSize:"25px"}}>PENDING</h3>
                {allApplications.Pending.applications.map((application, index) => (
                  <Adminpapp applicationData={application} />
                ))}
              </div>
          </div>
        </div>
      )
    }


    return (
      <div className="App">
          <div className="container">
            <>
                <div className="desktopnav">
                    <div>
                        <h1>Land<br/>DOCS</h1>
                            <button className="point" onClick={disconnectWallet}>Disconnect Wallet</button>
                            <DashboardDet contract={contract} userAddress={userAddress} balance={tokenBalance} />
                    </div>
                </div>
                <nav>
                    <div className="logo">
                        <h4 className="logo">Land <br/> DOCS</h4>
                    </div>
                    <div className="dashboard">
                        <button className="point dashboard" onClick={disconnectWallet} id="connectBtn">Disconnect</button>
                    </div>
                </nav>
            </>
            
            <div className="wrapper">
              <CreateAppPopup
                onApplicationAdded={(newApplication) => {
                setApplications((prevApplications) => [...prevApplications, newApplication]);
              }}
              address={userAddress}
              />
              <button className="point" onClick={console.log("iooo")} style={{width:"70%", margin: "10px 15% 30px 15%", display:"block", padding:"13px", borderRadius:"8px"}}><h4>Successful applications</h4></button>
              {applications.map((application, index) => (
                <div key={index}>
                  <Application applicationData={application} />
                  <svg className="line" xmlns="http://www.w3.org/2000/svg" width="198" height="121" viewBox="0 0 198 121" fill="none">
                    <path d="M1 1L197 120" stroke="white" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="6.56 6.56"/>
                  </svg>
                </div>
              ))}
            </div>
          </div>
        </div>
      )
  }

  else {
    return (
      <>
                <div className="desktopnav">
                    <div>
                      <h1>Land<br/>DOCS</h1>
                            <button className='point' onClick={connectWallet}>Connect Wallet</button>
                            <DashboardDet contract={contract} userAddress={userAddress} balance={tokenBalance} />
                    </div>
                </div>
                <nav>
                    <div className="logo">
                      <h4 className="logo">Land <br/> DOCS</h4>
                    </div>
                    <div className="dashboard">
                        <button  className="point dashboard" onClick={connectWallet} id="connectBtn">Connect</button>
                    </div>
                </nav>
                  
            <Modal text="Connect your wallet to continue" status="error" position="bottom" />
      </>
            
    );
  }
}

export default App;

