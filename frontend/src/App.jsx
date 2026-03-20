import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Login from './pages/login/index'
import Home from './pages/produtos/home'
import Register from './pages/registrar'
import EditarProduto from './pages/produtos/editar'
import NovoProduto from './pages/produtos/novo'
import Transacao from './pages/produtos/transacao'
import NovaTransacao from './pages/produtos/novaTransacao'
import './App.css'

const App = () => {
  return(

    <Router>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home />} />
        <Route path='/produtos/editar/:id' element={<EditarProduto />} />
        <Route path='/produtos/novo' element={<NovoProduto />} />
        <Route path='/produtos/transacao' element={<Transacao />} />
        <Route path='/produtos/nova-transacao' element={<NovaTransacao />} />
      </Routes>
    </Router>

  )

}

export default App
