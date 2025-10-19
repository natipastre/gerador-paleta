import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [colors, setColors] = useState(generatePalette());
  const [copied, setCopied] = useState(null);
  const [savedPalettes, setSavedPalettes] = useState([]);

  // Carregar paletas salvas do localStorage
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("savedPalettes")) || [];
    setSavedPalettes(saved);
  }, []);

  // Função para gerar paleta harmônica
  function generatePalette() {
    const base = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
    const palette = [base];
    for (let i = 1; i < 5; i++) {
      const color = Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
      palette.push(color);
    }
    return palette.map(c => "#" + c);
  }

  function handleGenerate() {
    setColors(generatePalette());
  }

  function handleCopy(color) {
    navigator.clipboard.writeText(color);
    setCopied(color);
    setTimeout(() => setCopied(null), 1000);
  }

  function handleCopyAll() {
    navigator.clipboard.writeText(colors.join(", "));
    setCopied("all");
    setTimeout(() => setCopied(null), 1000);
  }

  function handleSavePalette() {
    const updated = [colors, ...savedPalettes];
    setSavedPalettes(updated);
    localStorage.setItem("savedPalettes", JSON.stringify(updated));
  }

  return (
    <div
      className="container"
      style={{
        background: `linear-gradient(135deg, ${colors.join(", ")})`
      }}
    >
      <h1>🎨 Gerador de Paletas</h1>

      <div className="palette">
        {colors.map((color, index) => (
          <div
            key={index}
            className="color-box"
            style={{ backgroundColor: color }}
            onClick={() => handleCopy(color)}
          >
            <span className="color-code">{color}</span>
            {copied === color && <span className="copied">Copiado!</span>}
          </div>
        ))}
      </div>

      <div className="buttons">
        <button onClick={handleGenerate}>Gerar Nova Paleta</button>
        <button onClick={handleCopyAll}>Copiar Paleta Completa</button>
        <button onClick={handleSavePalette}>Salvar Paleta</button>
      </div>

      <p className="hint">Clique em uma cor para copiar o código 🎯</p>

      {savedPalettes.length > 0 && (
        <>
          <h2>💾 Paletas Salvas</h2>
          <div className="saved-palettes">
            {savedPalettes.map((p, i) => (
              <div key={i} className="palette-saved">
                {p.map((color, idx) => (
                  <div
                    key={idx}
                    className="color-box-small"
                    style={{ backgroundColor: color }}
                    onClick={() => handleCopy(color)}
                  >
                    {copied === color && <span className="copied-small">Copiado!</span>}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
