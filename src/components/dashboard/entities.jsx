import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './sidebar';
import { useStore } from '../../store/useStore';
import CustomersTable from '../IU/tables/CustomersTable';
import AdminsTable from '../IU/tables/AdminsTable';
import ProductsTable from '../IU/tables/ProductsTable';
import CartsTable from '../IU/tables/CartsTable';
import OrdersTable from '../IU/tables/OrdersTable';
import EntityFormModal from '../IU/modal/EntityFormModal';
import DeleteConfirmModal from '../IU/modal/DeleteConfirmModal';
import Alert from '../IU/alerts/Alerts';
import useEntitiesData from '../../hooks/entities/useEntitiesData';
import useEntityCreation from '../../hooks/entities/useEntityCreation';
import { getEntityDefinition } from '../../services/entities/definitions';

const TABLE_COMPONENTS = {
  customers: CustomersTable,
  admins: AdminsTable,
  products: ProductsTable,
  carts: CartsTable,
  orders: OrdersTable,
};

const INITIAL_DELETE_STATE = {
  isOpen: false,
  row: null,
};

const INITIAL_EDIT_STATE = {
  isOpen: false,
  row: null,
  values: {},
};

const INITIAL_ACTION_ALERT = {
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

export default function Entities() {
  const setSelectedEntity = useStore((s) => s.setSelectedEntity);
  const selectedEntity = useStore((s) => s.selectedEntity);
  const params = useParams();

  const { tablesData, isLoading, error, removeEntityRow, updateEntityRow, addEntityRow } = useEntitiesData();
  const {
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
  } = useEntityCreation(selectedEntity);
  const [deleteConfirmState, setDeleteConfirmState] = useState(INITIAL_DELETE_STATE);
  const [editModalState, setEditModalState] = useState(INITIAL_EDIT_STATE);
  const [editFieldErrors, setEditFieldErrors] = useState({});
  const [actionAlert, setActionAlert] = useState(INITIAL_ACTION_ALERT);

  useEffect(() => {
    if (params?.entity) setSelectedEntity(params.entity);
  }, [params?.entity, setSelectedEntity]);

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    const definition = getEntityDefinition(selectedEntity);
    const createdEntity = await submitEntityCreation();

    if (!createdEntity || !definition) {
      return;
    }

    const mappedCreatedEntity = definition?.map ? definition.map([createdEntity])[0] : null;

    if (mappedCreatedEntity) {
      addEntityRow(selectedEntity, mappedCreatedEntity);
      return;
    }

    const fallbackRow = definition?.fromFormValues
      ? definition.fromFormValues(newEntityValues, createdEntity)
      : createdEntity;

    addEntityRow(selectedEntity, fallbackRow);
  };

  const openEditModal = (row) => {
    const definition = getEntityDefinition(selectedEntity);
    if (!definition?.update) {
      setActionAlert({
        visible: true,
        type: 'info',
        message: `La edición de ${definition?.singularLabel || 'entidades'} aún no está conectada al backend.`,
      });
      return;
    }
    const initialValues = definition?.toFormValues ? definition.toFormValues(row) : { ...row };

    setEditModalState({
      isOpen: true,
      row,
      values: initialValues,
    });
    setEditFieldErrors({});
  };

  const openDeleteModal = (row) => {
    const definition = getEntityDefinition(selectedEntity);
    if (!definition?.delete) {
      setActionAlert({
        visible: true,
        type: 'info',
        message: `La eliminación de ${definition?.singularLabel || 'entidades'} aún no está conectada al backend.`,
      });
      return;
    }
    setDeleteConfirmState({
      isOpen: true,
      row,
    });
  };

  const renderTable = () => {
    const TableComponent = TABLE_COMPONENTS[selectedEntity];

    if (!TableComponent) {
      return <div className="p-6">Selecciona una entidad</div>;
    }

    return (
      <TableComponent
        data={tablesData[selectedEntity] || []}
        actionButtonLabel="CREAR NUEVO"
        onActionClick={openCreateModal}
        onEditClick={openEditModal}
        onDeleteClick={openDeleteModal}
      />
    );
  };

  const singularLabel = getEntityDefinition(selectedEntity)?.singularLabel || 'Entidad';
  const editFields = formFields.filter((field) => !field.hideOnEdit);

  const handleConfirmDelete = async () => {
    const definition = getEntityDefinition(selectedEntity);
    const rowId = deleteConfirmState.row?.id;

    if (rowId === undefined) {
      setDeleteConfirmState(INITIAL_DELETE_STATE);
      return;
    }

    if (!definition?.delete) {
      setActionAlert({
        visible: true,
        type: 'info',
        message: `La eliminación de ${definition?.singularLabel || 'entidades'} aún no está conectada al backend.`,
      });
      setDeleteConfirmState(INITIAL_DELETE_STATE);
      return;
    }

    try {
      await definition.delete(rowId);
      removeEntityRow(selectedEntity, rowId);
      setActionAlert({
        visible: true,
        type: 'success',
        message: `${definition?.singularLabel || 'Entidad'} eliminada correctamente.`,
      });
    } catch (err) {
      console.error('Error deleting entity', err);
      setActionAlert({
        visible: true,
        type: 'error',
        message: `No se pudo eliminar ${definition?.singularLabel || 'la entidad'}.`,
      });
    } finally {
      setDeleteConfirmState(INITIAL_DELETE_STATE);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmState(INITIAL_DELETE_STATE);
  };

  const handleEditChange = (event) => {
    const { name, type, files, value } = event.target;
    const field = editFields.find((item) => item.name === name);
    const fileValue = type === 'file' || type === 'image' ? files?.[0] : null;
    const validationMessage = getFileValidationMessage(field, fileValue);

    if (validationMessage) {
      event.target.value = '';
      setEditFieldErrors((prev) => ({
        ...prev,
        [name]: validationMessage,
      }));
      return;
    }

    setEditFieldErrors((prev) => ({
      ...prev,
      [name]: '',
    }));

    const newValue = fileValue || value;
    setEditModalState((prev) => ({
      ...prev,
      values: {
        ...prev.values,
        [name]: newValue,
      },
    }));
  };

  const handleCloseEditModal = () => {
    setEditModalState(INITIAL_EDIT_STATE);
    setEditFieldErrors({});
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    const definition = getEntityDefinition(selectedEntity);
    const currentRow = editModalState.row || {};
    const updatedRow = definition?.fromFormValues
      ? definition.fromFormValues(editModalState.values, currentRow)
      : { ...currentRow, ...editModalState.values };

    if (currentRow?.id !== undefined) {
      if (definition?.update) {
        try {
          const result = await definition.update(currentRow.id, editModalState.values);
          const mapped = definition?.map ? definition.map([result])[0] : null;
          if (mapped) {
            updateEntityRow(selectedEntity, currentRow.id, mapped);
          } else {
            updateEntityRow(selectedEntity, currentRow.id, updatedRow);
          }
          setActionAlert({
            visible: true,
            type: 'success',
            message: `${definition?.singularLabel || 'Entidad'} actualizada correctamente.`,
          });
        } catch (err) {
          console.error('Error updating entity', err);
          setActionAlert({
            visible: true,
            type: 'error',
            message: `No se pudo actualizar ${definition?.singularLabel || 'la entidad'}.`,
          });
        }
      } else {
        setActionAlert({
          visible: true,
          type: 'info',
          message: `La edición de ${definition?.singularLabel || 'entidades'} aún no está conectada al backend.`,
        });
      }
    }

    handleCloseEditModal();
  };

  return (
    <>
      <div className="flex">
        <Sidebar
          content={
            <div className="w-full">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h1 className="text-2xl font-semibold">Entidades</h1>
              </div>

              {isLoading ? <div className="p-6">Cargando entidades...</div> : renderTable()}
              {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

              <EntityFormModal
                isOpen={isCreateModalOpen}
                title={`Crear ${singularLabel}`}
                fields={formFields}
                values={newEntityValues}
                fieldErrors={fieldErrors}
                onChange={handleNewEntityChange}
                onClose={closeCreateModal}
                onSubmit={handleCreateSubmit}
                submitLabel="CREAR NUEVO"
              />

              <EntityFormModal
                isOpen={editModalState.isOpen}
                title={`Editar ${singularLabel}`}
                fields={editFields}
                values={editModalState.values}
                fieldErrors={editFieldErrors}
                onChange={handleEditChange}
                onClose={handleCloseEditModal}
                onSubmit={handleEditSubmit}
                submitLabel="GUARDAR CAMBIOS"
              />

              {alertState.visible && (
                <Alert
                  type={alertState.type}
                  message={alertState.message}
                  onClose={closeAlert}
                  duration={6000}
                />
              )}
              {actionAlert.visible && (
                <Alert
                  type={actionAlert.type}
                  message={actionAlert.message}
                  onClose={() => setActionAlert(INITIAL_ACTION_ALERT)}
                  duration={6000}
                />
              )}

              <DeleteConfirmModal
                isOpen={deleteConfirmState.isOpen}
                onConfirm={handleConfirmDelete}
                onCancel={handleCancelDelete}
              />
            </div>
          }
          onEntitySelect={setSelectedEntity}
          selectedEntity={selectedEntity}
        />
      </div>
    </>
  );
}
