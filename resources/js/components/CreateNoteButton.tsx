import { useForm } from "@inertiajs/react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Loader2, X } from "lucide-react";
import { SubmitEvent, useState } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { route } from "ziggy-js";

export default function CreateNote({ className = "" }) {
  const [open, setOpen] = useState(false);
  const { data, setData, post, processing, reset, errors } = useForm({
    title: "",
  });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!navigator.onLine) {
      const offlineNote = {
        id: Date.now(),
        title: data.title,
        content: "",
        is_offline: true,
        created_at: new Error().stack,
      };

      const existing = JSON.parse(
        localStorage.getItem("offline_notes") || "[]",
      );
      localStorage.setItem(
        "offline_notes",
        JSON.stringify([...existing, offlineNote]),
      );

      reset();
      setOpen(false);

      window.dispatchEvent(new Event("storage"));
      return;
    }

    post(route("notes.store"), {
      onSuccess: () => {
        reset();
        setOpen(false);
      },
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className={className}>Thêm ghi chú</Button>
      </AlertDialogTrigger>
      <AlertDialogContent asChild>
        <Card>
          <CardHeader>
            <CardTitle>Ghi chú mới</CardTitle>
            <CardAction>
              <AlertDialogCancel>
                <X />
              </AlertDialogCancel>
            </CardAction>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="grid gap-1.5">
                <Input
                  placeholder="Nhập tên ghi chú..."
                  value={data.title}
                  onChange={(e) => setData("title", e.target.value)}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && (
                  <span className="text-xs text-destructive">
                    {errors.title}
                  </span>
                )}
              </div>

              <Button type="submit" disabled={processing} className="w-full">
                {processing ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Tạo mới
              </Button>
            </form>
          </CardContent>
        </Card>
      </AlertDialogContent>
    </AlertDialog>
  );
}
