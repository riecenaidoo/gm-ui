import { computed, inject, Injectable, Signal } from "@angular/core";
import { Channel } from "../models/channel";
import { Server } from "../models/server";
import { AudioApiService } from "./audio-api.service";
import { AudioService } from "../models/audio-service";
import {
  catchError,
  combineLatest,
  map,
  Observable,
  of,
  share,
  startWith,
  Subject,
  switchMap,
} from "rxjs";
import { HttpErrorResponse } from "@angular/common/http";
import { toSignal } from "@angular/core/rxjs-interop";
import { ServerAudio } from "../models/server-audio";

/**
 * The capabilities for the Discord Audio Bot.
 */
export interface AudioBot {
  /**
   * The {@link AudioBot}, if it is available.
   *
   * @see reconnect.
   */
  audioBot: Signal<AudioService | undefined>;

  /**
   * If the {@link AudioBot} is offline, or was not available when the application was launched,
   * attempt to reconnect to it.
   *
   * @see online
   */
  reconnect(): void;

  /**
   * Whether the {@link AudioBot} is online and ready for commands.
   *
   * @see reconnect
   */
  online: Signal<boolean>;

  /**
   * The available {@link Server} list for the {@link AudioBot}, if it is {@link online}.
   */
  servers: Signal<Server[] | undefined>;

  /**
   * Target a {@link Server} for further actioning.
   *
   * @see servers
   */
  selectServer(server: Server | undefined): void;

  /**
   * The {@link Server} the actions for the {@link AudioBot} will target.
   *
   * @see selectServer
   */
  selectedServer: Signal<Server | undefined>;

  /**
   * The available {@link Channel} list of the {@link selectedServer}.
   */
  channels: Signal<Channel[] | undefined>;

  /**
   * Connect the {@link AudioBot} to a {@link Channel} in the {@link selectedServer} to serve audio.
   *
   * @see channels
   */
  connect(channel: Channel | undefined): void;

  /**
   * The {@link ServerAudio} of the {@link selectedServer}, if present.
   *
   * @see connect
   */
  serverAudio: Signal<ServerAudio | undefined>;

  /**
   * The {@link Channel} of the {@link selectedServer} the {@link AudioBot} is connected to.
   *
   * @remarks A {@link Server} can only support one instance of the {@link AudioBot} in a {@link Channel},
   * but the {@link AudioBot} can be joined to multiple channels across different servers.
   *
   * @see connect
   */
  connectedChannel: Signal<Channel | undefined>;
}

@Injectable({
  providedIn: "root",
})
export class AudioStateService implements AudioBot {
  // ==========================================================================
  // Dependencies
  // ==========================================================================

  readonly #api: AudioApiService = inject(AudioApiService);

  // ==========================================================================
  // Internal State
  // ==========================================================================

  readonly #reconnect: Subject<void> = new Subject<void>();

  readonly #selectServer: Subject<Server | undefined> = new Subject<
    Server | undefined
  >();

  readonly #connect: Subject<Channel | undefined> = new Subject<
    Channel | undefined
  >();

  // ==========================================================================
  // External State
  // ==========================================================================

  readonly #audioBot: Observable<AudioService | undefined> =
    this.#reconnect.pipe(
      startWith(undefined),
      switchMap(() =>
        this.#api
          .getAudioService()
          .pipe(catchError((_: HttpErrorResponse) => of(undefined))),
      ),
      share(),
    );

  readonly #servers: Observable<Server[] | undefined> = this.#audioBot.pipe(
    switchMap((bot: AudioService | undefined) =>
      bot == undefined ? of(undefined) : this.#api.findServers(),
    ),
    share(),
  );

  readonly #channels: Observable<Channel[] | undefined> =
    this.#selectServer.pipe(
      switchMap((server: Server | undefined) =>
        server == undefined ? of(undefined) : this.#api.getChannels(server),
      ),
      share(),
    );

  readonly #connected: Observable<void> = this.#connect.pipe(
    map((channel: Channel | undefined): [Server, Channel | undefined] => {
      const server: Server | undefined = this.selectedServer();
      if (server == undefined) {
        throw new Error(
          "Connecting/Disconnecting to ServerAudio requires a Server to be Selected.",
        );
      }
      return [server, channel];
    }),
    switchMap((connectAction: [Server, Channel | undefined]) => {
      const server = connectAction[0];
      const channel = connectAction[1];
      return channel == undefined
        ? this.#api.deleteServerAudio(server)
        : this.#api.createServerAudio(server, channel);
    }),
    share(),
  );

  /**
   * @remarks TODO gm-discord. When the endpoint is actually asynchronous and returns the ServerAudio instance,
   *           we will be able to {@link combineLatest} by either grabbing the returned ServerAudio, or sending a request
   *           if the server changed.
   */
  readonly #serverAudio: Observable<ServerAudio | undefined> = combineLatest([
    this.#selectServer,
    this.#connected.pipe(startWith<void>(undefined)),
  ]).pipe(
    map(
      ([server, _connected]: [Server | undefined, void]): Server | undefined =>
        server,
    ),
    switchMap((server: Server | undefined) =>
      server == undefined
        ? of(undefined)
        : this.#api.getServerAudio(server).pipe(
            catchError((error: HttpErrorResponse) => {
              if (error.status === 404) {
                return of(undefined);
              }
              throw error;
            }),
          ),
    ),
    share(),
  );

  // ==========================================================================
  // Derived State
  // ==========================================================================

  // noinspection JSUnusedGlobalSymbols // false positive on equal key
  /**
   * @remarks Consecutive `undefined` values are expected for this, as it is the reconnection mechanism so we override
   * the equality mechanism.
   */
  public readonly audioBot: Signal<AudioService | undefined> = toSignal(
    this.#audioBot,
    { equal: () => false },
  );

  public readonly online: Signal<boolean> = computed(
    () => this.audioBot()?.online ?? false,
  );

  public readonly servers: Signal<Server[] | undefined> = toSignal(
    this.#servers,
  );

  public readonly selectedServer: Signal<Server | undefined> = toSignal(
    this.#selectServer,
  );

  public readonly serverAudio: Signal<ServerAudio | undefined> = toSignal(
    this.#serverAudio,
  );

  public readonly channels: Signal<Channel[] | undefined> = toSignal(
    this.#channels,
  );

  public readonly connectedChannel: Signal<Channel | undefined> = computed(
    () => this.serverAudio()?.channel ?? undefined,
  );

  // ==========================================================================
  // API
  // ==========================================================================

  public reconnect(): void {
    this.#reconnect.next(undefined);
  }

  /**
   * @remarks In the normal flow of the application, these error scenarios should not occur. The guards and error
   * messages are meant for catching breaking changes during development.
   */
  public selectServer(server: Server | undefined): void {
    if (server == undefined) {
      this.#selectServer.next(undefined);
      return;
    }

    const servers: Server[] | undefined = this.servers();
    if (servers == undefined) {
      throw Error("There are currently no available Servers to join.");
    }
    if (!servers.includes(server)) {
      throw Error(`Cannot select a Server that is not part of the list of available Servers.
      
      Desired Server:       ${server.name}
      Available Server(s):  [${servers.map((server) => server.name).join(",")}]
      `);
    }

    this.#selectServer.next(server);
  }

  /**
   * @remarks In the normal flow of the application, these error scenarios should not occur. The guards and error
   * messages are meant for catching breaking changes during development.
   */
  public connect(channel: Channel | undefined): void {
    if (channel == undefined) {
      this.#connect.next(undefined);
      return;
    }

    const channels: Channel[] | undefined = this.channels();
    if (channels == undefined) {
      throw Error("There are currently no available Channels to join.");
    }
    if (!channels.includes(channel)) {
      throw Error(`Cannot select a Channel that is not part of the list of available Channels.
      
      Desired Channel:       ${channel.name}
      Available Channel(s):  [${channels.map((channel) => channel.name).join(",")}]
      `);
    }

    this.#connect.next(channel);
  }
}
