const TxError = ({ message, onDismiss }) => {
  return (
    <div className="message-warning" role="alert">
      <div>Error sending transaction: {message}</div>
      <br />
      <button
        type="button dismiss-button"
        className="close"
        onClick={onDismiss}
      >
        <div>Dismiss</div>
      </button>
    </div>
  );
};

export default TxError;
