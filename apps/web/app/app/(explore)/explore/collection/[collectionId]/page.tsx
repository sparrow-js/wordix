"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { client } from "@/utils/ApiClient";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import { useEffect, useState } from "react";

interface Document {
  id: string;
  title: string;
  description: string;
  bannerImage?: string;
  collectionId: string;
  publishedAt: string;
  collection: {
    name: string;
  };
}

const DeploymentListSkeleton = () => (
  <div className="grid grid-cols-4 gap-4">
    {[1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
      <div key={index} className="flex flex-col border border-border rounded-lg overflow-hidden shadow-md">
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

export default function ProjectPage({ params }: { params: { collectionId: string } }) {
  const { collectionId } = params;
  const [documents, setDocuments] = useState<Document[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoaded, setIsLoaded] = useState(false);

  const fetchDocuments = async () => {
    const res = await client.post("/documents/list", {
      collectionId,
      sort: "publishedAt",
      visibility: "public",
      limit: 25,
      page: 0,
    });
    if (res.data) {
      setDocuments(res.data);
      setIsLoaded(true);
    } else {
      setErrorMessage(res.message);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, [collectionId]);

  return (
    <main className="flex-grow w-full min-h-screen">
      <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
        <div className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-sm z-50">
          <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-6 px-20">
            <Link href="https://www.wordix.so/">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center">
                  <img src="/logo200.png" alt="Logo" className="w-10 h-10 object-cover rounded-lg" />
                </div>
                <div className="text-xl font-bold text-gray-900">
                  Word<span className="text-red-600">ix</span>
                </div>
              </div>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-4">
                <Link href="/login">
                  <Button
                    variant="outline"
                    className="text-gray-900 hover:text-gray-700 transition-all duration-300 hover:scale-105"
                  >
                    Sign in
                  </Button>
                </Link>
                <Link href="/">
                  <Button
                    variant="default"
                    className="bg-gray-900 hover:bg-gray-800 transition-all duration-300 hover:scale-105"
                  >
                    Try for free
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-20 pt-32">
        {
          documents.length > 0 ? (
            <div className="p-6 pt-0 mb-6">
              <h1 className="text-2xl font-bold text-center">{documents[0].collection.name}</h1>
            </div>
          ) : null
        }
        <div className="p-6 pt-0">
          {!isLoaded ? (
            <DeploymentListSkeleton />
          ) : documents.length === 0 ? (
            <div className="flex flex-col rounded-md overflow-hidden">No deployments found</div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {documents.map((deployment, index) => (
                <Link key={deployment.id} href={`/explore/app/${deployment.id}`}>
                  <div className="flex flex-col border border-border rounded-lg overflow-hidden shadow-md hover:ring-1 hover:ring-[#fad400]">
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
                      <p className="text-xs text-muted-foreground">{formatDistanceToNow(deployment.publishedAt)}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
