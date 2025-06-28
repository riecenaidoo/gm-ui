import { Environment } from "./environment.model";

/**
 * NOTE These are the same as the values in the `production` environment,
 *  because I have no production environment as yet.
 */
export const environment: Environment = {
  catalogueApiBaseUrl: "http://localhost:8080/api/v2",
  audioApiBaseUrl: "http://localhost:5050",
};
