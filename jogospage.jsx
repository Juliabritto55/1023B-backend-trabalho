import { useState, useEffect } from 'react';

function ListaJogos() {
  const [produtos, setJogos] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    fetch('/api/jogos')
      .then(res => res.json())
      .then(data => setJogos(data));
  }, []);

  const jogosFiltrados = jogos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por titulo ou categoria"
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />

      <ul>
        {jogosFiltrados.map(p => (
          <li key={p.id}>{p.titulo} — {p.categoria}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListaJogos;
