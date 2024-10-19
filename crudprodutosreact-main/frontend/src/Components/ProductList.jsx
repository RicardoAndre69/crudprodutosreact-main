import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Styles/ProductList.css";
import ProductChart from "./ProductChart";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch categories
    fetch("http://localhost:3000/categorias")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        if (data.length === 0) {
          console.log("Nenhuma categoria encontrada");
        }
        setCategories(data);
      })
      .catch(err => {
        console.error("Erro ao buscar categorias:", err.message);
        setError("Falha ao carregar categorias. Por favor, tente novamente.");
      });

    // Fetch products
    fetch("http://localhost:3000/produtos")
      .then(response => {
        if (!response.ok) {
          throw new Error('Falha ao carregar produtos');
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

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const filteredProducts = selectedCategory === 'all'
    ? products
    : products.filter(product => product.CategoryID === parseInt(selectedCategory));

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="product-list">
      <h2>Lista de Produtos</h2>
      <Link to="/add" className="add-button">Adicionar Produto</Link>
      
      <div className="filter-section">
        <label htmlFor="category-select">Filtrar por categoria:</label>
        <select id="category-select" value={selectedCategory} onChange={handleCategoryChange}>
          <option value="all">Todas as Categorias</option>
          {categories.map(category => (
            <option key={category.CategoryID} value={category.CategoryID}>
              {category.CategoryName}
            </option>
          ))}
        </select>
      </div>

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
          {filteredProducts.map(product => (
            <tr key={product.ProductID}>
              <td>{product.ProductName}</td>
              <td>{product.Description}</td>
              <td>{product.Unit}</td>
              <td>{product.Price}</td>
              <td>
                <div className="actions">
                  <Link to={`/modify/${product.ProductID}`} className="modify-button">Editar</Link>
                  <button onClick={() => handleDelete(product.ProductID)} className="delete-button">Excluir</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ProductChart products={products} categories={categories} />
    </div>
  );
}

export default ProductList;