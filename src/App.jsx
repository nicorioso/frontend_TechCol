import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Sidebar from "./layouts/users/sidebar.jsx";
import UserDashboard from './layouts/users/admin/user_dashboard.jsx';
import LoginRegisterForms from "./layouts/auth/login_register_form.jsx";

export default function App() {
  const [count, setCount] = useState('');

  return (
    <LoginRegisterForms/>
  )
}