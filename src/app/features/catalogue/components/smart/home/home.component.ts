import {Component} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

  public playlists: String[] = [
    'foo',
    'bar', 'foo',
    'bar', 'foo',
    'bar', 'foo',
    'bar', 'foo',
    'bar', 'foo',
    'bar', 'foo',
    'bar', 'foo',
    'bar', 'foo',
    'bar', 'foo',
    'bar', 'foo',
    'bar', 'foo',
    'bar',
  ];

  /**
   * TODO Open up a modal to receive input (the name of the new Playlist) and then call our service.
   * Remember to refresh whatever we are observing to get our Playlists.
   */
  protected createPlaylist(): void {

  }

}
