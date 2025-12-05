import { TestBed } from "@angular/core/testing";
import { PlaylistStateService } from "./playlist-state.service";
import { effect, Injector, runInInjectionContext } from "@angular/core";

/**
 * @see PlaylistStateService
 */
describe("PlaylistStateService", () => {
  let service: PlaylistStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PlaylistStateService],
    });
    service = TestBed.inject(PlaylistStateService);
  });

  /**
   * @see PlaylistStateService#playlistTitleFilter
   */
  describe("playlistTitleFilter", () => {
    it("should trim whitespace", () => {
      service.playlistTitleFilter = "foo ";
      expect(service.playlistTitleFilter()).toBe("foo");
    });

    it("should normalise empty strings to undefined", () => {
      service.playlistTitleFilter = " ";
      expect(service.playlistTitleFilter()).toBeUndefined();
    });

    it("should allow clearing the filter", () => {
      service.playlistTitleFilter = undefined;
      // noinspection JSObjectNullOrUndefined
      expect(service.playlistTitleFilter()).toBeUndefined();
    });

    it("should only signal after a distinct change", () => {
      expect(service.playlistTitleFilter()).toBeUndefined();

      let numSignals = 0;
      runInInjectionContext(TestBed.inject(Injector), () => {
        effect(() => {
          service.playlistTitleFilter();
          numSignals++;
        });
      });

      service.playlistTitleFilter = "foo";
      service.playlistTitleFilter = "foo";

      TestBed.tick();
      expect(numSignals).toBe(1);
    });
  });

  /**
   * @see PlaylistStateService#playlistTitleFilter$
   */
  it("should provide an Observable for interop with Rxjs", (done: DoneFn) => {
    service.playlistTitleFilter$.subscribe((value: string | undefined) => {
      expect(value).toBe("foo");
      done();
    });

    service.playlistTitleFilter = "foo";
  });
});
