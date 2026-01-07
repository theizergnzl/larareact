import { useForm, usePage } from "@inertiajs/react";
import { FormEvent } from "react";
import { PageProps } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import UpdateAvatarForm from "@/Pages/Profile/Partials/UpdateAvatarForm";
import UpdateProfileInformationForm from "@/Pages/Profile/Partials/UpdateProfileInformationForm";
import UpdatePasswordForm from "@/Pages/Profile/Partials/UpdatePasswordForm";
import DeleteUserForm from "@/Pages/Profile/Partials/DeleteUserForm";
import { Head } from "@inertiajs/react";

interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  email_verified_at: string;
  roles: string[];
  created_at: string;
}

interface EditProps extends PageProps {
  user_data?: User;
  user?: User;
}

export default function EditUser({ auth }: PageProps) {
  const { user_data, user } = usePage<EditProps>().props;

  // Usar user_data si está disponible, si no usar user
  const userData = user_data || user;

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { data, setData, patch, errors, processing } = useForm({
    name: userData.name,
    email: userData.email,
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    patch(route("users.update", userData.id), {
      preserveScroll: true,
      onSuccess: () => {
        // Update the page props with the new data
        const page = usePage<EditProps>();
        if (page.props.user_data) {
          page.props.user_data = {
            ...page.props.user_data,
            name: data.name,
            email: data.email,
          };
        } else if (page.props.user) {
          page.props.user = {
            ...page.props.user,
            name: data.name,
            email: data.email,
          };
        }
      },
    });
  };

  return (
    <AuthenticatedLayout
      auth_user={auth.user}
      header={`${userData.name} Settings`}
    >
      <Head title="Profile" />

      <div className=" w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <div className="grid gap-6">
          <UpdateAvatarForm user={userData} />
          <UpdateProfileInformationForm
            mustVerifyEmail={false}
            status={status}
            className="max-w-xl"
            user={userData}
            isAuthUser={auth.user.id === userData.id}
          />

          <UpdatePasswordForm className="max-w-xl" isAdmin={true} />

          <DeleteUserForm
            className="max-w-xl"
            userId={userData.id}
            isAdmin={true}
          />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
