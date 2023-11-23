const WalletNotDetected = () => {
  return (
    <div className="container">
      <div className="alert alert-danger">
        <h1>Wallet Not Detected</h1>
        <p>
          This application requires the{" "}
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://metamask.io/"
          >
            MetaMask
          </a>{" "}
          wallet. Please install it and refresh the page.
        </p>
      </div>
    </div>
  );
};

export default WalletNotDetected;
