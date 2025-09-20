import { TestBed } from "@angular/core/testing";
import { CatalogueStateService } from "./catalogue-state.service";

/**
 * @see CatalogueStateService
 */
describe("CatalogueStateService", () => {
  let service: CatalogueStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CatalogueStateService],
    });
    service = TestBed.inject(CatalogueStateService);
  });

  /**
   * @see CatalogueStateService#playlistTitleFilter
   */
  describe("playlistTitleFilter", () => {
    it("should trim whitespace", () => {
      service.playlistTitleFilter = "foo ";
      expect(service.playlistTitleFilter()).toBe("foo");
    });

    it("should normalise empty strings to undefined", () => {
      service.playlistTitleFilter = " ";
      expect(service.playlistTitleFilter()).toBe(undefined);
    });
  });

  /**
   * @see CatalogueStateService#playlistTitleFilter$
   */
  it("should provide an Observable for interop with Rxjs", (done: DoneFn) => {
    service.playlistTitleFilter$.subscribe((value: string | undefined) => {
      expect(value).toBe("foo");
      done();
    });

    service.playlistTitleFilter = "foo";
  });
});
