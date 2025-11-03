import { useState, useEffect } from 'react';

function ListaProdutos() {
  const [produtos, setProdutos] = useState([]);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    fetch('/api/produtos')
      .then(res => res.json())
      .then(data => setProdutos(data));
  }, []);

  const produtosFiltrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(busca.toLowerCase()) ||
    p.categoria.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar por nome ou categoria"
        value={busca}
        onChange={e => setBusca(e.target.value)}
      />

      <ul>
        {produtosFiltrados.map(p => (
          <li key={p.id}>{p.nome} — {p.categoria}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListaProdutos;
