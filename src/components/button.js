// In src/components/ButtonNumber.js
function ButtonNumber({ 
  id, 
  buttonName, 
  onClick, 
  isSelected, 
  isDisabled,
  isDoubleSelected = false  // Nuova prop per indicare se è in entrambe le liste
}) {
  const className = `number-button ${isSelected ? 'selected' : ''} ${isDoubleSelected ? 'double-selected' : ''}`;
  
  return (
    <button 
      id={id}
      className={className}
      onClick={onClick}
      disabled={isDisabled}
      aria-label={`Numero ${buttonName}`}
      title={`Clicca per ${isSelected ? 'deselezionare' : 'selezionare'} il numero ${buttonName}`}
    >
      <span className="button-number">{buttonName}</span>
      {isSelected && (
        <span className="selected-indicator">
          {isDoubleSelected ? '★' : '✓'}
        </span>
      )}
    </button>
  );
}

export default ButtonNumber;