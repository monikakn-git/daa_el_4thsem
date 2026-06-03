declare module "better-sqlite3" {
  interface DatabaseOptions {
    readonly fileMustExist?: boolean;
    readonly memory?: boolean;
    readonly readonly?: boolean;
  }

  type SqlParams = Record<string, string | number | boolean | null> | Array<string | number | boolean | null>;

  interface Statement {
    run(params?: SqlParams): unknown;
    get(params?: SqlParams): unknown;
    all(params?: SqlParams): unknown[];
  }

  class Database {
    constructor(filename: string, options?: DatabaseOptions);
    pragma(command: string): unknown;
    exec(sql: string): void;
    prepare(sql: string): Statement;
  }

  export default Database;
}
