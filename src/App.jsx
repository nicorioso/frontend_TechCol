import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from "./layouts/sidebar.jsx";
import UserDashboard from './pages/user_dashboard.jsx';
import LoginRegisterForms from "./layouts/login_register_form.jsx";

function App() {
  const [count, setCount] = useState('');

  return (
    <LoginRegisterForms/>
  )
}

export default App
