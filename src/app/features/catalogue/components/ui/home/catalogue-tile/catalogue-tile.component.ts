import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-catalogue-tile',
  templateUrl: './catalogue-tile.component.html',
  styleUrl: './catalogue-tile.component.css'
})
export class CatalogueTileComponent {

  @Input() public name: string = "Catalogue Name";

}
