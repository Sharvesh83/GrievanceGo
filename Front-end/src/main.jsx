import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Auth0Provider from './auth_provider_history'
import { Provider } from 'react-redux'
import './fonts.css'
import Store from './components/Redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Auth0Provider>
            <Provider store={Store}>
                <App />
            </Provider>
        </Auth0Provider>
    </BrowserRouter>
)
