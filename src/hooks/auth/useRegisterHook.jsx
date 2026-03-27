import React, { useState } from 'react';
import CustomerService from '../../services/customer/CustomerService';
import { getErrorMessage } from '../../services/errors/error_handler';
import { normalizePhoneToE164 } from '../../utils/phone';

const useRegister = () => {
  const initialFormData = {
    customerName: '',
    customerLastName: '',
    customerEmail: '',
    customerPassword: '',
    customerPhoneNumber: '',  
    confirmPassword: '',
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

  const registerCustomer = async (e, payloadOverride = null) => {
    e?.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {

      const source = payloadOverride || formData;
      const dataToSend = { ...source };
      delete dataToSend.confirmPassword;
      if (dataToSend.customerPhoneNumber) {
        const normalizedPhone = normalizePhoneToE164(dataToSend.customerPhoneNumber, {
          defaultCountryCode: '+57',
        });
        if (!normalizedPhone) {
          setErrorMessage('El telefono debe estar en formato internacional E.164, ejemplo +573001234567.');
          return { success: false, error: new Error('Invalid phone format') };
        }
        dataToSend.customerPhoneNumber = normalizedPhone;
      }

      const response = await CustomerService.register(dataToSend);
      
      setSuccessMessage('Cliente registrado exitosamente.');
      setFormData(initialFormData);
      
      return { success: true, data: response };
      
    } catch (error) {
      const backendMessage =
        typeof error?.response?.data === 'string'
          ? error.response.data
          : error?.response?.data?.message;
      const displayMessage = backendMessage || getErrorMessage(error?.response?.status) || error.message;
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
