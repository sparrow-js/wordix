import prisma from "@/backend/prisma";
import { updateDocumentStructure } from "../collection";

const DOCUMENT_VERSION = 1;

export async function createDocument(data: any, parentId?: string) {
  console.log("********** startTime", new Date().getTime());
  const document = await prisma.document.create({
    data: data,
    include: {
      collection: true,
    },
  });

  if (document.collection) {
    let { documentStructure } = document.collection;
    if (!documentStructure) documentStructure = [];
    if (parentId) {
      const addDocumentToParent = (nodes: any[], parentId: string, newDocument: any) => {
        for (const node of nodes) {
          if (node.id === parentId) {
            node.children = [...(node.children || []), newDocument];
            return true;
          }
          if (node.children) {
            const found = addDocumentToParent(node.children, parentId, newDocument);
            if (found) return true;
          }
        }
        return false;
      };

      const newDocumentNode = {
        id: document.id,
        title: document.title,
        urlId: document.urlId,
      };

      const newdocumentStructure = [...(documentStructure as any[])];
      addDocumentToParent(newdocumentStructure, parentId, newDocumentNode);

      await updateDocumentStructure(documentStructure, document.collectionId);
    } else {
      await updateDocumentStructure(
        [
          ...(documentStructure as any[]),
          {
            id: document.id,
            title: document.title,
            urlId: document.urlId,
          },
        ],
        document.collectionId,
      );
    }
  }
  console.log("********** endTime", new Date().getTime());

  return document;
}

export async function deleteDocument(documentId: string, collectionId: string) {
  await prisma.document.delete({
    where: {
      id: documentId,
    },
  });

  const documentStructure = await prisma.collection.findUnique({
    where: {
      id: collectionId,
    },
    select: {
      documentStructure: true,
    },
  });
  if (!documentStructure) return;

  const removeFolderById = (nodes: any[], documentId: string): any[] => {
    return nodes.filter((node) => {
      if (node.id === documentId) {
        return false;
      }
      if (node.children) {
        node.children = removeFolderById(node.children, documentId);
      }
      return true;
    });
  };

  const updatedDocumentStructure = removeFolderById(documentStructure as any, documentId);

  await prisma.collection.update({
    where: {
      id: collectionId,
    },
    data: {
      documentStructure: updatedDocumentStructure,
    },
  });

  return true;
}
