export type RouteHandler = (ctx: Context) => Promise<Response>;

interface Route {
  path: string;
  method: string;
  handler: RouteHandler;
}

export interface Context {
  request: Request;
  params: { [key: string]: string };
}

export class Router {
  private routes: Route[] = [];

  private addRoute(method: string, path: string, handler: RouteHandler): void {
    const route: Route = {
      method,
      path,
      handler,
    };

    this.routes.push(route);
  }

  public get(path: string, handler: RouteHandler): void {
    this.addRoute("GET", path, handler);
  }

  public post(path: string, handler: RouteHandler): void {
    this.addRoute("POST", path, handler);
  }

  public put(path: string, handler: RouteHandler): void {
    this.addRoute("PUT", path, handler);
  }

  public delete(path: string, handler: RouteHandler): void {
    this.addRoute("DELETE", path, handler);
  }

  public findMatchingRoute(method: string, url: string): Route | undefined {
    return this.routes.find((route) => {
      const routePathSegments = route.path.split("/");
      const urlPathSegments = url.split("/");

      if (routePathSegments.length !== urlPathSegments.length) {
        return false;
      }

      for (let i = 0; i < routePathSegments.length; i++) {
        const routeSegment = routePathSegments[i];
        const urlSegment = urlPathSegments[i];

        if (routeSegment.startsWith(":")) {
          continue;
        }

        if (routeSegment !== urlSegment) {
          return false;
        }
      }

      return route.method === method;
    });
  }

  public extractParams(url: string, routePath: string): { [key: string]: string } {
    const params: { [key: string]: string } = {};

    const routePathSegments = routePath.split("/");
    const urlPathSegments = url.split("/");

    for (let i = 0; i < routePathSegments.length; i++) {
      const routeSegment = routePathSegments[i];
      if (routeSegment.startsWith(":")) {
        const paramName = routeSegment.slice(1);
        const paramValue = urlPathSegments[i];
        params[paramName] = paramValue;
      }
    }

    return params;
  }
}