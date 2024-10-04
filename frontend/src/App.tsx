// import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { Provider } from 'react-redux';
import store from './store/store';
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom';

const Navbar = lazy(() => import('./components/common/Navbar'));
const Home = lazy(() => import('./pages/Home'));
const Generation = lazy(() => import('./pages/Generation'));
const Training = lazy(() => import('./pages/Training'));
const Model = lazy(() => import('./pages/Model'));
const Tokens = lazy(() => import('./pages/Tokens'));
const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const PrivateRoute = lazy(() => import('./components/routing/PrivateRoute'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));
const UserUpdate = lazy(() => import('./pages/UserUpdate'));
const EditProfile = lazy(() => import('./pages/EditProfile'));
const History = lazy(() => import('./pages/History'));
import LoadingIndicator from './pages/LoadingIndicator';

const router = createHashRouter([
  {
    path: '/',
    element: (
      <>
        <Navbar />
        <div className="pt-[60px]">
          <Outlet />
        </div>
      </>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          </Suspense>
        )
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <Login />
          </Suspense>
        )
      },
      {
        path: 'signup',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <Signup />
          </Suspense>
        )
      },
      {
        path: 'generation/*',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <PrivateRoute>
              <Generation />
            </PrivateRoute>
          </Suspense>
        )
      },
      {
        path: 'history',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <PrivateRoute>
              <History />
            </PrivateRoute>
          </Suspense>
        )
      },
      {
        path: 'training',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <PrivateRoute>
              <Training />
            </PrivateRoute>
          </Suspense>
        )
      },
      {
        path: 'model',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <PrivateRoute>
              <Model />
            </PrivateRoute>
          </Suspense>
        )
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <PrivateRoute>
              <Settings />
            </PrivateRoute>
          </Suspense>
        )
      },
      {
        path: '/tokens',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <PrivateRoute>
              <Tokens />
            </PrivateRoute>
          </Suspense>
        )
      },
      {
        path: '/profile',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          </Suspense>
        )
      },
      {
        path: '/profile/edit',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <PrivateRoute>
              <EditProfile />
            </PrivateRoute>
          </Suspense>
        )
      },
      {
        path: '/guestUserManage',
        element: (
          <Suspense fallback={<LoadingIndicator />}>
            <PrivateRoute>
              <UserUpdate />
            </PrivateRoute>
          </Suspense>
        )
      }
    ]
  }
]);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
