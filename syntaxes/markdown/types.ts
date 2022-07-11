export type Patterns = {
   include: string;
}[];

export type Captures = {
   [key: number]: RepoItem;
};

export type RepoItem = {
   name?: string;
   match?: string;
   begin?: string;
   end?: string;
   while?: string;
   contentName?: string;
   captures?: Captures;
   beginCaptures?: Captures;
   endCaptures?: Captures;
   include?: string;
   patterns?: RepoItem[];
   comment?: string;
   applyEndPatternLast?: number;
};

export type Repository = {
   [key: string]: RepoItem;
};

export type Language = {
   name: string;
   identifiers: string[];
   contentName: string;
   include: string;
};