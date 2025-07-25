import React from 'react';
import './style.css'; // Assuming you have a CSS file for styling


export default function Toggle() {

  const [isToggled, setIsToggled] = React.useState(false);

  const handleSwitch = () => {
    // Handle the toggle switch logic here
    setIsToggled(!isToggled);
  }

  const toggleStyles = {
    backgroundColor: isToggled ? '#4CAF50' : '#ccc',
    color: isToggled ? '#f44336' : '#000',
  };

  return (
   <div className="toggle-container">
     <div className="toggle-switch" onClick={handleSwitch} style={toggleStyles}>
      <div className={`switch ${isToggled ? 'on' : 'off'}`}>
              <span>{isToggled ? 'On' : 'Off'}</span>
      </div>
     </div>
   </div>
  )
}
