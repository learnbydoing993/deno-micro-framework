import { Context, RouteHandler } from "./router.ts";

export type Middleware = (ctx: Context) => Promise<Response | void>;

export class MiddlewareWrapper {
  private middlewares: Middleware[] = [];

  public use(middleware: Middleware) {
    this.middlewares.push(middleware);
  }

  public async runMiddlewares(ctx: Context, handler: RouteHandler): Promise<Response> {
    let index = 0;
  
    // Check if there are more middlewares to run
    while (index < this.middlewares.length) {
      const middleware = this.middlewares[index];
      index++;
      // Call the middleware with the context and the next function
      const result = await middleware(ctx);

      // Check if the middleware returned a Response
      if (result) {
        // Stop executing the remaining middlewares and return the Response
        return result;
      }
    }

    // All middlewares have been executed, call the handler
    return handler(ctx);
  }
}