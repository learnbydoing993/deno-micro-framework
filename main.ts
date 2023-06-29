import { Server } from "./framework/server.ts";
import { Name } from "./name.ts";

const server = new Server("localhost", 8080);

// Define routes
server.router.get("/", async (_ctx) => {
  return await new Response("Hello world", {status: 200});
});

server.router.get("/name/:name", async (ctx) => {
  return await new Response(`Hello ${ctx.params["name"]}`, {status: 200});
});

server.router.post("/write", async (ctx) => {
  const body: Name = await ctx.request.json();
  return new Response(body.name, {status: 200});
})

server.start();