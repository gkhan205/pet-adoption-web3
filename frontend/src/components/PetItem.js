const PetItem = ({ item, disabled, inProgress, onAdoptPet }) => {
  return (
    <div className="item">
      <div className="image">
        <img src={item.picture} alt="item.name"></img>
      </div>
      <div className="info-holder">
        <div>
          <b>Name:</b> {item.name}
        </div>
        <div>
          <b>Age:</b> {item.age}
        </div>
        <div>
          <b>Breed:</b> {item.breed}
        </div>
        <div>
          <b>Location:</b> {item.location}
        </div>
        <div>
          <b>Description:</b> {item.description}
        </div>
      </div>
      <div className="action-menu">
        <button
          className="action-button"
          disabled={disabled || inProgress}
          onClick={onAdoptPet}
        >
          {disabled ? "Adopted" : "Adopt"}
        </button>
      </div>
    </div>
  );
};

export default PetItem;
