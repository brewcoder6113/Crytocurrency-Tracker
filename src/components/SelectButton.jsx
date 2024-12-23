import './styles/selectButton.css';
const SelectButton = ({ children,onClick }) => {

  return (
    <span onClick={onClick} className="selectbutton">
      {children}
    </span>
  );
};

export default SelectButton;