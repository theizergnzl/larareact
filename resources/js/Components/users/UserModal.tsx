import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/Components/ui/dialog';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/Components/ui/select';
import { useForm } from '@inertiajs/react';
import { useToast } from '@/hooks/use-toast';
import { UserPlus, Edit, Save, X } from 'lucide-react';
import { toast } from "sonner";
interface User {
  id?: number;
  name: string;
  username: string;
  email: string;
  status: 'active' | 'inactive' | 'suspended';
  roles?: { id: number; name: string }[];
  avatar?: string;
}

interface Role {
  id: number;
  name: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user?: User | null;
  roles?: Role[];
}

export function UserModal({ isOpen, onClose, user, roles = [] }: UserModalProps) {
  const { toast } = useToast();
  const { data, setData, post, patch, processing, errors, reset } = useForm({
    name: '',
    username: '',
    email: '',
    password: '',
    password_confirmation: '',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    role: '',
  });

  useEffect(() => {
    if (user) {
      setData({
        name: user.name || '',
        username: user.username || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
        status: user.status || 'active',
        role: user.roles?.[0]?.name || '',
      });
    } else {
      reset();
      setData({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        status: 'active',
        role: '',
      });
    }
  }, [user, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const url = user ? route('users.update', user.id) : route('users.store');
    const method = user ? patch : post;

    method(url, {
      onSuccess: () => {
        onClose();
        toast({
          title: user ? 'Usuario actualizado' : 'Usuario creado',
          description: user ? 'El usuario ha sido actualizado exitosamente.' : 'El usuario ha sido creado exitosamente.',
          variant: 'success',
        });
      },
      onError: (errors) => {
        toast({
          title: 'Error',
          description: 'Por favor corrige los errores en el formulario.',
          variant: 'destructive',
        });
      },
      preserveScroll: true,
    });
  };

  const title = user ? 'Editar Usuario' : 'Crear Nuevo Usuario';
  const icon = user ? <Edit className="h-5 w-5" /> : <UserPlus className="h-5 w-5" />;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {icon}
            {title}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Personal */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                value={data.name}
                onChange={(e) => setData('name', e.target.value)}
                className={errors.name ? 'border-red-500' : ''}
                placeholder="Ingrese el nombre completo"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <Label htmlFor="username">Nombre de Usuario *</Label>
              <Input
                id="username"
                value={data.username}
                onChange={(e) => setData('username', e.target.value)}
                className={errors.username ? 'border-red-500' : ''}
                placeholder="Ingrese el nombre de usuario"
                required
              />
              {errors.username && (
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Correo Electrónico *</Label>
              <Input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData('email', e.target.value)}
                className={errors.email ? 'border-red-500' : ''}
                placeholder="Ingrese el correo electrónico"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Contraseña (solo para nuevos usuarios o cambio de contraseña) */}
          {!user && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">Contraseña *</Label>
                <Input
                  id="password"
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                  placeholder="Ingrese la contraseña"
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password_confirmation">Confirmar Contraseña *</Label>
                <Input
                  id="password_confirmation"
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  placeholder="Confirme la contraseña"
                  required
                />
                {errors.password_confirmation && (
                  <p className="text-red-500 text-sm mt-1">{errors.password_confirmation}</p>
                )}
              </div>
            </div>
          )}

          {/* Estado y Rol */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="status">Estado *</Label>
              <Select value={data.status} onValueChange={(value) => setData('status', value as 'active' | 'inactive' | 'suspended')}>
                <SelectTrigger className={errors.status ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccione un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                  <SelectItem value="suspended">Suspendido</SelectItem>
                </SelectContent>
              </Select>
              {errors.status && (
                <p className="text-red-500 text-sm mt-1">{errors.status}</p>
              )}
            </div>

            <div>
              <Label htmlFor="role">Rol *</Label>
              <Select value={data.role} onValueChange={(value) => setData('role', value)}>
                <SelectTrigger className={errors.role ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccione un rol" />
                </SelectTrigger>
                <SelectContent>
                  {roles.map((role) => (
                    <SelectItem key={role.id} value={role.name}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={processing}
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={processing}
            >
              <Save className="h-4 w-4 mr-2" />
              {processing ? 'Guardando...' : 'Guardar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
