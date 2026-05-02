export interface QueryResponse {
  url: string;
  source: "native";
  selector: string | null;
  text: string | null;
  result: string[];
}
