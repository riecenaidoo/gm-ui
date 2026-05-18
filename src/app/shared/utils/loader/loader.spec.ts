import { Loader } from "./loader";
import { Subject, throwError } from "rxjs";

describe("Loader", () => {
  let loader: Loader;

  beforeEach(() => {
    loader = new Loader();
  });

  it("should not be loading initially", () => {
    expect(loader.isLoading()).toBeFalse();
  });

  it("should be loading while the tracked observable is active", () => {
    const subject = new Subject<number>();

    subject.pipe(loader.track()).subscribe();
    expect(loader.isLoading()).toBeTrue();

    subject.complete();
    expect(loader.isLoading()).toBeFalse();
  });

  it("should be loading while at-least one tracked observable is still active", () => {
    const s1 = new Subject<void>();
    const s2 = new Subject<void>();

    s1.pipe(loader.track()).subscribe();
    s2.pipe(loader.track()).subscribe();

    expect(loader.isLoading()).toBeTrue();
    s1.complete();

    expect(loader.isLoading()).toBeTrue();
    s2.complete();

    expect(loader.isLoading()).toBeFalse();
  });

  it("should not be loading if the tracked observable errors out", () => {
    throwError(() => new Error("test"))
      .pipe(loader.track())
      .subscribe({
        error: () => {
          //no-op
        },
      });

    expect(loader.isLoading()).toBeFalse();
  });

  it("should not be loading if the tracked observable is unsubscribed (not longer active)", () => {
    const subject = new Subject<void>();

    const sub = subject.pipe(loader.track()).subscribe();
    expect(loader.isLoading()).toBeTrue();

    sub.unsubscribe();
    expect(loader.isLoading()).toBeFalse();
  });
});
