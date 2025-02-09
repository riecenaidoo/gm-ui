import {Song} from "../../../../core/catalogue/models/song";

export interface CreatePlaylistRequest {

  name: string;

  songs?: Song[];

}
