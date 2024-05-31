import React from 'react'
import {BrowserRouter ,Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import About from './pages/About'
import Projects from './pages/Projects'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Header from './components/Header'
import FooterCode from './components/Footer'
import PrivateRoute from './components/PrivateRoute'
import AdminPrivateRoute from './components/AdminPrivateRoute'
import CreatePost from './components/CreatePost'
import UpdatePost from './pages/UpdatePost'
import GetUsers from './pages/GetUsers'
import PostPage from './pages/PostPage'

export default function App() {
  return (
    <BrowserRouter>
    <Header/>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route element={<PrivateRoute/>}>
          <Route path='/dashboard' element={<Dashboard/>}/>
        </Route>
        <Route element={<AdminPrivateRoute/>}>
          <Route path='/create-post' element={<CreatePost/>}/>
          <Route path='/update-post/:postId' element={<UpdatePost/>}/>
          <Route path='/users' element={<GetUsers/>}/>
        </Route>
        <Route path='/about' element={<About/>}/>
        <Route path='/projects' element={<Projects/>}/>
        <Route path='/sign-up' element={<Signup/>}/>
        <Route path='/sign-in' element={<Signin/>}/>
        <Route path='/posts/:postSlug' element={<PostPage/>}/>
      </Routes>
      <FooterCode/>
    </BrowserRouter>
  )
}
