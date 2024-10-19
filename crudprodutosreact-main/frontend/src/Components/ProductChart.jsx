import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function ProductChart({ products, categories }) {
  // Preparar dados para o gráfico
  const categoryData = products.reduce((acc, product) => {
    acc[product.CategoryID] = (acc[product.CategoryID] || 0) + 1;
    return acc;
  }, {});

  // Mapear IDs de categoria para nomes
  const categoryNames = categories.reduce((acc, category) => {
    acc[category.CategoryID] = category.CategoryName;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(categoryData).map(id => categoryNames[id] || id),
    datasets: [
      {
        label: 'Número de Produtos por Categoria',
        data: Object.values(categoryData),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Distribuição de Produtos por Categoria',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Número de Produtos'
        }
      },
      x: {
        title: {
          display: true,
          text: 'Categorias'
        }
      }
    }
  };

  return (
    <div className="product-chart">
      <Bar data={data} options={options} />
    </div>
  );
}

export default ProductChart;