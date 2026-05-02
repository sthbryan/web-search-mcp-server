import type { RequestHandlerExtra } from "@modelcontextprotocol/sdk/shared/protocol";
import type {
  CallToolResult,
  ServerNotification,
  ServerRequest,
} from "@modelcontextprotocol/sdk/types";
import type { QueryInput } from "../../schemas/query.js";
import { queryHandler } from "./query.js";

export function createQueryHandler() {
  return async (
    args: QueryInput,
    _extra: RequestHandlerExtra<ServerRequest, ServerNotification>
  ): Promise<CallToolResult> => {
    try {
      const { url, selector, text } = args;
      const result = await queryHandler({ url, selector, text });
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
