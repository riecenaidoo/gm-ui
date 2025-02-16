import {PatchOperation} from "./patch-operation";

export interface PlaylistsSongsPatchRequest {

  op: PatchOperation;

  urls: string[];

}
