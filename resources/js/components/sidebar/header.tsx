import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Note } from "@/types/model";
import { usePage } from "@inertiajs/react";
import { CloudCheck, CloudOff, Loader2, Share } from "lucide-react";
import { useNote } from "../context/NoteEdit";

export function SiteHeader() {
  const { url } = usePage(),
    { note } = usePage<{ note: Note }>().props,
    { processing } = useNote();

  return (
    <header className="flex h-10 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-10">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-10"
        />
        {url.startsWith("/notes/") && (
          <>
            <h1 className="text-base font-medium">{note.title}</h1>
            <div className="ml-auto flex items-center gap-2">
              {processing ? (
                <div className="flex items-center text-blue-500">
                  <Loader2 className="h-4 w-4 animate-spin mr-1" /> Đang lưu...
                </div>
              ) : navigator.onLine ? (
                <div className="flex items-center text-green-600">
                  <CloudCheck className="h-4 w-4 mr-1" /> Đã lưu lên mây
                </div>
              ) : (
                <div className="flex items-center text-amber-600">
                  <CloudOff className="h-4 w-4 mr-1" /> Đang lưu ngoại tuyến
                </div>
              )}
              <Button size="sm" className="hidden sm:flex">
                <Share />
              </Button>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
