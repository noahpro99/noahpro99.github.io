import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("blog-projects", "routes/blog-projects.tsx"),
  route("content/:id", "routes/content.tsx"),
] satisfies RouteConfig;
