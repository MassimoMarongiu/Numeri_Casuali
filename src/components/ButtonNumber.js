// src/components/ButtonNumber.js
import React from 'react';

const ButtonNumber = ({ id, buttonName, onClick, isSelected, isDisabled }) => {
  return (
    <button 
      id={id}
      className={`number-button ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={`Numero ${buttonName}`}
      title={`Clicca per ${isSelected ? 'deselezionare' : 'selezionare'} il numero ${buttonName}`}
    >
      <span className="button-number">{buttonName}</span>
      {isSelected && (
        <span className="selected-indicator">✓</span>
      )}
    </button>
  );
};

export default ButtonNumber;