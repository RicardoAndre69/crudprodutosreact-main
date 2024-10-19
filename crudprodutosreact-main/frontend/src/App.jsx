import React from 'react'
import ProductForm from './Components/ProductForm'
import ProductList from './Components/ProductList'
import Footer from './Components/Footer'
import Header from './Components/Header'
import "./Styles/App.css"

function App() {
  return (
    <>
      <Header />
      <main>
        <ProductForm />
        
        <ProductList />
      </main>
      <Footer />
    </>
  );
}

export default App;