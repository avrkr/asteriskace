import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: '#18181b',
                        color: '#fafafa',
                        border: '1px solid #3f3f46',
                    },
                }}
            />
            <App />
        </BrowserRouter>
    </React.StrictMode>,
)
