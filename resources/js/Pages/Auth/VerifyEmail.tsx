import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function VerifyEmail({ status }: { status?: string }) {
  const { post, processing } = useForm({});

  const submit: FormEventHandler = (e) => {
    e.preventDefault();

    post(route("verification.send"));
  };

  return (
    <GuestLayout>
      <Head title="Verificación de Correo Electrónico" />

      <div className="mb-4 text-sm text-gray-600">
        ¡Gracias por registrarte! Antes de comenzar, por favor verifica tu
        dirección de correo electrónico haciendo clic en el enlace que te acabamos de enviar.
        Si no recibiste el correo, con gusto te enviaremos otro.
      </div>

      {status === "verification-link-sent" && (
        <div className="mb-4 text-sm font-medium text-green-600">
          Se ha enviado un nuevo enlace de verificación a la dirección de correo electrónico
          que proporcionaste durante el registro.
        </div>
      )}

      <form onSubmit={submit}>
        <div className="flex justify-between items-center mt-4">
          <Link
            href={route("logout")}
            method="post"
            as="button"
            className="text-sm text-gray-600 underline rounded-md hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cerrar Sesión
          </Link>
        </div>
      </form>
    </GuestLayout>
  );
}
