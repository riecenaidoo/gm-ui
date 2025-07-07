import { Component, Input } from "@angular/core";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrl: "./header.component.css",
  imports: [],
})
export class HeaderComponent {
  @Input({ required: true })
  public pageTitle!: string;
}
