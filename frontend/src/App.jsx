import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider  } from 'react-router-dom'
import Home from './pages/Home'
import MainLayout from './pages/MainLayout'
import PrivateRoute from './components/PrivateRoute'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import EmailConfirmation from './pages/EmailConfirmation'
import RequestPasswordReset from './pages/RequestPasswordReset'
import PasswordReset from './pages/PasswordReset'
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css'

function App() {

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path='/' element={<MainLayout />}>
        <Route index={true} path='/' element={<Home />}/>
        <Route path='/sign-up' element={<SignUp />}/>
        <Route path='/sign-in' element={<SignIn />}/>
        <Route path='/verify-email/:token' element={<EmailConfirmation />}/>
        <Route path='/reset-password/:token' element={<PasswordReset />}/>
        <Route path='/forgot-password' element={<RequestPasswordReset />}/>
        <Route path='/profile' element={<Profile />}/>
        <Route element={<PrivateRoute />}>
            <Route path='/profile' element={<Profile />}/>
        </Route>
        {/* <Route path='/add-job' element={<AddJobPage addJobSubmit={addJob}/>}/>
        <Route path='/edit-job/:id' element={<EditJobPage editJobSubmit={updateJob}/>} loader={jobLoader}/>
        <Route path='/jobs' element={<JobsPage />}/>
        <Route path='/jobs/:id' element={<JobPage deleteJob={deleteJob}/>} loader={jobLoader}/>
        <Route path='*' element={<NotFoundPage />}/> */}
      </Route>
    )
  )

  return <RouterProvider router={router} />
}

export default App