const ConnectWallet = ({ onConnect }) => {
  return (
    <div className="container">
      <div>Please connect to wallet to enter the application</div>
      <br />
      <div>
        <button className="action-button" onClick={onConnect}>
          Connect Wallet
        </button>
      </div>
    </div>
  );
};

export default ConnectWallet;
