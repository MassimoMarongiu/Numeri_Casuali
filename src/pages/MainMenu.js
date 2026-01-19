import { useState } from "react";
import '../css/mainMenu.css';

function MainMenu({ generators, onCreateGenerator, onOpenGenerator, onDeleteGenerator, onRenameGenerator }) {
  const [newGeneratorName, setNewGeneratorName] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');

  const handleCreateGenerator = () => {
    if (newGeneratorName.trim()) {
      const generatorId = onCreateGenerator(newGeneratorName.trim());
      setNewGeneratorName('');
      onOpenGenerator(generatorId);
    } else {
      onCreateGenerator(); // Crea con nome default
    }
  };

  const handleStartEdit = (generator) => {
    setEditingId(generator.id);
    setEditName(generator.name);
  };

  const handleSaveEdit = (generatorId) => {
    if (editName.trim()) {
      onRenameGenerator(generatorId, editName.trim());
    }
    setEditingId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  const handleDeleteGenerator = (generatorId, generatorName) => {
    if (window.confirm(`Sei sicuro di voler eliminare "${generatorName}"?`)) {
      onDeleteGenerator(generatorId);
    }
  };

  return (
    <div className="main-menu-container">
      <header className="main-menu-header">
        <h1>🎲 Gestore Generatori Numerici</h1>
        <p className="subtitle">Crea e gestisci i tuoi generatori di numeri casuali</p>
      </header>

      <main className="main-menu-content">
        {/* Form per creare nuovo generatore */}
        <div className="create-generator-section">
          <h2>Crea Nuovo Generatore</h2>
          <div className="create-form">
            <input
              type="text"
              value={newGeneratorName}
              onChange={(e) => setNewGeneratorName(e.target.value)}
              placeholder="Nome del generatore (opzionale)"
              className="generator-input"
              onKeyPress={(e) => e.key === 'Enter' && handleCreateGenerator()}
            />
            <button 
              className="create-btn"
              onClick={handleCreateGenerator}
            >
              + Crea Nuovo
            </button>
          </div>
          <p className="hint">Lascia vuoto per usare un nome automatico</p>
        </div>

        {/* Lista generatori esistenti */}
        <div className="generators-list-section">
          <h2>
            I Tuoi Generator ({generators.length})
            {generators.length > 0 && (
              <span className="total-estractions">
                Estrazioni totali: {generators.reduce((sum, gen) => sum + gen.data.history.length, 0)}
              </span>
            )}
          </h2>
          
          {generators.length === 0 ? (
            <div className="empty-state">
              <p>Non hai ancora creato generatori.</p>
              <p>Crea il tuo primo generatore per iniziare!</p>
            </div>
          ) : (
            <div className="generators-grid">
              {generators.map(generator => (
                <div key={generator.id} className="generator-card">
                  {editingId === generator.id ? (
                    <div className="edit-mode">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="edit-input"
                        autoFocus
                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit(generator.id)}
                      />
                      <div className="edit-actions">
                        <button 
                          className="save-btn"
                          onClick={() => handleSaveEdit(generator.id)}
                        >
                          ✓
                        </button>
                        <button 
                          className="cancel-btn"
                          onClick={handleCancelEdit}
                        >
                          ✕
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="generator-info">
                        <h3 className="generator-name">{generator.name}</h3>
                        <div className="generator-meta">
                          <span className="meta-item">
                            <span className="meta-label">Creato:</span>
                            <span className="meta-value">
                              {new Date(generator.createdAt).toLocaleDateString()}
                            </span>
                          </span>
                          {generator.updatedAt && (
                            <span className="meta-item">
                              <span className="meta-label">Modificato:</span>
                              <span className="meta-value">
                                {new Date(generator.updatedAt).toLocaleDateString()}
                              </span>
                            </span>
                          )}
                        </div>
                        <div className="generator-stats">
                          <span className="stat-badge">
                            <span className="stat-number">{generator.data.history.length}</span>
                            <span className="stat-label">estrazioni</span>
                          </span>
                          <span className="stat-badge">
                            <span className="stat-number">{generator.data.maxNumber}</span>
                            <span className="stat-label">numeri max</span>
                          </span>
                          <span className="stat-badge">
                            <span className="stat-number">
                              {generator.data.selectedNumbers?.length || 0}
                            </span>
                            <span className="stat-label">selezionati</span>
                          </span>
                        </div>
                      </div>
                      
                      <div className="generator-actions">
                        <button 
                          className="action-btn open-btn"
                          onClick={() => onOpenGenerator(generator.id)}
                        >
                          Apri
                        </button>
                        <div className="secondary-actions">
                          <button 
                            className="icon-btn edit-btn"
                            onClick={() => handleStartEdit(generator)}
                            title="Rinomina"
                          >
                            ✏️
                          </button>
                          <button 
                            className="icon-btn delete-btn"
                            onClick={() => handleDeleteGenerator(generator.id, generator.name)}
                            title="Elimina"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>


      </main>

     
    </div>
  );
}

export default MainMenu;