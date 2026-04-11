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
import { SubmitEvent } from "react";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export default function CreateNote({ className = "" }) {
  const { data, setData, post, processing, reset, errors } = useForm({
    title: "",
  });

  const handleSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    post("notes.store", {
      onSuccess: () => reset(),
    });
  };

  return (
    <AlertDialog>
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
