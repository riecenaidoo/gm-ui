import {Song} from "../song";

export interface PlaylistsCreateRequest {

  name: string;

  songs?: Song[];

}
