import { useState, useEffect, useCallback } from "react";
import ButtonNumber from "../components/ButtonNumber";
import '../css/generatore.css';
import '../css/buttonsGrid.css';

function Generatore({ generator, onUpdateData, onBack }) {
  const [rnd, setRnd] = useState(generator?.data?.lastNumber || 0);
  const [maxNumber, setMaxNumber] = useState(generator?.data?.maxNumber || 25);
  const [selectedNumbers, setSelectedNumbers] = useState(
    new Set(generator?.data?.selectedNumbers || [])
  );
  const [excludedNumbers, setExcludedNumbers] = useState(
    new Set(generator?.data?.excludedNumbers || [])
  );
  const [availableNumbers, setAvailableNumbers] = useState([]);
  const [history, setHistory] = useState(generator?.data?.history || []);
  const [isButtonActive, setIsButtonActive] = useState(false);

  // Salva i dati quando cambiano
  useEffect(() => {
    if (generator) {
      const generatorData = {
        maxNumber,
        history,
        selectedNumbers: Array.from(selectedNumbers),
        excludedNumbers: Array.from(excludedNumbers),
        lastNumber: rnd
      };
      onUpdateData(generatorData);
    }
  }, [maxNumber, history, selectedNumbers, excludedNumbers, rnd, generator, onUpdateData]);

  // Inizializza i numeri disponibili
  useEffect(() => {
    const numbers = Array.from({ length: maxNumber }, (_, i) => i + 1);
    setAvailableNumbers(numbers);

    // Rimuovi dai selezionati i numeri oltre il nuovo massimo
    setSelectedNumbers(prev => {
      const newSet = new Set(prev);
      Array.from(prev).forEach(num => {
        if (num > maxNumber) newSet.delete(num);
      });
      return newSet;
    });

    // Rimuovi dagli esclusi i numeri oltre il nuovo massimo
    setExcludedNumbers(prev => {
      const newSet = new Set(prev);
      Array.from(prev).forEach(num => {
        if (num > maxNumber) newSet.delete(num);
      });
      return newSet;
    });
  }, [maxNumber]);

  // Incrementa il massimo
  const increaseMax = () => {
    if (maxNumber < 100) {
      setMaxNumber(prev => prev + 1);
    }
  };

  // Decrementa il massimo
  const decreaseMax = () => {
    if (maxNumber > 5) {
      const newMax = maxNumber - 1;
      setMaxNumber(newMax);
    }
  };

  // Reset massimo
  const resetMax = () => {
    setMaxNumber(30);
  };

  // Reset tutti i selezionati
  const resetSelected = () => {
    setSelectedNumbers(new Set());
    setRnd(0);
  };

  // Reset tutti gli esclusi
  const resetExcluded = () => {
    setExcludedNumbers(new Set());
  };

  // Reset completo
  const resetAll = () => {
    setMaxNumber(30);
    setSelectedNumbers(new Set());
    setExcludedNumbers(new Set());
    setRnd(0);
    setHistory([]);
  };

  // Gestione click su bottone numero (lista principale)
  const handleNumberClick = (number) => {
    setSelectedNumbers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(number)) {
        newSet.delete(number);
      } else {
        // SOLO AGGIUNGI - non rimuovere dagli esclusi
        newSet.add(number);
      }
      return newSet;
    });

    // Aggiungi alla storia se selezionato
    if (!selectedNumbers.has(number)) {
      setHistory(prev => {
        const newHistory = [number, ...prev];
        return newHistory.slice(0, 30);
      });
    }
  };

  // Gestione click su bottone numero (lista esclusi)
  const handleExcludedClick = (number) => {
    setExcludedNumbers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(number)) {
        newSet.delete(number);
      } else {
        // SOLO AGGIUNGI - non rimuovere dai selezionati
        newSet.add(number);
      }
      return newSet;
    });
  };
  // Genera numero casuale che non sia NE' selezionato NE' escluso
  const generateRandom = useCallback(() => {
    // Calcola numeri realmente disponibili
    const trulyAvailableNumbers = availableNumbers.filter(num =>
      !selectedNumbers.has(num) && !excludedNumbers.has(num)
    );

    if (trulyAvailableNumbers.length === 0) {
      alert("Nessun numero disponibile! Tutti i numeri sono stati selezionati o esclusi.");
      return;
    }

    setIsButtonActive(true);

    const randomIndex = Math.floor(Math.random() * trulyAvailableNumbers.length);
    const randomNum = trulyAvailableNumbers[randomIndex];

    setRnd(randomNum);

    // Aggiungi ai selezionati (il numero estratto diventa automaticamente selezionato)
    setSelectedNumbers(prev => new Set([...prev, randomNum]));

    // Aggiungi alla storia
    setHistory(prev => {
      const newHistory = [randomNum, ...prev];
      return newHistory.slice(0, 30);
    });

    setTimeout(() => setIsButtonActive(false), 150);
  }, [availableNumbers, selectedNumbers, excludedNumbers]);

  // Funzione per deselezionare tutti i selezionati
  const deselectAll = () => {
    setSelectedNumbers(new Set());
  };

  // Funzione per deselezionare tutti gli esclusi
  const deselectAllExcluded = () => {
    setExcludedNumbers(new Set());
  };

const getGridSizeClass = () => {
  if (maxNumber <= 15) return 'grid-size-small';
  if (maxNumber <= 30) return 'grid-size-medium';
  if (maxNumber <= 50) return 'grid-size-large';
  return 'grid-size-xlarge';
};
  // Calcola statistiche
  const selectedPercentage = Math.round((selectedNumbers.size / maxNumber) * 100);
  const excludedPercentage = Math.round((excludedNumbers.size / maxNumber) * 100);
  const trulyAvailableCount = maxNumber - selectedNumbers.size - excludedNumbers.size;
  const trulyAvailablePercentage = Math.round((trulyAvailableCount / maxNumber) * 100);



const getButtonSizeClass = () => {
  if (maxNumber <= 15) return 'button-size-small';
  if (maxNumber <= 30) return 'button-size-medium';
  if (maxNumber <= 50) return 'button-size-large';
  return 'button-size-xlarge';
};

  return (
    <div className="generatore-container">
      {/* Header con nome generatore e tasto back */}
      <header className="generatore-header">
        <button className="back-button" onClick={onBack}>
          ← Torna al Menu
        </button>
        <h1 className="generatore-title">
          {generator?.name || 'Generatore'}
        </h1>
        <div className="header-info">
          <span className="generatore-date">
            Creato: {new Date(generator?.createdAt).toLocaleDateString()}
          </span>
        </div>
      </header>

      <main className="generatore-content">
        {/* Controlli Generazione */}
        <div className="generation-section">
          <div className="generation-controls">
            <button
              className="generate-btn"
              onClick={generateRandom}
              disabled={trulyAvailableCount === 0}
              onMouseDown={() => setIsButtonActive(true)}
              onMouseUp={() => setIsButtonActive(false)}
              onMouseLeave={() => setIsButtonActive(false)}
            >
              <span className="btn-main-text">
                {isButtonActive ? 'GENERANDO...' : 'GENERA CASUALE'}
              </span>
              <span className="btn-sub-text">
                {trulyAvailableCount === 0
                  ? 'Nessun numero disponibile'
                  : `${trulyAvailableCount} disponibili`}
              </span>
            </button>
          </div>

          {/* Ultimo Numero Generato */}
          {rnd > 0 && (
            <div className="current-result">
              <div className="result-display">
                <span className="result-number">{rnd}</span>
                <span className="result-status">
                  {selectedNumbers.has(rnd) ? '✓ Selezionato' : ''}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Grid doppia: Selezionati vs Esclusi */}
        <div className="dual-grid-section">
          {/* Numeri Selezionati */}
          <div className="numbers-grid-section">
            <div className="section-header">
              <h2>Numeri Selezionati ({selectedNumbers.size})</h2>
            </div>

           <div className={`numbers-grid selected-grid ${getGridSizeClass()}`}>
  {availableNumbers.map(number => (
    <ButtonNumber
      key={`selected-${number}`}
      id={`selected-${number}`}
      buttonName={number.toString()}
      onClick={() => handleNumberClick(number)}
      isSelected={selectedNumbers.has(number)}
      isDoubleSelected={selectedNumbers.has(number) && excludedNumbers.has(number)}
      isDisabled={false}
      className={`${getButtonSizeClass()} ${
        excludedNumbers.has(number) ? 'conflict' : ''
      }`}
    />
  ))}
</div>
            <div className="grid-stats">
              <span className="stat-label">Selezionati: </span>
              <span className="stat-value">{selectedNumbers.size}</span>
              <span className="stat-percentage">({selectedPercentage}%)</span>
            </div>
          </div>

          {/* Numeri Esclusi */}
          <div className="numbers-grid-section excluded-section">
            <div className="section-header">
              <h2>Numeri Esclusi ({excludedNumbers.size})</h2>
              
            </div>

            <div className="numbers-grid excluded-grid">
              {availableNumbers.map(number => (
                <ButtonNumber
                  key={`excluded-${number}`}
                  id={`excluded-${number}`}
                  buttonName={number.toString()}
                  onClick={() => handleExcludedClick(number)}
                  isSelected={excludedNumbers.has(number)}
                  isDoubleSelected={selectedNumbers.has(number) && excludedNumbers.has(number)}
                  isDisabled={false}
                />
              ))}
            </div>
            <div className="grid-stats">
              <span className="stat-label">Esclusi: </span>
              <span className="stat-value">{excludedNumbers.size}</span>
              <span className="stat-percentage">({excludedPercentage}%)</span>
            </div>
          </div>
        </div>

        {/* Controllo Massimo */}
        <div className="max-controls">
          <span className="max-label">Numeri totali: {maxNumber}</span>
          <div className="max-buttons">
            <button
              className="control-btn decrease-btn"
              onClick={decreaseMax}
              disabled={maxNumber <= 5}
              title="Riduci di 1"
            >
              −
            </button>
            <button
              className="control-btn reset-max-btn"
              onClick={resetMax}
              title="Reset a 30"
            >
              30
            </button>
            <button
              className="control-btn increase-btn"
              onClick={increaseMax}
              disabled={maxNumber >= 100}
              title="Aumenta di 1"
            >
              +
            </button>
          </div>

          {/* Barre di progresso multiple */}
          <div className="multi-progress-bar">
            <div className="progress-segment selected-segment" style={{ width: `${selectedPercentage}%` }}>
              <span className="progress-label">Selezionati</span>
            </div>
            <div className="progress-segment excluded-segment" style={{ width: `${excludedPercentage}%` }}>
              <span className="progress-label">Esclusi</span>
            </div>
            <div className="progress-segment available-segment" style={{ width: `${trulyAvailablePercentage}%` }}>
              <span className="progress-label">Disponibili</span>
            </div>
          </div>

          <div className="progress-stats">
            <div className="progress-stat-item">
              <span className="stat-dot selected-dot"></span>
              <span>Selezionati: {selectedNumbers.size}</span>
            </div>
            <div className="progress-stat-item">
              <span className="stat-dot excluded-dot"></span>
              <span>Esclusi: {excludedNumbers.size}</span>
            </div>
            <div className="progress-stat-item">
              <span className="stat-dot available-dot"></span>
              <span>Disponibili: {trulyAvailableCount}</span>
            </div>
          </div>
        </div>
      </main>

      <footer className="generatore-footer">
        <div className="footer-stats">
          <div className="stat-item">
            <span className="stat-label">Totali:</span>
            <span className="stat-value">{maxNumber}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label selected-stat">Selezionati:</span>
            <span className="stat-value selected-value">{selectedNumbers.size}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label excluded-stat">Esclusi:</span>
            <span className="stat-value excluded-value">{excludedNumbers.size}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label available-stat">Disponibili:</span>
            <span className="stat-value available-value">{trulyAvailableCount}</span>
          </div>
        </div>

        <div className="footer-actions">
          <button
            className="reset-selected-btn"
            onClick={resetSelected}
            disabled={selectedNumbers.size === 0}
          >
            <span className="btn-icon">↺</span>
            Reset Selezionati
          </button>
          <button
            className="reset-excluded-btn"
            onClick={resetExcluded}
            disabled={excludedNumbers.size === 0}
          >
            <span className="btn-icon">↺</span>
            Reset Esclusi
          </button>
          <button
            className="reset-all-btn"
            onClick={resetAll}
          >
            <span className="btn-icon">⟲</span>
            Reset Completo
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Generatore;