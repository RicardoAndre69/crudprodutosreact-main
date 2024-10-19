import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../Styles/ProductForm.css";

function ProductForm() {
  const [product, setProduct] = useState({
    ProductName: "",
    Description: "",
    Unit: "",
    Price: "",
  });
  const navigate = useNavigate();
  const { id } = useParams(); // Para casos de edição

  useEffect(() => {
    if (id) {
      // Se houver um ID, estamos em modo de edição
      fetch(`http://localhost:3000/produtos/${id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Produto não encontrado');
          }
          return response.json();
        })
        .then(data => setProduct(data))
        .catch(error => console.error('Erro ao buscar produto:', error));
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prevProduct => ({
      ...prevProduct,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = id 
      ? `http://localhost:3000/produtos/${id}`
      : "http://localhost:3000/produtos";
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product)
    })
    .then(response => {
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(text);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log("Produto salvo com sucesso:", data);
      navigate("/"); // Redireciona para a lista de produtos
    })
    .catch(error => {
      console.error("Erro ao salvar produto:", error);
      // Aqui você pode adicionar um estado para mostrar uma mensagem de erro no formulário
    });
  };

  return (
    <div className="form_div">
      <form onSubmit={handleSubmit} className="form">
        <input
          className="form_input"
          type="text"
          value={product.ProductName}
          name="ProductName"
          onChange={handleChange}
          placeholder="Nome do Produto"
          required
          autoComplete="off"
        />
        <input
          className="form_input"
          type="text"
          value={product.Description}
          name="Description"
          onChange={handleChange}
          placeholder="Descrição"
          required
          autoComplete="off"
        />
        <input
          className="form_input"
          type="text"
          value={product.Unit}
          name="Unit"
          onChange={handleChange}
          placeholder="Unidade"
          required
          autoComplete="off"
        />
        <input
          className="form_input"
          type="number"
          value={product.Price}
          name="Price"
          onChange={handleChange}
          placeholder="Preço"
          required
          autoComplete="off"
        />
        <button className="form_button" type="submit">
          {id ? "Atualizar" : "Salvar"}
        </button>
      </form>
    </div>
  );
}

export default ProductForm;