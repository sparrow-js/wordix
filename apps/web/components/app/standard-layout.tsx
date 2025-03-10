"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRightIcon, Globe, Lock, PlusIcon, Rocket } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { getCoolHueImage } from "@/components/coolhue";
import LoadingCircle from "@/components/icons/loading-circle";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Label } from "@/components/ui/label";
import useStores from "@/hooks/useStores";
import type { CollectionPermission } from "@prisma/client";
import { formatDistanceToNow } from "date-fns";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { tools as toolsTemplate } from "./const";
import { defaultContent } from "./default-content";

interface Project {
  title: string;
  timeAgo: string;
  initial: string;
}

interface Deployment {
  title: string;
  timeAgo: string;
  imageUrl: string;
}

const ProjectList = observer(() => {
  const { collections } = useStores();

  return (
    <div className="flex flex-row gap-4">
      {collections.orderedList.slice(0, 5).map((project, index) => (
        <Link key={project.id} href={`/${project.id}/docs`}>
          <div className="flex flex-col border border-border rounded-lg overflow-hidden shadow-md w-40 hover:ring-1 hover:ring-[#fad400]">
            <div
              className="relative h-24 w-full bg-cover bg-center"
              style={{ backgroundImage: `url(${project.bannerImage || "/placeholder.png"})` }}
            >
              <div className="absolute bottom-0 left-0 translate-y-1/2 translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-muted-foreground text-background">
                {project.name.slice(0, 1).toUpperCase()}
              </div>
            </div>
            <div className="flex flex-col p-3 text-start">
              <p className="text-[16px] leading-[20px] font-bold mt-2 line-clamp-2 h-[40px]">{project.name}</p>
              <p className="text-xs text-muted-foreground">{formatDistanceToNow(project.updatedAt)}</p>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
});

const ProjectListSkeleton = () => (
  <div className="flex flex-row gap-4">
    {[1, 2, 3, 4, 5].map((_, index) => (
      <div key={index} className="flex flex-col border border-border rounded-lg overflow-hidden shadow-md w-40">
        <div className="relative h-24">
          <Skeleton className="h-24 w-full bg-cover bg-center" />
          <Skeleton className="absolute bottom-0 left-0 translate-y-1/2 translate-x-1/2 h-8 w-8 rounded-full" />
        </div>
        <div className="flex flex-col p-3">
          <Skeleton className="h-4 w-24 mt-2" />
          <Skeleton className="h-3 w-16 mt-1" />
        </div>
      </div>
    ))}
  </div>
);

const ProjectSection = observer(({ openDialog }: { openDialog: () => void }) => {
  const { collections } = useStores();

  if (!collections.isLoaded) {
    return <ProjectListSkeleton />;
  }

  if (collections.orderedList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <p className="text-muted-foreground mb-4">No projects yet</p>
        <Button onClick={openDialog}>
          <PlusIcon className="mr-2 h-4 w-4" />
          Create your first project
        </Button>
      </div>
    );
  }

  return <ProjectList />;
});

const DeploymentListSkeleton = () => (
  <div className="flex flex-row gap-4">
    {[1, 2, 3, 4, 5].map((_, index) => (
      <div key={index} className="flex flex-col border border-border rounded-lg overflow-hidden shadow-md w-40">
        <div className="relative h-24">
          <Skeleton className="h-24 w-full bg-cover bg-center" />
          <Skeleton className="absolute bottom-0 left-0 translate-y-1/2 translate-x-1/2 h-8 w-8 rounded-full" />
        </div>
        <div className="flex flex-col p-3">
          <Skeleton className="h-4 w-24 mt-2" />
          <Skeleton className="h-3 w-16 mt-1" />
        </div>
      </div>
    ))}
  </div>
);

const StandardLayout = observer(() => {
  const [projectName, setProjectName] = useState<string>("");
  const [projectTemplate, setProjectTemplate] = useState<string>("");
  const [projectPrivacy, setProjectPrivacy] = useState<string>("private");

  const [tools, setTools] = useState(toolsTemplate);

  const { collections, documents, workspaces } = useStores();
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isQuickExperienceLoading, setIsQuickExperienceLoading] = useState(false);

  const router = useRouter();
  const fetchProjects = async (page: number) => {
    await collections.fetchPage({
      limit: 25,
      page: page,
      workspaceId: workspaces.selectedWorkspaceId,
    });
  };

  const fetchDeployments = async (page: number) => {
    await documents.fetchPage({
      limit: 25,
      page: page,
      visibility: "public",
      sort: "publishedAt",
      workspaceId: workspaces.selectedWorkspaceId,
    });
  };

  useEffect(() => {
    if (!workspaces.selectedWorkspaceId) return;
    fetchProjects(0);
    fetchDeployments(0);
  }, [workspaces.selectedWorkspaceId]);

  const handleSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      const collection = await collections.save({
        name: projectName || "Start project",
        privacy: projectPrivacy as CollectionPermission,
        template: projectTemplate,
        workspaceId: workspaces.selectedWorkspaceId,
        bannerImage: getCoolHueImage(),
        tools: tools.filter((tool) => tool.children.some((child) => child.value)).map((tool: any) => tool.id),
      });
      // Avoid flash of loading state for the new collection, we know it's empty.
      runInAction(() => {
        collection.documents = [];
      });
      // onSubmit?.();
      // history.push(collection.path);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
    setOpenDialog(false);
  }, [collections, projectName, projectPrivacy, projectTemplate, tools]);

  const createDocument = async (collectionId: string, parentId?: string, template?: any) => {
    const document = await documents.save(
      {
        title: template?.title,
        collectionId: collectionId,
        workspaceId: workspaces.selectedWorkspaceId,
        content: template?.content,
        bannerImage: getCoolHueImage(),
      },
      { parentId },
    );
    router.push(`/${collectionId}/docs/${document.id}`);
  };

  const handleQuickExperience = async () => {
    setIsQuickExperienceLoading(true);
    const collection = await collections.save({
      name: "Quick Experience",
      privacy: "public" as CollectionPermission,
      template: "quick-experience",
      workspaceId: workspaces.selectedWorkspaceId,
      bannerImage: getCoolHueImage(),
    });

    await createDocument(collection.id, undefined, {
      title: "Quick Experience",
      content: defaultContent,
    });
    setIsQuickExperienceLoading(false);
  };

  return (
    <div className="flex h-full w-full md:w-auto flex-1 flex-col bg-muted/30">
      {/* Header */}
      <div className="flex h-[60px] items-center justify-between border-b bg-background px-2 md:px-5 flex-shrink-0">
        <div className="flex items-center gap-4 md:gap-2">
          <Breadcrumb>
            <BreadcrumbItem>
              <BreadcrumbLink>Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
        </div>
        <div className="flex items-center gap-2">
          <Button className="bg-purple-600 hover:bg-purple-800 text-white mr-2" onClick={handleQuickExperience}>
            {isQuickExperienceLoading ? (
              <LoadingCircle dimensions="h-4 w-4 mr-2" />
            ) : (
              <Rocket className="mr-2 h-4 w-4" />
            )}
            Quick Experience
          </Button>
          <Dialog open={openDialog} onOpenChange={setOpenDialog}>
            <DialogTrigger asChild>
              <Button className="bg-[#fad400] hover:bg-[#fce062] text-black">
                <PlusIcon className="mr-2 h-4 w-4" />
                Create new project
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[800px] max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Create a project</DialogTitle>
              </DialogHeader>
              <div className=" grid gap-4 bg-background  w-full">
                <div className="flex align-middle">
                  <div className="w-full">
                    <Label>Name</Label>
                    <input
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 mt-1"
                      placeholder="Untitled"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                    />
                  </div>
                </div>
                <div className="mx-auto mt-4 flex w-full justify-center space-x-4">
                  <div className="mt-2 flex w-full flex-col justify-between">
                    <div>
                      <div className="mb-2 flex items-center align-middle">
                        <div className="text-base font-bold">Privacy</div>
                      </div>
                      <div className="mb-2 text-sm text-muted-foreground">Who can view this project?</div>
                      <RadioGroup
                        defaultValue="private"
                        onValueChange={(currentValue) => {
                          setProjectPrivacy(currentValue);
                        }}
                      >
                        <div className="divide grid gap-0 divide-y overflow-hidden rounded-md border">
                          <Label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group flex cursor-pointer items-center gap-4 px-4 py-3 hover:bg-stone-50"
                            htmlFor="r1"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-stone-900">
                              <Globe className="h-5 w-5" />
                            </div>
                            <div className="grid flex-1 gap-1 text-xs">
                              <p className="font-medium">Public</p>
                              <p className="text-muted-foreground">Anyone can view and fork this project</p>
                            </div>
                            <RadioGroupItem value="public" id="r1" />
                          </Label>
                          <Label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group flex cursor-pointer items-center gap-4 px-4 py-3 hover:bg-stone-50"
                            htmlFor="r2"
                          >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-stone-900">
                              <Lock className="h-5 w-5" />
                            </div>
                            <div className="grid flex-1 gap-1 text-xs">
                              <p className="font-medium">Private</p>
                              <p className="text-muted-foreground">
                                Only users within your organization can view and fork this project
                              </p>
                            </div>
                            <RadioGroupItem value="private" id="r2" />
                          </Label>
                        </div>
                      </RadioGroup>
                    </div>
                    <Button
                      className="w-full mt-2"
                      onClick={() => {
                        handleSubmit();
                      }}
                    >
                      {isLoading ? (
                        <LoadingCircle dimensions="h-4 w-4" />
                      ) : (
                        <>
                          <PlusIcon className="mr-2 h-4 w-4" />
                          <div className="text-lg">Create project</div>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex h-[calc(100svh-120px)] overflow-hidden">
        <div className="flex h-full overflow-y-auto w-full">
          <div className="w-full px-1 py-4 md:p-5">
            <main className="flex flex-1 flex-col gap-4">
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm col-span-4">
                <div className="flex items-start justify-between p-6">
                  <div className="mt-1 flex flex-1 flex-col gap-1.5">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Latest Projects</h3>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/projects">
                      <Button variant="outline" size="sm">
                        Go to Projects
                        <ChevronRightIcon className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="p-6 pt-0 min-h-[100px]">
                  <ProjectSection openDialog={() => setOpenDialog(true)} />
                </div>
              </div>
              <div className="rounded-lg border bg-card text-card-foreground shadow-sm col-span-4">
                <div className="flex items-start justify-between p-6">
                  <div className="mt-1 flex flex-1 flex-col gap-1.5">
                    <h3 className="text-2xl font-semibold leading-none tracking-tight">Recent Deployments</h3>
                  </div>
                  <div className="flex gap-2">
                    <Link href="/deployments">
                      <Button variant="outline" size="sm">
                        Go to Deployments
                        <ChevronRightIcon className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  {!documents.isLoaded ? (
                    <DeploymentListSkeleton />
                  ) : documents.publishedList.length === 0 ? (
                    <div className="flex flex-col rounded-md overflow-hidden">No deployments found</div>
                  ) : (
                    <div className="flex flex-row gap-4">
                      {documents.publishedList.slice(0, 5).map((deployment, index) => (
                        <Link
                          key={deployment.id}
                          href={`/${deployment.collectionId}/deployments/${deployment.id}/overview`}
                        >
                          <div className="flex flex-col border border-border rounded-lg overflow-hidden shadow-md w-40 hover:ring-1 hover:ring-[#fad400]">
                            <div
                              className="relative h-24 w-full bg-cover bg-center"
                              style={{ backgroundImage: `url(${deployment.bannerImage || "/placeholder.png"})` }}
                            >
                              <div className="absolute bottom-0 left-0 translate-y-1/2 translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-muted-foreground text-background">
                                {deployment.title.slice(0, 1).toUpperCase()}
                              </div>
                            </div>
                            <div className="flex flex-col p-3">
                              <p className="text-[16px] leading-[20px] font-bold mt-2 line-clamp-2 h-[40px]">
                                {deployment.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(deployment.publishedAt)}
                              </p>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-8"></div> */}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
});

export default StandardLayout;
