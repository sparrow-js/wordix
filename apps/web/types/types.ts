import type {
    JSONValue,
    CollectionPermission,
    DocumentPermission,
  } from "@/shared/types";
  
export type FetchOptions = {
    prefetch?: boolean;
    revisionId?: string;
    shareId?: string;
    force?: boolean;
};

export type NavigationNode = {
    id: string;
    title: string;
    emoji?: string | null;
    url: string;
    children: NavigationNode[];
    isDraft?: boolean;
};
  
export type CustomTheme = {
    accent: string;
    accentText: string;
};

export type PublicTeam = {
    avatarUrl: string;
    name: string;
    customTheme: Partial<CustomTheme>;
    tocPosition: TOCPosition;
};

export enum TOCPosition {
    Left = "left",
    Right = "right",
}

export type Properties<C> = {
    [Property in keyof C as C[Property] extends JSONValue
      ? Property
      : never]?: C[Property];
};

  
  export type CollectionSort = {
    field: string;
    direction: "asc" | "desc";
  };
  
  // Pagination response in an API call
  export type Pagination = {
    limit: number;
    nextPath: string;
    offset: number;
  };
  
  // Pagination request params
  export type PaginationParams = {
    limit?: number;
    offset?: number;
    sort?: string;
    direction?: "ASC" | "DESC";
  };
  
  export type SearchResult = {
    id: string;
    ranking: number;
    context: string;
    document: Document;
  };
  
  export type WebsocketEntityDeletedEvent = {
    modelId: string;
  };