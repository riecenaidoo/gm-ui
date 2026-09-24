import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { Injector, signal, Signal, WritableSignal } from "@angular/core";
import { debounced } from "./debounced"; // adjust path if needed

describe("debounced", () => {
  let injector: Injector;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    injector = TestBed.inject(Injector);
  });

  it("should not debounce initial value", () => {
    // Given
    const source: WritableSignal<number> = signal(0);
    const result: Signal<number> = debounced(source, 100, injector);
    // Then
    expect(result()).toBe(0);
  });

  it("should debounce updates", fakeAsync(() => {
    // Given
    const source: WritableSignal<number> = signal(0);
    const result: Signal<number> = debounced(source, 100, injector);
    // When
    source.set(1);
    tick(50);
    source.set(2);
    tick(50);
    // Then
    expect(result()).toBe(0); // timer to have reset
    tick(50);
    expect(result()).toBe(2); // time to have completed
  }));

  it("injector is optional in injection contexts", () => {
    // When
    const source: WritableSignal<number> = signal(5);
    const result: Signal<number> = TestBed.runInInjectionContext(() =>
      debounced(source, 100),
    );
    // Then
    expect(result()).toBe(5);
  });
});
