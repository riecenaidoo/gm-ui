import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from "@angular/core/testing";
import { DebugElement, WritableSignal, signal } from "@angular/core";
import { ChannelAudioComponent } from "./channel-audio.component";
import { By } from "@angular/platform-browser";
import { AudioStateService } from "../../services/audio-state.service";
import { AudioService } from "../../models/audio-service";

describe("ChannelAudioComponent", () => {
  // ==========================================================================
  // Mocks
  // ==========================================================================

  const mockAudioService: WritableSignal<AudioService | undefined> = signal<
    AudioService | undefined
  >(undefined);
  const mockIsConnecting: WritableSignal<boolean> = signal<boolean>(false);
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
            isLoading: {
              connection: mockIsConnecting,
            },
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

  it("should render Name but not Icon when AudioService is Connecting", fakeAsync(() => {
    mockAudioService.set(mockAudioServiceData);
    mockIsConnecting.set(true);
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const img: DebugElement = fixture.debugElement.query(By.css("img"));
    const span: HTMLSpanElement = fixture.debugElement.query(
      By.css("span"),
    ).nativeElement;

    expect(img).toBeNull();
    expect(span.textContent).toContain(mockAudioServiceData.name);
  }));

  it("should render Name and Icon when AudioService is Connected", fakeAsync(() => {
    mockAudioService.set(mockAudioServiceData);
    mockIsConnecting.set(false);
    fixture.detectChanges();
    tick(100);
    fixture.detectChanges();

    const img: HTMLImageElement = fixture.debugElement.query(
      By.css("img"),
    ).nativeElement;
    const span: HTMLSpanElement = fixture.debugElement.query(
      By.css("span"),
    ).nativeElement;

    expect(img.src).toContain(mockAudioServiceData.icon_url);
    expect(span.textContent).toContain(mockAudioServiceData.name);
  }));
});
