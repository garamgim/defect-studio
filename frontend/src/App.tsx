import { Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store/store';
import Navbar from './components/common/Navbar';
import Home from './pages/Home';
import Generation from './pages/Generation';
import Training from './pages/Training';
import Model from './pages/Model';
import Tokens from './pages/Tokens';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PrivateRoute from './components/routing/PrivateRoute';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import GuestUserUpdate from './pages/GuestUserUpdate';

function AppContent() {
  return (
    <>
      <Navbar />
      <div className="pt-[60px]">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* 로그인 안한경우 접근 불가 */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Home />
              </PrivateRoute>
            }
          />
          <Route
            path="/generation/*"
            element={
              <PrivateRoute>
                <Generation />
              </PrivateRoute>
            }
          />
          <Route
            path="/training"
            element={
              <PrivateRoute>
                <Training />
              </PrivateRoute>
            }
          />
          <Route
            path="/model"
            element={
              <PrivateRoute>
                <Model />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <Settings />
              </PrivateRoute>
            }
          />
          <Route
            path="/tokens"
            element={
              <PrivateRoute>
                <Tokens />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <Profile />
              </PrivateRoute>
            }
          />
          <Route
            path="/guestUserManage"
            element={
              <PrivateRoute>
                <GuestUserUpdate />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <AppContent />
    </Provider>
  );
}

export default App;
