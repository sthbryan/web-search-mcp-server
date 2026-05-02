import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol";
import type {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types";
import type { FetchInput } from "../../schemas/fetch.js";
import { fetchHandler } from "./fetch.js";

export function createFetchHandler() {
  return async (
    args: FetchInput,
    _extra: RequestHandlerExtra<ServerRequest, ServerNotification>
  ): Promise<CallToolResult> => {
    try {
      const { url, type = "markdown" } = args;
      const result = await fetchHandler({ url, type });
      return {
        content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: JSON.stringify({ error: String(error) }) }],
        isError: true,
      };
    }
  };
}
