import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { router, usePage } from "@inertiajs/react";
import {
  CloudCheck,
  CloudOff,
  Loader2,
  PinIcon,
  Share,
  Trash,
  Sparkles,
} from "lucide-react";
import { useNote } from "../context/NoteEdit";
import { Input } from "../ui/input";
import { route } from "ziggy-js";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Tag, Check } from "lucide-react";
import { IPage } from "@/lib/types";
import { Label } from "@/types/model";

export function SiteHeader() {
  const { labels } = usePage<IPage>().props;
  const { url } = usePage(),
    { data, processing, handleChange, setData } = useNote();

  let noteLabelIds = data.labels?.map((l: any) => String(l.id || l)) || [];

  const toggleLabelToNote = (labelId: number) => {
    const idStr = String(labelId);
    let newLabels;

    if (noteLabelIds.includes(idStr)) {
      newLabels = noteLabelIds.filter((id: string) => id !== idStr);
    } else {
      newLabels = [...noteLabelIds, idStr];
    }

    setData({
      ...data,
      labels: newLabels,
    });
  };

  return (
    <header className="sticky top-0 z-30 flex min-h-10 shrink-0 items-center gap-2 overflow-hidden border-b border-white/20 bg-[linear-gradient(120deg,rgba(99,102,241,0.16),rgba(168,85,247,0.14),rgba(236,72,153,0.12))] backdrop-blur-3xl transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:min-h-10">
      {/* Background Glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-10 top-0 h-32 w-32 rounded-full bg-indigo-400/20 blur-3xl" />
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-pink-400/20 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-purple-400/20 blur-3xl" />
      </div>

      {/* Noise Overlay */}
      <div className="absolute inset-0 opacity-[0.03] [background-image:url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="relative flex w-full flex-wrap items-center gap-2 px-3 lg:px-6">
        <div className="flex items-center gap-2">
          <div className="group rounded-2xl border border-white/40 bg-white/50 p-2 shadow-[0_8px_30px_rgb(99,102,241,0.15)] backdrop-blur-2xl transition-all duration-300 hover:scale-105 hover:rotate-2 hover:bg-white/70">
            <SidebarTrigger className="-ml-1 text-indigo-600 transition-colors duration-200 group-hover:text-purple-600" />
          </div>

          <Separator
            orientation="vertical"
            className="mx-2 opacity-50 data-[orientation=vertical]:h-10"
          />

          <div className="hidden md:flex items-center gap-2 rounded-full border border-white/40 bg-white/40 px-4 py-1.5 text-xs font-semibold text-indigo-700 shadow-lg backdrop-blur-2xl">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-pink-400 opacity-60" />

              <Sparkles className="relative h-3.5 w-3.5 text-pink-500" />
            </div>

            <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Editing Mode
            </span>
          </div>
        </div>

        {url.startsWith("/notes/") && (
          <>
            <div className="flex-1">
              <Input
                value={data.title}
                id="title"
                onChange={handleChange}
                placeholder="Tiêu đề..."
                className="min-w-[120px] flex-1 border-none bg-transparent px-0 text-base font-bold tracking-tight text-slate-800 shadow-none placeholder:text-slate-300 focus-visible:ring-0"
              />

              <div className="mt-1 hidden sm:flex items-center gap-2 text-xs text-slate-500">
                <div className="relative flex h-2 w-2">
                  <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <div className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_12px_rgba(34,197,94,0.8)]" />
                </div>

                <span className="font-medium tracking-wide">
                  Auto saving enabled
                </span>
              </div>
            </div>

            <div className="ml-auto flex flex-wrap items-center gap-2">
              {processing ? (
                <div className="flex items-center rounded-full border border-blue-200/40 bg-blue-50/60 px-3 py-1 text-sm text-blue-600 shadow-lg backdrop-blur-xl">
                  <Loader2 className="mr-1 h-4 w-4 animate-spin" />

                  <span className="hidden sm:inline">Đang lưu...</span>
                </div>
              ) : navigator.onLine ? (
                <div className="flex items-center rounded-full border border-emerald-200/40 bg-emerald-50/60 px-3 py-1 text-sm text-emerald-600 shadow-lg backdrop-blur-xl">
                  <CloudCheck className="mr-1 h-4 w-4" />

                  <span className="hidden sm:inline">Đã lưu lên mây</span>
                </div>
              ) : (
                <div className="flex items-center rounded-full border border-amber-200/40 bg-amber-50/60 px-3 py-1 text-sm text-amber-600 shadow-lg backdrop-blur-xl">
                  <CloudOff className="mr-1 h-4 w-4" />

                  <span className="hidden sm:inline">Đang lưu ngoại tuyến</span>
                </div>
              )}

              {/* Share */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="group border-white/40 bg-white/40 shadow-[0_8px_24px_rgba(99,102,241,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-pink-50 hover:text-indigo-600 hover:shadow-[0_12px_30px_rgba(99,102,241,0.18)]"
                  >
                    <Share className="h-4 w-4 transition-transform duration-300 group-hover:rotate-12 sm:mr-2" />

                    <span className="hidden sm:inline">Chia sẻ</span>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl border border-white/40 bg-white/60 p-1 shadow-2xl backdrop-blur-3xl"
                >
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="outline"
                      className="justify-start border-none bg-transparent transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
                    >
                      Chuyển tiếp email
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start border-none bg-transparent transition-all duration-200 hover:bg-purple-50 hover:text-purple-600"
                    >
                      Tạo bản sao ghi chú
                    </Button>

                    <Button
                      variant="outline"
                      className="justify-start border-none bg-transparent transition-all duration-200 hover:bg-pink-50 hover:text-pink-600"
                    >
                      Xuất file PDF
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/40 bg-white/40 shadow-[0_8px_24px_rgba(99,102,241,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-0.5 hover:border-indigo-200 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 hover:text-indigo-600 hover:shadow-[0_12px_30px_rgba(99,102,241,0.18)]"
                  >
                    Menu
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  align="end"
                  className="w-56 rounded-2xl border border-white/40 bg-white/60 p-1 shadow-2xl backdrop-blur-3xl"
                >
                  <div className="flex flex-col gap-1">
                    {/* Nhãn */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="justify-start gap-2 border-none bg-transparent transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <Tag className="h-4 w-4" />
                          Nhãn
                        </Button>
                      </PopoverTrigger>

                      <PopoverContent
                        className="w-60 rounded-2xl border border-white/40 bg-white/70 p-0 shadow-2xl backdrop-blur-3xl"
                        align="end"
                      >
                        <Command>
                          <CommandInput placeholder="Tìm nhãn..." />

                          <CommandList>
                            <CommandEmpty>Không tìm thấy nhãn nào</CommandEmpty>

                            <CommandGroup>
                              {labels?.map((label: Label) => (
                                <CommandItem
                                  key={label.id}
                                  onSelect={() => toggleLabelToNote(label.id)}
                                  className="flex items-center justify-between"
                                >
                                  <span>{label.name}</span>

                                  {noteLabelIds.includes(String(label.id)) && (
                                    <Check className="h-4 w-4 text-primary" />
                                  )}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    {/* Ghim */}
                    <Button
                      variant="outline"
                      className="justify-start gap-2 border-none bg-transparent transition-all duration-200 hover:bg-indigo-50 hover:text-indigo-600"
                      onClick={() =>
                        router.patch(route("notes.togglePin", data.id))
                      }
                    >
                      <PinIcon className="h-4 w-4" />
                      Ghim ghi chú
                    </Button>

                    {/* Xóa */}
                    <Button
                      variant="destructive"
                      className="justify-start gap-2 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-red-300/30"
                      onClick={() =>
                        router.delete(route("notes.destroy", data.id))
                      }
                    >
                      <Trash className="h-4 w-4" />
                      Xóa ghi chú
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </>
        )}
      </div>
    </header>
  );
}
