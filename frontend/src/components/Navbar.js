const Navbar = ({ address, onChangeView }) => {
  return (
    <div className="navbar-container">
      <div className="navbar">
        <div onClick={() => onChangeView("home")}>Home</div>
        <div onClick={() => onChangeView("profile")}>My Profile</div>
      </div>
      <div className="user-account">Welcome {address}</div>
    </div>
  );
};

export default Navbar;
