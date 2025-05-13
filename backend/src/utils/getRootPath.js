import path from "path";

export function getRootPath(relativePath) {
  return path.join(process.cwd(), relativePath);
}
