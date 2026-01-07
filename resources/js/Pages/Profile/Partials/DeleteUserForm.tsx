import { useRef, useState, FormEventHandler } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from "@/Components/ui/dialog";
import { toast } from "sonner";

export default function DeleteUserForm({
  className = "",
  isAdmin = false,
  userId,
}: {
  className?: string;
  isAdmin?: boolean;
  userId?: number;
}) {
  const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
  const passwordInput = useRef<HTMLInputElement>(null);

  const {
    data,
    setData,
    delete: destroy,
    processing,
    reset,
    errors,
  } = useForm({
    password: "",
    id: isAdmin ? userId : null,
  });

  const confirmUserDeletion = () => {
    setConfirmingUserDeletion(true);
  };

  const deleteUser: FormEventHandler = (e) => {
    e.preventDefault();
    // if is admin, delete user from user.destroy route
    // else delete user from profile
    if (isAdmin) {
      // send id of user to delete
      destroy(route("users.destroy", userId), {
        preserveScroll: true,
        onSuccess: () => {},
        onError: () => {
          toast("User not deleted", {
            description:
              "The user has not been deleted. because of error, please try again.",
            position: "top-right",
          });
        },
        onFinish: () => reset(),
      });
    } else {
      destroy(route("profile.destroy"), {
        preserveScroll: true,
        onSuccess: () => {},
        onError: () => passwordInput.current?.focus(),
      });
    }
  };

  const closeModal = () => {
    setConfirmingUserDeletion(false);

    reset();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Delete Account</CardTitle>
        <CardDescription>
          Once your account is deleted, all of its resources and data will be
          permanently deleted. Before deleting your account, please download any
          data or information that you wish to retain.{" "}
        </CardDescription>
      </CardHeader>
      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="destructive" onClick={confirmUserDeletion}>
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete your account?
              </DialogTitle>
              <DialogDescription>
                Once your account is deleted, all of its resources and data will
                be permanently deleted. Please enter your password to confirm
                you would like to permanently delete your account.
              </DialogDescription>
            </DialogHeader>
            {/*  if is admin, no need for password confirmation */}
            {!isAdmin && (
              <form onSubmit={deleteUser}>
                <div>
                  <InputLabel
                    htmlFor="password"
                    value="Password"
                    className="sr-only"
                  />

                  <Input
                    id="password"
                    type="password"
                    name="password"
                    ref={passwordInput}
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    className="block mt-1 w-full"
                    placeholder="Password"
                  />

                  <InputError message={errors.password} className="mt-2" />
                </div>
              </form>
            )}
            <DialogFooter>
              <DialogClose>
                <Button variant="secondary">Cancel</Button>
              </DialogClose>
              <Button onClick={deleteUser} variant="destructive">
                Delete Account
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
}
