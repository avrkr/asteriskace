import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Sidebar from './components/Sidebar';

// Pages
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/UserManagement';
import ContentManager from './pages/ContentManager';
import VideoList from './pages/VideoList';
import Profile from './pages/Profile';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import VideoPlayer from './pages/VideoPlayer';

const AppLayout = ({ children }) => (
    <div className="dashboard-container">
        <Sidebar />
        <main className="main-content">
            {children}
        </main>
    </div>
);

function App() {
    return (
        <AuthProvider>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />

                {/* User Routes */}
                <Route path="/" element={
                    <ProtectedRoute>
                        <AppLayout>
                            <UserDashboard />
                        </AppLayout>
                    </ProtectedRoute>
                } />

                <Route path="/watch/:id" element={
                    <ProtectedRoute>
                        <AppLayout>
                            <VideoPlayer />
                        </AppLayout>
                    </ProtectedRoute>
                } />

                <Route path="/profile" element={
                    <ProtectedRoute>
                        <AppLayout>
                            <Profile />
                        </AppLayout>
                    </ProtectedRoute>
                } />

                {/* Admin Routes */}
                <Route path="/admin" element={
                    <AdminRoute>
                        <AppLayout>
                            <AdminDashboard />
                        </AppLayout>
                    </AdminRoute>
                } />

                <Route path="/admin/users" element={
                    <AdminRoute>
                        <AppLayout>
                            <UserManagement />
                        </AppLayout>
                    </AdminRoute>
                } />

                <Route path="/admin/content" element={
                    <AdminRoute>
                        <AppLayout>
                            <ContentManager />
                        </AppLayout>
                    </AdminRoute>
                } />

                <Route path="/admin/videos" element={
                    <AdminRoute>
                        <AppLayout>
                            <VideoList />
                        </AppLayout>
                    </AdminRoute>
                } />

                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </AuthProvider>
    );
}

export default App;
