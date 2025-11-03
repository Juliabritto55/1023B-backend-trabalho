function EditarJogo({ jogo }) {
  const [form, setForm] = useState(jogo);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`/api/jogos/${jogo.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    alert('Jogo atualizado!');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="titulo" value={form.titulo} onChange={handleChange} />
      <input name="preco" value={form.preco} onChange={handleChange} />
      <button type="submit">Salvar</button>
    </form>
  );
}