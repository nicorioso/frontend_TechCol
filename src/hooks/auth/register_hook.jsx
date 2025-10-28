import { useState } from "react";
import { errorHandler } from "../../services/errors";
import CustomerService from "../../services/customer/CustomerService";

const useRegister = () => {

    const initialFormData = {
        customerName : '',
        customerLastName : '',
        customerEmail : '',
        customerPassword : '',
        confirmPassword : '',
        customerPhoneNumber : '',
        roleId : 1
    };

    const [formData, setFormData] = useState(initialFormData);
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');


    const handelInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const resetForm = () => {
        setFormData(initialFormData);
        setErrorMessage('');
        setSuccessMessage('');
    }

    const registerCustomer = async () => {
        setLoading(true);
        try {
            const response = await CustomerService.register(formData);
            setSuccessMessage(response.data.message);
            resetForm();
            return {success: true, data: response};
        } catch (error) {
            const handledError = errorHandler(error);
            setErrorMessage(handledError.message);
            return {success: false, error: handledError};
        } finally {
            setLoading(false);
        }
    };
    return {
        formData,
        loading,
        successMessage,
        errorMessage,

        handelInputChange,
        resetForm,
        registerCustomer,
        setFormData
    }

};

export default useRegister;