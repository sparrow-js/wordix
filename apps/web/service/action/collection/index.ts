
import prisma from "@/backend/prisma";
import { uniq } from "lodash";

export async function updateDocumentStructure(documentStructure: any, collectionId: string) {
    const collection = await prisma.collection.findUnique({
        where: {
            id: collectionId,
        },
    });

    if (!collection) {
        throw new Error("Collection not found");
    }

    const updatedCollection = await prisma.collection.update({
        where: {
            id: collectionId,
        },
        data: {
            documentStructure: documentStructure,
        },
    });

    return updatedCollection;
}

export async function deleteFolderDocument(documentId: string, collectionId: string, folderId: string) {

    const documentIds: string[] = [];

    const {documentStructure} = await prisma.collection.findUnique({
        where: {
            id: collectionId,
        },
        select: {
            documentStructure: true,
        },
    });
    
    if (!folderId) {
        await prisma.document.delete({
            where: {
                id: documentId,
            },
        });

        documentIds.push(documentId);
    } else { 
        if (!documentStructure) return;
        const collectDocumentIds = (nodes: any[], folderId: string): string[] => {
            let documentIds: string[] = [];
            
            for (const node of nodes) {
                if (node.id === folderId) {
                    if (node.children) {
                        documentIds = documentIds.concat(node.children.map((child: any) => child.id));
                        for (const child of node.children) {
                            if (child.children) {
                                documentIds = documentIds.concat(collectDocumentIds([child], child.id));
                            }
                        }
                    }
                    break;
                } else if (node.children) {
                    documentIds = documentIds.concat(collectDocumentIds(node.children, folderId));
                }
            }
            
            return uniq(documentIds);
        };
    
        if (folderId) {
            const documentIds = collectDocumentIds(documentStructure as any, folderId);
            if (documentIds.length > 0) {
                await prisma.document.deleteMany({
                    where: {
                        id: {
                            in: documentIds
                        }
                    }
                });
            }
        }

        documentIds.push(...documentIds);    
    }

    const removeFolderById = (nodes: any[], folderId: string): any[] => {
        return nodes.filter((node) => {
            if (node.id === folderId) {
                return false;
            }
            if (node.children) {
                node.children = removeFolderById(node.children, folderId);
            }
            return true;
        });
    };

    const updatedDocumentStructure = removeFolderById(documentStructure as any, documentId ||folderId);

    const updatedCollection = await prisma.collection.update({
        where: {
            id: collectionId,
        },
        data: {
            documentStructure: updatedDocumentStructure,
        },
    });
  
    return {
        documentIds,
        documents: updatedCollection.documentStructure,
    };
}