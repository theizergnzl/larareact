import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { PageProps, UsersPageProps } from "@/types";
import { usePage } from "@inertiajs/react";
import { DataTable } from "@/Components/ui/data-table";
import { createColumns } from "@/Components/data-table/columns";
import { StatisticsCards } from "@/Components/users/StatisticsCards";
import { UserFilters } from "@/Components/users/UserFilters";
import { UserModal } from "@/Components/users/UserModal";
import { Button } from "@/Components/ui/button";
import { useState, useEffect } from "react";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ToastContainer } from "@/Components/ui/toast";

export default function Users({ auth }: PageProps) {
  const { users, filters, statistics, roles, flash } = usePage<UsersPageProps>().props;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const { toasts, removeToast, success, error } = useToast();

  const handlePageChange = (page: number) => {
    router.get(
      route("users.index"),
      { ...filters, page },
      { preserveState: true, preserveScroll: true }
    );
  };

  const handleCreateUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: any) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = (user: any) => {
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario ${user.name}?`)) {
      router.delete(route('users.destroy', user.id), {
        onSuccess: () => {
          success('Usuario eliminado exitosamente');
        },
        onError: () => {
          error('Error al eliminar el usuario');
        },
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  // Escuchar mensajes flash de éxito/error
  useEffect(() => {
    if (flash?.success) {
      success(flash.success as string);
    }
    if (flash?.error) {
      error(flash.error as string);
    }
  }, [flash, success, error]);

  return (
    <AuthenticatedLayout auth_user={auth.user} header="Users">
      <Head title="Users" />
      <div className="container mx-auto py-10 space-y-6">
        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />

        {/* Statistics Cards */}
        <StatisticsCards statistics={statistics} />

        {/* Header con botón de crear */}
        <div className="flex justify-between items-center">
          <UserFilters filters={filters} />
          <Button onClick={handleCreateUser} className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Crear Usuario
          </Button>
        </div>

        {/* Data Table */}
        <div className="rounded-md border">
          <DataTable
            columns={createColumns({
              onEdit: handleEditUser,
              onDelete: handleDeleteUser,
            })}
            data={users.data}
            pageCount={users.meta.last_page}
            currentPage={users.meta.current_page}
            totalItems={users.meta.total}
            perPage={users.meta.per_page}
            onPageChange={handlePageChange}
          />
        </div>

        {/* User Modal */}
        <UserModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          user={selectedUser}
          roles={roles}
        />
      </div>
    </AuthenticatedLayout>
  );
}
