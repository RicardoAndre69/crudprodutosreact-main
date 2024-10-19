import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/ProductList.css";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/produtos")
      .then(response => {
        if (!response.ok) {
          return response.json().then(err => {
            throw new Error(JSON.stringify(err));
          });
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(err => {
        console.error("Erro ao buscar produtos:", err);
        setError("Falha ao carregar produtos. Por favor, tente novamente.");
      });
  }, []);

  const handleDelete = (id) => {
    fetch(`http://localhost:3000/produtos/${id}`, { method: 'DELETE' })
      .then(response => {
        if (!response.ok) {
          throw new Error('Falha ao deletar produto');
        }
        setProducts(products.filter(product => product.ProductID !== id));
      })
      .catch(err => console.error("Erro ao deletar produto:", err));
  };

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list">
      <h2>Lista de Produtos</h2>
      <Link to="/add" className="add-button">Adicionar Produto</Link>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Unidade</th>
            <th>Preço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.ProductID}>
              <td>{product.ProductName}</td>
              <td>{product.Description}</td>
              <td>{product.Unit}</td>
              <td>{product.Price}</td>
              <td>
                <Link to={`/modify/${product.ProductID}`}>Editar</Link>
                <button onClick={() => handleDelete(product.ProductID)}>Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProductList;