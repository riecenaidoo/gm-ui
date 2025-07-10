import { Component, Input } from "@angular/core";

@Component({
  // Intentional `header` attribute-selector.
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: "header[app-header]",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
  imports: [],
})
export class HeaderComponent {
  @Input({ required: true })
  public pageTitle!: string;
}
