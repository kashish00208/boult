import { FileItem } from "@/types";

export function toWebContainerMount(files: FileItem[]) {
  const mountStructure: Record<string, any> = {};

  for (const file of files) {
    mountStructure[file.path] = {
      file: {
        contents: file.content || "",
      },
    };
  }

  return mountStructure;
}
export default toWebContainerMount