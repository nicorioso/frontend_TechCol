import { useMemo, useState } from 'react';
import CustomerService from '../../services/customer/CustomerService';
import { getEntityDefinition } from '../../services/entities/definitions';

const INITIAL_ALERT_STATE = {
  visible: false,
  type: 'info',
  message: '',
};

const getFileValidationMessage = (field, file) => {
  if (!file || !field || (field.type !== 'file' && field.type !== 'image')) {
    return '';
  }

  const maxSizeMB = Number(field.maxSizeMB ?? 0);
  if (maxSizeMB <= 0) {
    return '';
  }

  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size <= maxBytes) {
    return '';
  }

  const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
  return `La imagen pesa ${fileSizeMB} MB y el maximo permitido es ${maxSizeMB} MB.`;
};

const buildInitialValues = (fields = []) =>
  fields.reduce((acc, field) => {
    acc[field.name] = field.defaultValue ?? '';
    if (field.type === 'phone') {
      acc[field.countryName || `${field.name}_country`] = field.defaultCountry || 'US';
      acc[field.codeName || `${field.name}_country_code`] = field.defaultCode || '+1';
    }
    return acc;
  }, {});

export default function useEntityCreation(selectedEntity) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEntityValues, setNewEntityValues] = useState({});
  const [fieldErrors, setFieldErrors] = useState({});
  const [alertState, setAlertState] = useState(INITIAL_ALERT_STATE);

  const definition = useMemo(() => getEntityDefinition(selectedEntity), [selectedEntity]);
  const formFields = definition?.formFields || [];

  const openCreateModal = () => {
    setNewEntityValues(buildInitialValues(formFields));
    setFieldErrors({});
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
    setFieldErrors({});
  };

  const closeAlert = () => {
    setAlertState((prev) => ({ ...prev, visible: false }));
  };

  const handleNewEntityChange = (event) => {
    const { name, type, files, value } = event.target;
    const field = formFields.find((item) => item.name === name);
    const fileValue = type === 'file' || type === 'image' ? files?.[0] : null;
    const validationMessage = getFileValidationMessage(field, fileValue);

    if (validationMessage) {
      event.target.value = '';
      setFieldErrors((prev) => ({
        ...prev,
        [name]: validationMessage,
      }));
      return;
    }

    setFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    const newValue = fileValue || value;
    setNewEntityValues((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const submitEntityCreation = async () => {
    if (!definition?.create) {
      setAlertState({
        visible: true,
        type: 'info',
        message: `La creación de ${selectedEntity} aún no está conectada al backend.`,
      });
      setIsCreateModalOpen(false);
      return;
    }

    try {
      const createdEntity = await definition.create(newEntityValues, { customerService: CustomerService });
      setAlertState({
        visible: true,
        type: 'success',
        message: `${definition?.singularLabel || 'Entidad'} creada correctamente.`,
      });
      setIsCreateModalOpen(false);
      return createdEntity;
    } catch (err) {
      const status = err?.response?.status;
      const serverData = err?.response?.data;
      const serverMessage = typeof serverData === 'string' ? serverData : JSON.stringify(serverData || {});
      const normalizedError = `${serverMessage} ${err?.message || ''}`.toLowerCase();

      const isDuplicatedEmail =
        status === 409 ||
        normalizedError.includes('duplicate') ||
        normalizedError.includes('already exists') ||
        normalizedError.includes('email');

      setAlertState({
        visible: true,
        type: 'error',
        message: isDuplicatedEmail ? 'Este correo ya está registrado' : 'No se pudo crear el usuario.',
      });
      return null;
    }
  };

  return {
    formFields,
    isCreateModalOpen,
    newEntityValues,
    fieldErrors,
    alertState,
    openCreateModal,
    closeCreateModal,
    closeAlert,
    handleNewEntityChange,
    submitEntityCreation,
  };
}
