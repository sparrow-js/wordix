"use client";

import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import UploadBackground from "@/components/upload-background";
import useStores from "@/hooks/useStores";
import { PAGINATION_SYMBOL } from "@/stores/base/const";
import { formatDistanceToNow } from "date-fns";
import { ArrowUpDown, Image, MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import { observer } from "mobx-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Projects = observer(() => {
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<any>(null);

  const { collections } = useStores();

  const { ref, inView } = useInView();

  const fetchProjects = async (page: number) => {
    setLoading(true);
    const res = await collections.fetchPage({
      limit: 25,
      page: page,
    });
    if (res[PAGINATION_SYMBOL].total >= collections.data.size) {
      setHasMore(false);
    } else {
      setPage(page + 1);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (inView && hasMore) {
      fetchProjects(page);
    }
  }, [inView]);

  const handleDelete = async (e, collection: any) => {
    e.preventDefault();
    e.stopPropagation();
    await collections.delete(collection);
  };

  return (
    <div className="flex h-full w-full md:w-auto flex-1 flex-col bg-muted/30">
      <div className="flex h-[60px] items-center justify-between border-b bg-background px-2 md:px-5 flex-shrink-0">
        <div className="flex items-center gap-4 md:gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <h1 className="sr-only">Projects</h1>
                <BreadcrumbPage className="text-base font-semibold">Projects</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon">
            <ArrowUpDown className="w-4 h-4" />
          </Button>
          <Button>
            <Plus className="w-4 h-4" />
            Create new project
          </Button>
        </div>
      </div>
      <div className="flex h-[calc(100svh-120px)] overflow-hidden">
        <div className="flex h-full w-full data-[panel-group-direction=vertical]:flex-col">
          <div style={{ flex: "1 1 0px", overflow: "hidden" }}>
            <div className="flex h-full">
              <div className="w-full p-0">
                <ScrollArea className="h-full w-full">
                  <div className="h-full w-full rounded-[inherit] [&>div]:!block" style={{ overflow: "hidden scroll" }}>
                    <div style={{ minWidth: "100%", display: "table" }}>
                      <div className="px-1 py-4 md:p-5">
                        <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                          {collections.orderedList.slice(0, 5).map((collection) => {
                            return (
                              <Link href={`/${collection.id}/docs`} key={collection.id}>
                                <div
                                  key={collection.id}
                                  className="flex flex-col border border-border rounded-lg overflow-hidden shadow-md hover:ring-1 hover:ring-[#fad400]"
                                >
                                  <div
                                    className="relative h-24 w-full bg-cover bg-center"
                                    style={{ backgroundImage: `url(${collection.bannerImage || "/placeholder.png"})` }}
                                  >
                                    <div className="absolute bottom-0 left-0 translate-y-1/2 translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-muted-foreground text-background">
                                      {collection.name.slice(0, 1).toUpperCase()}
                                    </div>
                                    <DropdownMenu
                                      open={openMenuId === collection.id}
                                      onOpenChange={(open) => setOpenMenuId(open ? collection.id : null)}
                                    >
                                      <DropdownMenuTrigger asChild>
                                        <Button
                                          variant="ghost"
                                          size="icon"
                                          className="absolute right-1.5 top-1.5 z-10 h-6 w-6 p-0"
                                        >
                                          <MoreHorizontal className="h-4 w-4" />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setEditingId(collection.id);
                                            setOpenMenuId(null);
                                          }}
                                        >
                                          <Pencil className="mr-2 h-4 w-4" />
                                          Rename
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setSelectedCollection(collection);
                                            setOpenUploadDialog(true);
                                            setOpenMenuId(null);
                                          }}
                                        >
                                          <Image className="mr-2 h-4 w-4" />
                                          Upload Background
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                          className="text-destructive"
                                          onClick={(e) => handleDelete(e, collection)}
                                        >
                                          <Trash2 className="mr-2 h-4 w-4" />
                                          Delete
                                        </DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                  <div className="flex flex-col p-3 text-start">
                                    {editingId === collection.id ? (
                                      <Input
                                        className="font-bold text-base h-7"
                                        defaultValue={collection.name}
                                        autoFocus
                                        onClick={(e) => e.preventDefault()}
                                        onBlur={() => setEditingId(null)}
                                        onKeyDown={async (e) => {
                                          if (e.key === "Enter") {
                                            const newName = e.currentTarget.value.trim();
                                            if (newName && newName !== collection.name) {
                                              await collections.save({
                                                id: collection.id,
                                                name: newName,
                                              });
                                            }
                                            setEditingId(null);
                                          }
                                          if (e.key === "Escape") {
                                            setEditingId(null);
                                          }
                                        }}
                                      />
                                    ) : (
                                      <p className="text-[16px] leading-[20px] font-bold mt-2 line-clamp-2 h-[40px]">
                                        {collection.name}
                                      </p>
                                    )}
                                    <p className="text-xs text-muted-foreground">
                                      {formatDistanceToNow(collection.updatedAt)}
                                    </p>
                                  </div>
                                </div>
                              </Link>
                            );
                          })}
                        </div>
                        <div ref={ref} style={{ height: "1px" }} />
                        <div className="py-4 text-center opacity-60">
                          {loading ? (
                            <p className="text-sm text-muted-foreground">Loading...</p>
                          ) : !hasMore ? (
                            <p className="text-sm text-muted-foreground">No more items to load</p>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={openUploadDialog} onOpenChange={setOpenUploadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload Background Image</DialogTitle>
          </DialogHeader>
          <div className="grid w-full items-center gap-4">
            <UploadBackground
              onUpload={async (url) => {
                console.log("Uploaded image:", url);
                setOpenUploadDialog(false);
                await collections.save({
                  id: selectedCollection.id,
                  bannerImage: url,
                });
              }}
              defaultImage={selectedCollection?.bannerImage}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
});

export default Projects;
