declare module "better-sqlite3" {
  interface DatabaseOptions {
    readonly fileMustExist?: boolean;
    readonly memory?: boolean;
    readonly readonly?: boolean;
  }

  interface Statement {
    run(params?: any): any;
    get(params?: any): any;
    all(params?: any): any[];
  }

  class Database {
    constructor(filename: string, options?: DatabaseOptions);
    pragma(command: string): any;
    exec(sql: string): void;
    prepare(sql: string): Statement;
  }

  export = Database;
}
