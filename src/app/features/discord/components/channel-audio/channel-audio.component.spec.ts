import { ComponentFixture, TestBed } from "@angular/core/testing";
import { DebugElement, signal } from "@angular/core";
import { ChannelAudioComponent } from "./channel-audio.component";
import { By } from "@angular/platform-browser";
import { AudioStateService } from "../../services/audio-state.service";
import { AudioService } from "../../models/audio-service";

describe("ChannelAudioComponent", () => {
  // ==========================================================================
  // Mocks
  // ==========================================================================

  const mockAudioService = signal<AudioService | undefined>(undefined);
  const mockIsConnecting = signal<boolean>(false);
  const mockAudioServiceData: AudioService = {
    name: "Music Bot",
    icon_url: "assets/gm-logo.svg",
    online: true,
  };

  // ==========================================================================
  // Setup
  // ==========================================================================

  let fixture: ComponentFixture<ChannelAudioComponent>;

  beforeEach(async () => {
    mockAudioService.set(undefined);
    mockIsConnecting.set(false);

    await TestBed.configureTestingModule({
      imports: [ChannelAudioComponent],
      providers: [
        {
          provide: AudioStateService,
          useValue: {
            audioBot: mockAudioService,
            isConnecting: mockIsConnecting,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChannelAudioComponent);
  });

  // ==========================================================================
  // Test Cases
  // ==========================================================================

  it("should render nothing when AudioService is undefined", () => {
    mockAudioService.set(undefined);
    fixture.detectChanges();

    const spinner: DebugElement = fixture.debugElement.query(
      By.css("app-loading-spinner"),
    );
    const img: DebugElement = fixture.debugElement.query(By.css("img"));
    const span: DebugElement = fixture.debugElement.query(By.css("span"));

    expect(spinner).toBeNull();
    expect(img).toBeNull();
    expect(span).toBeNull();
  });

  it("should render the LoadingSpinner, but show the Name, when AudioService is Connecting", () => {
    mockAudioService.set(mockAudioServiceData);
    mockIsConnecting.set(true);
    fixture.detectChanges();

    const spinner: DebugElement = fixture.debugElement.query(
      By.css("app-loading-spinner"),
    );
    const img: DebugElement = fixture.debugElement.query(By.css("img"));
    const span: HTMLSpanElement = fixture.debugElement.query(
      By.css("span"),
    ).nativeElement;

    expect(spinner).toBeTruthy();
    expect(img).toBeNull();
    expect(span.textContent).toContain(mockAudioServiceData.name);
  });

  it("should render AudioService Icon and Name when AudioService is Connected", () => {
    mockAudioService.set(mockAudioServiceData);
    mockIsConnecting.set(false);
    fixture.detectChanges();

    const spinner: DebugElement = fixture.debugElement.query(
      By.css("app-loading-spinner"),
    );
    const img: HTMLImageElement = fixture.debugElement.query(
      By.css("img"),
    ).nativeElement;
    const span: HTMLSpanElement = fixture.debugElement.query(
      By.css("span"),
    ).nativeElement;

    expect(spinner).toBeNull();
    expect(img.src).toContain(mockAudioServiceData.icon_url);
    expect(span.textContent).toContain(mockAudioServiceData.name);
  });
});
