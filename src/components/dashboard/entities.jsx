import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './sidebar';
import useStore from '../../store/useStore';
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

export default function Entities() {
  const setSelectedEntity = useStore((s) => s.setSelectedEntity);
  const selectedEntity = useStore((s) => s.selectedEntity);
  const params = useParams();

  const { tablesData, isLoading, error, removeEntityRow, updateEntityRow } = useEntitiesData();
  const {
    formFields,
    isCreateModalOpen,
    newEntityValues,
    alertState,
    openCreateModal,
    closeCreateModal,
    closeAlert,
    handleNewEntityChange,
    submitEntityCreation,
  } = useEntityCreation(selectedEntity);
  const [deleteConfirmState, setDeleteConfirmState] = useState(INITIAL_DELETE_STATE);
  const [editModalState, setEditModalState] = useState(INITIAL_EDIT_STATE);

  useEffect(() => {
    if (params?.entity) setSelectedEntity(params.entity);
  }, [params?.entity, setSelectedEntity]);

  const handleCreateSubmit = async (event) => {
    event.preventDefault();
    await submitEntityCreation();
  };

  const openEditModal = (row) => {
    const definition = getEntityDefinition(selectedEntity);
    const initialValues = definition?.toFormValues ? definition.toFormValues(row) : { ...row };

    setEditModalState({
      isOpen: true,
      row,
      values: initialValues,
    });
  };

  const openDeleteModal = (row) => {
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

  const handleConfirmDelete = () => {
    if (deleteConfirmState.row?.id !== undefined) {
      removeEntityRow(selectedEntity, deleteConfirmState.row.id);
    }
    setDeleteConfirmState(INITIAL_DELETE_STATE);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmState(INITIAL_DELETE_STATE);
  };

  const handleEditChange = (event) => {
    const { name, type, files, value } = event.target;
    const newValue = type === 'file' || type === 'image' ? files[0] : value;
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
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();

    const definition = getEntityDefinition(selectedEntity);
    const currentRow = editModalState.row || {};
    const updatedRow = definition?.fromFormValues
      ? definition.fromFormValues(editModalState.values, currentRow)
      : { ...currentRow, ...editModalState.values };

    if (currentRow?.id !== undefined) {
      // send to backend if definition provides update
      if (definition?.update) {
        try {
          const result = await definition.update(currentRow.id, editModalState.values);
          // if service returns updated entity data, map it before updating state
          const mapped = definition?.map ? definition.map([result])[0] : null;
          if (mapped) {
            updateEntityRow(selectedEntity, currentRow.id, mapped);
          } else {
            updateEntityRow(selectedEntity, currentRow.id, updatedRow);
          }
        } catch (err) {
          console.error('Error updating entity', err);
          updateEntityRow(selectedEntity, currentRow.id, updatedRow);
        }
      } else {
        updateEntityRow(selectedEntity, currentRow.id, updatedRow);
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
                {/* boton de creación se renderiza dentro de la tabla */}
              </div>

              {isLoading ? <div className="p-6">Cargando entidades...</div> : renderTable()}
              {error && <div className="mt-4 text-sm text-red-600">{error}</div>}

              <EntityFormModal
                isOpen={isCreateModalOpen}
                title={`Crear ${singularLabel}`}
                fields={formFields}
                values={newEntityValues}
                onChange={handleNewEntityChange}
                onClose={closeCreateModal}
                onSubmit={handleCreateSubmit}
                submitLabel="CREAR NUEVO"
              />

              <EntityFormModal
                isOpen={editModalState.isOpen}
                title={`Editar ${singularLabel}`}
                fields={formFields}
                values={editModalState.values}
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
