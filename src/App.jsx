import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Home from './pages/Home'
import AddRoom from './pages/AddRoom'
import MyRooms from './pages/MyRooms'
import EditRoom from './pages/EditRoom'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-center" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/my-rooms" element={<MyRooms />} />
            <Route path="/add-room" element={<AddRoom />} />
            <Route path="/edit-room/:id" element={<EditRoom />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App
