import { returns } from "@/lib/repositories";
import { item } from "@/lib/api";

export const { GET, PUT, DELETE } = item(returns);
