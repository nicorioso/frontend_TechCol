import { useState } from 'react';
import CustomerService from '../../services/customer/CustomerService';
import { getErrorMessage } from '../../services/errors/error_handler';

const useRegister = () => {
  const initialFormData = {
    customerName: '',
    customerLastName: '',
    customerEmail: '',
    customerPassword: '',
    customerPhoneNumber: '',
    roleId: 1
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const registerCustomer = async (e) => {
    e?.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const response = await CustomerService.register(formData);
      
      setSuccessMessage('¡Cliente registrado exitosamente!');
      setFormData(initialFormData);
      
      return { success: true, data: response };
      
    } catch (error) {
      const displayMessage = error.message || getErrorMessage(error.status);
      setErrorMessage(displayMessage);
      
      console.error('Error capturado en hook:', error);
      
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    loading,
    successMessage,
    errorMessage,
    handleInputChange,
    registerCustomer,
    setFormData
  };
};

export default useRegister;