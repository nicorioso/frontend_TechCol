import { useState } from "react";
import { Send } from "lucide-react";
import api from "../../../api/axios";

// components
import RegisterForm from "../../../components/auth/register/form";

function RegisterLayout() {

  return (
    <RegisterForm/>
  );
}

export default RegisterLayout;