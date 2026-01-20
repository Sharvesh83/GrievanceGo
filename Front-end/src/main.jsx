import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import Auth0ProviderWithHistory from './auth_provider_history'
import { Provider } from 'react-redux'
import './fonts.css'
import Store from './components/Redux/store'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <Auth0ProviderWithHistory>
            <Provider store={Store}>
                <App />
            </Provider>
        </Auth0ProviderWithHistory>
    </BrowserRouter>
)
