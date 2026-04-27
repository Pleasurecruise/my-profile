export interface R2ObjectBody {
  text(): Promise<string>;
  arrayBuffer(): Promise<ArrayBuffer>;
}

export interface R2Objects {
  objects: Array<{ key: string }>;
  truncated: boolean;
  cursor: string;
}

export interface R2Bucket {
  list(options?: { prefix?: string; limit?: number; cursor?: string }): Promise<R2Objects>;
  get(key: string): Promise<R2ObjectBody | null>;
}

export interface Hyperdrive {
  readonly connectionString: string;
}

export interface Assets {
  fetch(request: Request): Promise<Response>;
}
