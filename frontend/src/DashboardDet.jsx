import React, { useEffect, useState } from 'react'
import Modal from './Modal';

const DashboardDet = ({contract, userAddress, balance}) => {
  const [reason, setReason] = useState('');
  const [showEModal, setShowEModal] = useState(false);

  useEffect(() => {
    if (contract && userAddress) {
    }
  }, [contract, userAddress]);

  return (
    <>
        <p>
          <h5>{userAddress}</h5>
          <h5>Balance: {balance}BNB</h5>
          <br/>
          Welcome to Land Docs<br/>
        </p>
        
          { showEModal && <Modal text={reason} status="error" /> }
          <div>
            <p>Quick Updates and Feedbacks</p>
            <p>Reliable Verification</p>
            <p>Swift web3 onboarding</p>
            <p>On-chain Data Storage</p>
          </div>
    </>
  )
}

export default DashboardDet