import { Route, Routes, Navigate } from 'react-router-dom';
import './App.css';

import Home from './pages/Home';
import { About } from './pages/About';
import Access from './pages/Access';
import Activate from './pages/Activate';
import { Private } from './pages/Private';
import { Admin } from './pages/Admin';
import PrivateRoutes from './components/PrivateRoutes';
import AdminRoutes from './components/AdminRoutes';
import { Contact } from './pages/Contact';
import Forgot from './pages/Forgot';
import Reset from './pages/Reset';
import Timer from './components/Timer';
import Blogs from './pages/Blogs';
import { Method } from './pages/Method';
import Services from './pages/Services';
import WorkSessionsTable from './pages/WorkSessionsTable';
import NewWorker from './components/NewWorker';
import Workers from './pages/Workers';
import TablePrivate from './components/TablePrivate';
import PrivateSession from './pages/PrivateSession';
import PrivateChild from './components/PrivateChild';
import Childs from './pages/Childs';
import ViewChildPrivate from './components/ViewChildPrivate';
import ViewChildPage from './pages/ViewChildPage';




function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate replace to="/home" />} />
        <Route path='/home'  element={<Home />} />
        <Route path='/about'  element={<About />} />
        <Route path='/access'  element={<Access />} />
        <Route path='/timer'  element={<Timer />} />
        <Route path='/contact'  element={<Contact />} />
        <Route path='/blogs'  element={<Blogs />} />
        <Route path='/method'  element={<Method />} />
        <Route path='/services'  element={<Services />} />
        <Route path='/worksession'  element={<WorkSessionsTable />} />
        <Route element={<PrivateRoutes />}>
          <Route path='/private' element={<Private />}/>
        </Route>
        <Route element={<AdminRoutes />}>
          <Route path='/admin' element={<Admin />} />
        </Route>
        <Route element={<NewWorker />}>
          <Route path='/workers' element={<Workers />} />
        </Route>
        <Route element={<TablePrivate />}>
          <Route path='/privatesession' element={<PrivateSession />} />
        </Route>
        <Route element={<PrivateChild />}>
          <Route path='/privatechild' element={<Childs/>} />
        </Route>
        <Route element={<ViewChildPrivate />}>
          <Route path='/viewchildpage' element={<ViewChildPage />} />
        </Route>

        <Route path='/auth/activate/:tokenId' element={<Activate />} />
        <Route path='/auth/password/forgot' element={<Forgot />}/>
        <Route path='/auth/password/reset/:tokend' element={<Reset />} />
      </Routes>
    </>
    
  );
}

export default App;
