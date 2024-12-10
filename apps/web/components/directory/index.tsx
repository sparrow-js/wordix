"use client";

import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { Tree, type TreeApi } from "react-arborist";
import type { NodeRendererProps } from "react-arborist";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, File, FolderClosed, FolderIcon, FolderOpen, MoreHorizontal, Plus, X } from "lucide-react";
import styles from "./directory.module.css";
import { FillFlexParent } from "./fill-flex-parent";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useStores from "@/hooks/useStores";
import { FilePlus, FolderPlus, LayoutGrid } from "lucide-react";
import { observer } from "mobx-react";

type Data = { id: string; title: string; children?: Data[] };
import type Collection from "@/models/Collection";
import type { NavigationNode } from "@/shared/types";
import { useParams, useRouter } from "next/navigation";
import type { NodeApi } from "react-arborist";
import { v4 as uuidv4 } from "uuid";

const INDENT_STEP = 15;

function Directory() {
  const [tree, setTree] = useState<TreeApi<Data> | null | undefined>(null);
  const [active, setActive] = useState<Data | null>(null);
  const [focused, setFocused] = useState<Data | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [count, setCount] = useState(0);
  const [followsFocus, setFollowsFocus] = useState(false);
  const [disableMulti, setDisableMulti] = useState(false);
  const { collections, documents, workspaces } = useStores();
  const [selected, setSelected] = useState<string>("");
  const router = useRouter();
  const { collectionId, id } = useParams<{ collectionId: string; id: string }>();
  const [dndArea, setDndArea] = useState();
  const handleSidebarRef = useCallback((node) => setDndArea(node), []);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCollection = async () => {
      if (collectionId) {
        setIsLoading(true);
        try {
          const collection = await collections.fetch(collectionId);
          setCollection(collection);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchCollection();
  }, [collectionId]);

  useEffect(() => {
    router.prefetch("/app/56acf192-a74c-4a79-a79e-b36c0f95a096/docs/81905a34-84f6-4cff-9bfe-eec712b3b91c"); // Prefetch the dashboard page
  }, []);

  useEffect(() => {
    if (id) {
      setSelected(id);
    } else {
      setSelected("");
    }
  }, [id]);

  useEffect(() => {
    setCount(tree?.visibleNodes.length ?? 0);
  }, [tree, searchTerm]);

  if (isLoading) {
    return (
      <div className="space-y-2 p-4">
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    );
  }

  const onRename = ({ id, name }) => {};

  const createDocument = async (parentId?: string) => {
    const document = await documents.save(
      { title: "Untitled", collectionId: collectionId, workspaceId: workspaces.selectedWorkspaceId },
      { parentId },
    );
    setSelected(document.id);
    await collection?.fetchDocuments({ force: true });
    router.push(`/app/${collectionId}/docs/${document.id}`);
  };

  const createFolder = async (parentId?: string) => {
    const newFolder = {
      id: uuidv4(),
      title: "New Folder",
      children: [],
      url: "",
    } as NavigationNode;

    const originDocumentStructure = collection?.documents ?? [];

    if (parentId) {
      const addFolderToParent = (nodes, parentId, newFolder) => {
        for (const node of nodes) {
          if (node.id === parentId) {
            node.children = [...(node.children || []), newFolder];
            return true;
          }
          if (node.children) {
            const found = addFolderToParent(node.children, parentId, newFolder);
            if (found) return true;
          }
        }
        return false;
      };

      const documentStructure = [...originDocumentStructure];
      addFolderToParent(documentStructure, parentId, newFolder);

      const collectionRes = await collections.save({
        id: collectionId,
        documentStructure: documentStructure,
      });

      if (collectionRes.documentStructure) {
        collection.updateData({ documents: collectionRes.documentStructure });
      }
    } else {
      const documentStructure = [...originDocumentStructure, newFolder];

      const collectionRes = await collections.save({
        id: collectionId,
        documentStructure: documentStructure,
      });

      if (collectionRes.documentStructure) {
        collection.updateData({ documents: collectionRes.documentStructure });
      }
    }
  };

  const updateFolderName = async (name: string, id: string) => {
    await collection?.updateFolderName(name, id);
  };

  const deleteFolder = async (documentId: string | undefined, folderId: string | undefined) => {
    await collection?.deleteFolderDocument(documentId, folderId);
    setSelected(undefined);
    router.push(`/app/${collectionId}/docs`);
  };

  return (
    <div className="group top-[60px] h-full w-full items-center md:top-0">
      <div className="flex h-full w-full flex-col self-stretch bg-background">
        <div className="h-[60px] shrink-0 border-b border-border w-full">
          <div className="flex h-full w-full items-center gap-2 px-3">
            <Button
              variant="outline"
              size="icon"
              className="aspect-square w-fit"
              onClick={() => {
                createDocument();
              }}
            >
              <FilePlus className="h-5 w-5" />
            </Button>
            <Button variant="outline" size="icon" className="aspect-square w-fit" onClick={() => createFolder()}>
              <FolderPlus className="h-5 w-5" />
            </Button>
            <div className="flex w-full justify-end">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  router.push(`/app/${collectionId}/docs`);
                }}
              >
                <LayoutGrid className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 p-2.5 h-full overflow-y-auto">
          {collection?.documents?.length > 0 && (
            <div className="h-full w-full flex-auto" ref={handleSidebarRef}>
              {dndArea && (
                <FillFlexParent>
                  {(dimens) => (
                    <Tree
                      {...dimens}
                      // initialData={collection.documents}
                      selectionFollowsFocus={followsFocus}
                      disableMultiSelection={disableMulti}
                      data={collection.documents}
                      // onRename={onRename}
                      ref={(t) => setTree(t)}
                      openByDefault={true}
                      searchTerm={searchTerm}
                      selection={selected}
                      className={styles.tree}
                      rowClassName={styles.row}
                      padding={15}
                      rowHeight={40}
                      indent={INDENT_STEP}
                      overscanCount={8}
                      onSelect={(selected) => {
                        const node = selected[0];
                        if (!node || Array.isArray(node.children)) return;
                        router.push(`/app/${collectionId}/docs/${node.id}`);
                      }}
                      onActivate={(node) => setActive(node.data)}
                      onFocus={(node) => setFocused(node.data)}
                      onToggle={() => {
                        setTimeout(() => {
                          setCount(tree?.visibleNodes.length ?? 0);
                        });
                      }}
                      // onMove={onMove}
                      dndRootElement={dndArea}
                    >
                      {wraperNode(createFolder, createDocument, deleteFolder, updateFolderName)}
                    </Tree>
                  )}
                </FillFlexParent>
              )}
            </div>
          )}

          {(!collection || !collection.documents || collection.documents.length === 0) && (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
              <FolderIcon className="w-12 h-12 mb-4" />
              <p className="text-sm">No documents yet</p>
              <p className="text-xs">Create a new document to get started</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function wraperNode(
  createFolder: (parentId?: string) => void,
  createDocument: (parentId?: string) => void,
  deleteFolder: (documentId: string | undefined, folderId: string | undefined) => void,
  updateFolderName: (name: string, id: string) => void,
) {
  return ({ node, style, dragHandle }: NodeRendererProps<Data>) => {
    const indentSize = Number.parseFloat(`${style.paddingLeft || 0}`);
    const [open, setOpen] = useState(false);
    const [openCreateFile, setOpenCreateFile] = useState(false);

    const [edit, setEdit] = useState(false);
    const [openOperate, setOpenOperate] = useState(false);

    return (
      <div
        ref={dragHandle}
        style={style}
        className={clsx(
          "group/node flex items-center py-2 px-3 mx-1 h-full relative rounded-md transition-colors duration-200 ease-in-out",
          node.state.isSelected && "bg-blue-100 dark:bg-blue-900",
          // node.state.isFocused && 'ring-2 ring-blue-400',
          !node.state.isSelected && "hover:bg-gray-100 dark:hover:bg-gray-800",
        )}
        onClick={() => node.isInternal && node.toggle()}
      >
        {node.isInternal ? (
          <FolderArrow node={node} />
        ) : (
          <span className="pl-1">
            <File className="w-4 h-4" />
          </span>
        )}

        <span className="text-sm flex-grow pl-1">
          {node.isEditing ? <Input node={node} updateFolderName={updateFolderName} /> : node.data.title}
        </span>
        <div className={`${openOperate ? "flex" : "hidden"} group-hover/node:flex`}>
          {Array.isArray(node.children) ? (
            <DropdownMenu
              modal={false}
              open={openCreateFile}
              onOpenChange={(value) => {
                if (value) {
                  setOpenOperate(value);
                  setTimeout(() => {
                    setOpenCreateFile(value);
                  }, 400);
                } else {
                  setOpenCreateFile(value);
                  setTimeout(() => {
                    setOpenOperate(value);
                  }, 400);
                }
              }}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  className="aspect-square h-6 w-6"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent forceMount={true}>
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <div
                      className="flex justify-center items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCreateFile(false);
                        createDocument(node.id);
                      }}
                    >
                      <span className="mr-2">create file</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <div
                      className="flex justify-center items-center"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenCreateFile(false);
                        createFolder(node.id);
                      }}
                    >
                      <span className="mr-2">create folder</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : null}

          <DropdownMenu
            modal={false}
            open={open}
            onOpenChange={(value) => {
              if (value) {
                setOpenOperate(value);
                setTimeout(() => {
                  setOpen(value);
                }, 400);
              } else {
                setOpen(value);
                setTimeout(() => {
                  setOpenOperate(value);
                }, 400);
              }
            }}
          >
            <DropdownMenuTrigger asChild>
              {node.isEditing ? null : (
                <Button
                  className="aspect-square h-6 w-6"
                  variant="ghost"
                  size="icon"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent forceMount={true}>
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <div
                    className="flex justify-center items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setEdit(true);
                      node.edit();
                    }}
                  >
                    <span className="mr-2">rename</span>
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <div className="flex justify-center items-center" onClick={() => {}}>
                    <span className="mr-2">Duplicate</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem>
                  <div
                    className="flex justify-center items-center"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpen(false);

                      const documentId = Array.isArray(node.children) ? undefined : node.id;
                      const folderId = Array.isArray(node.children) ? node.id : undefined;

                      deleteFolder(documentId, folderId);
                    }}
                  >
                    <span className="mr-2">Delete</span>
                  </div>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    );
  };
}

function Input({ node, updateFolderName }) {
  const [value, setValue] = useState(node.data.title);
  return (
    <div className="w-full flex">
      <input
        className="flex h-10 w-full rounded-md bg-transparent px-0 py-0 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 "
        name="name"
        type="text"
        defaultValue={node.data.title}
        value={value}
        onFocus={(e) => e.currentTarget.select()}
        // onBlur={() => node.reset()}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") node.reset();
          if (e.key === "Enter") {
            node.submit(value);
            updateFolderName(value, node.id);
          }
        }}
      />
      <div className="ml-2 flex items-center">
        <Button
          className="aspect-square h-6 w-6"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            node.submit(value);
            updateFolderName(value, node.id);
          }}
        >
          <Check className="w-4 h-4" />
        </Button>
        <Button
          className="aspect-square h-6 w-6"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}

function FolderArrow({ node }: { node: NodeApi<Data> }) {
  return (
    <span className="pl-1">
      {node.isInternal ? node.isOpen ? <FolderOpen className="w-4 h-4" /> : <FolderClosed className="w-4 h-4" /> : null}
    </span>
  );
}

export default observer(Directory);
