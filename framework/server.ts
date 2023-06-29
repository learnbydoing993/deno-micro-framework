import { Router } from "./router.ts";

export class Server {
  router: Router = new Router();
  private server: Deno.Listener;
  private host: string;
  private port: number;

  constructor(host: string, port: number) {
    this.host = host;
    this.port = port;
    this.server = Deno.listen({ hostname: host, port: port });
  }

  public async start() {
    console.log(`Running server on host: ${this.host} port: ${this.port}`);
    // Connections to the server will be yielded up as an async iterable.
    for await (const conn of this.server) {
      // In order to not be blocking, we need to handle each connection individually
      // without awaiting the function
      this.serveHttp(conn);
    }
  }

  private async serveHttp(conn: Deno.Conn) {
    // This "upgrades" a network connection into an HTTP connection.
    const httpConn = Deno.serveHttp(conn);
    // Each request sent over the HTTP connection will be yielded as an async
    // iterator from the HTTP connection.
    for await (const requestEvent of httpConn) {
      const response = this.router.handleRequest(requestEvent);
      requestEvent.respondWith(response);
    }
  }
}