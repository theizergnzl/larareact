# Mejoras de Testabilidad y Seguridad del Sistema

Este documento describe las mejoras implementadas para mejorar la testabilidad y seguridad del sistema, incluyendo el sistema de bloqueo de usuarios tras intentos fallidos de inicio de sesión.

## Tabla de Contenidos

1. [Sistema de Bloqueo de Usuarios](#sistema-de-bloqueo-de-usuarios)
2. [Arquitectura Mejorada](#arquitectura-mejorada)
3. [Servicios Implementados](#servicios-implementados)
4. [Repositorios](#repositorios)
5. [Middleware de Seguridad](#middleware-de-seguridad)
6. [Factories Mejoradas](#factories-mejoradas)

## Sistema de Bloqueo de Usuarios

### Funcionalidades Implementadas

- **Bloqueo automático tras 3 intentos fallidos**: El sistema bloquea automáticamente la cuenta de un usuario tras 3 intentos fallidos de inicio de sesión.
- **Notificación al usuario**: Se informa al usuario sobre el bloqueo y el tiempo restante antes de que pueda intentar nuevamente.
- **Advertencia antes del bloqueo**: Se advierte al usuario tras 2 intentos fallidos que el próximo intento fallido bloqueará su cuenta.
- **Desbloqueo automático**: Las cuentas se desbloquean automáticamente después de 30 minutos.
- **Desbloqueo manual**: Los administradores pueden desbloquear cuentas manualmente.
- **Middleware de verificación**: Se verifica en cada solicitud si el usuario está bloqueado.

### Campos Nuevos en la Tabla Users

- `failed_login_attempts`: Contador de intentos fallidos de inicio de sesión.
- `locked_until`: Fecha y hora hasta la que la cuenta está bloqueada.

### Métodos Nuevos en el Modelo User

- `incrementFailedAttempts()`: Incrementa el contador de intentos fallidos.
- `resetFailedAttempts()`: Reinicia el contador tras un inicio de sesión exitoso.
- `lockAccount()`: Bloquea la cuenta del usuario.
- `unlockAccount()`: Desbloquea la cuenta del usuario.
- `isLocked()`: Verifica si la cuenta está bloqueada.
- `getLockTimeRemaining()`: Obtiene el tiempo restante de bloqueo en minutos.

## Arquitectura Mejorada

### Separación de Responsabilidades

- **Capa de Servicios**: Lógica de negocio separada de los controladores.
- **Capa de Repositorios**: Abstracción de acceso a datos.
- **Servicio de Archivos**: Manejo centralizado de archivos.

### Beneficios

- Mayor testabilidad del código.
- Facilita el mocking en pruebas unitarias.
- Mejor mantenimiento del código.
- Reutilización de lógica de negocio.

## Servicios Implementados

### UserService

Servicio centralizado para la lógica de negocio relacionada con usuarios:

- `getAllUsers()`: Obtener usuarios con filtros y paginación.
- `getUserStatistics()`: Obtener estadísticas de usuarios.
- `createUser()`: Crear un nuevo usuario.
- `updateUser()`: Actualizar un usuario existente.
- `deleteUser()`: Eliminar un usuario.
- `bulkDeleteUsers()`: Eliminar múltiples usuarios.
- `unlockUser()`: Desbloquear un usuario.
- `lockUser()`: Bloquear un usuario manualmente.
- `getAllRoles()`: Obtener todos los roles disponibles.

### FileService

Servicio centralizado para el manejo de archivos:

- `storeFile()`: Almacenar un archivo en el sistema.
- `deleteFile()`: Eliminar un archivo del sistema.
- `storeUserAvatar()`: Almacenar un avatar de usuario.
- `deleteUserAvatar()`: Eliminar el avatar de un usuario.
- `getFileUrl()`: Obtener la URL pública de un archivo.

## Repositorios

### UserRepositoryInterface

Interfaz que define los métodos para interactuar con los datos de usuarios:

- `all()`: Obtener todos los usuarios.
- `find()`: Obtener un usuario por su ID.
- `findByEmail()`: Obtener un usuario por su email.
- `findByUsername()`: Obtener un usuario por su username.
- `create()`: Crear un nuevo usuario.
- `update()`: Actualizar un usuario existente.
- `delete()`: Eliminar un usuario.
- `paginate()`: Obtener usuarios con paginación.
- `search()`: Buscar usuarios por criterios.
- `countByStatus()`: Contar usuarios por estado.
- `getLockedUsers()`: Obtener usuarios bloqueados.

### UserRepository

Implementación de la interfaz UserRepositoryInterface que maneja las consultas a la base de datos.

## Middleware de Seguridad

### CheckIfUserIsLocked

Middleware que verifica si un usuario está bloqueado antes de permitir el acceso a rutas protegidas:

- Verifica si el usuario está bloqueado.
- Cierra la sesión si el usuario está bloqueado.
- Redirige al login con un mensaje de error.

## Factories Mejoradas

### UserFactory

Factory mejorada con estados específicos para facilitar las pruebas:

- `active()`: Crear un usuario activo.
- `inactive()`: Crear un usuario inactivo.
- `suspended()`: Crear un usuario suspendido.
- `locked()`: Crear un usuario bloqueado.
- `withFailedAttempts()`: Crear un usuario con intentos fallidos.

## Migraciones Necesarias

### add_login_security_fields_to_users_table

Migración que añade los campos necesarios para el sistema de bloqueo:

- `failed_login_attempts`: Contador de intentos fallidos.
- `locked_until`: Fecha y hora hasta la que la cuenta está bloqueada.

## Rutas Nuevas

- `POST /users/{id}/unlock`: Desbloquear un usuario.

## Configuración

### Registro de Middleware

El middleware `CheckIfUserIsLocked` se ha registrado en el grupo de middleware web en `bootstrap/app.php`.

### Registro de Proveedores de Servicios

El `RepositoryServiceProvider` se ha registrado en `bootstrap/providers.php`.

## Instrucciones de Uso

### Ejecutar las Migraciones

```bash
php artisan migrate
```

### Crear un Usuario Bloqueado en Pruebas

```php
$user = User::factory()->locked()->create();
```

### Crear un Usuario con Intentos Fallidos

```php
$user = User::factory()->withFailedAttempts(2)->create();
```

### Desbloquear un Usuario

```php
$user->unlockAccount();
// O mediante el controlador
$this->userService->unlockUser($user);
```

## Beneficios de las Mejoras

1. **Mayor Seguridad**: Protección contra ataques de fuerza bruta mediante el bloqueo de cuentas.
2. **Mejor Testabilidad**: Arquitectura que facilita la creación de pruebas unitarias.
3. **Separación de Responsabilidades**: Código más organizado y mantenible.
4. **Reutilización de Código**: Servicios y repositorios que pueden ser reutilizados en diferentes partes de la aplicación.
5. **Manejo Centralizado de Archivos**: FileService que simplifica el manejo de archivos.
6. **Notificaciones Claras**: Mensajes informativos para los usuarios sobre el estado de su cuenta.

## Próximos Pasos

1. Implementar pruebas unitarias para los nuevos servicios.
2. Crear pruebas de integración para el sistema de bloqueo.
3. Implementar pruebas de rendimiento para las consultas optimizadas.
4. Añadir configuración de cobertura de código en phpunit.xml.
5. Implementar paralelización de pruebas si es necesario.
