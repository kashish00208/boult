import { WebContainer } from "@webcontainer/api";

let webcontainerInstance : WebContainer | null = null;

export const initWebContainer = async() :Promise<WebContainer> =>{
    if(webcontainerInstance)return webcontainerInstance;

    webcontainerInstance = await WebContainer.boot();

    return webcontainerInstance;
}