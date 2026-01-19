import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid'; // Installa: npm install uuid
import ButtonNumber from "./components/button";
import Generatore from "./pages/Generatore"; 
import MainMenu from "./pages/MainMenu";
import './css/app.css';

function App() {
  const [currentPage, setCurrentPage] = useState('main'); // 'main' or 'generator'
  const [currentGeneratorId, setCurrentGeneratorId] = useState(null);
  const [generators, setGenerators] = useState(() => {
    // Carica da localStorage se esiste
    const saved = localStorage.getItem('generators');
    return saved ? JSON.parse(saved) : [];
  });

  // Salva i generatori nel localStorage
  useEffect(() => {
    localStorage.setItem('generators', JSON.stringify(generators));
  }, [generators]);

  // Crea nuovo generatore
  const createNewGenerator = (name) => {
    const newGenerator = {
      id: uuidv4(),
      name: name || `Generatore ${generators.length + 1}`,
      createdAt: new Date().toISOString(),
      data: {
        maxNumber: 25,
        history: [],
        selectedNumbers: [],
        lastNumber: 0
      }
    };
    
    setGenerators([...generators, newGenerator]);
    return newGenerator.id;
  };

  // Aggiorna i dati di un generatore
  const updateGeneratorData = (generatorId, newData) => {
    setGenerators(generators.map(gen => {
      if (gen.id === generatorId) {
        return {
          ...gen,
          data: newData,
          updatedAt: new Date().toISOString()
        };
      }
      return gen;
    }));
  };

  // Elimina un generatore
  const deleteGenerator = (generatorId) => {
    setGenerators(generators.filter(gen => gen.id !== generatorId));
    if (currentGeneratorId === generatorId) {
      setCurrentPage('main');
    }
  };

  // Rinomina un generatore
  const renameGenerator = (generatorId, newName) => {
    setGenerators(generators.map(gen => {
      if (gen.id === generatorId) {
        return { ...gen, name: newName };
      }
      return gen;
    }));
  };

  // Apri un generatore esistente
  const openGenerator = (generatorId) => {
    setCurrentGeneratorId(generatorId);
    setCurrentPage('generator');
  };

  // Torna al menu principale
  const goToMainMenu = () => {
    setCurrentPage('main');
    setCurrentGeneratorId(null);
  };

  // Trova il generatore corrente
  const currentGenerator = generators.find(gen => gen.id === currentGeneratorId);

  return (
    <div className="app-container">
      {currentPage === 'main' ? (
        <MainMenu
          generators={generators}
          onCreateGenerator={createNewGenerator}
          onOpenGenerator={openGenerator}
          onDeleteGenerator={deleteGenerator}
          onRenameGenerator={renameGenerator}
        />
      ) : (
        <Generatore
          generator={currentGenerator}
          onUpdateData={(data) => updateGeneratorData(currentGeneratorId, data)}
          onBack={goToMainMenu}
        />
      )}
    </div>
  );
}

export default App;