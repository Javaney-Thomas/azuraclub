// declare module "apollo-upload-client" {
//   import { ApolloLink } from "@apollo/client";
//   import { RequestTransformer } from "apollo-upload-client";

//   export function createUploadLink(options?: {
//     uri?: string;
//     fetch?: typeof fetch;
//     fetchOptions?: RequestInit;
//     credentials?: string;
//     headers?: Record<string, string>;
//     includeExtensions?: boolean;
//   }): ApolloLink;

//   export interface Upload {
//     file: File;
//   }

//   export const RequestTransformer: RequestTransformer;
// }
