import { transfers } from "@/lib/repositories";
import { collection } from "@/lib/api";

export const { GET, POST } = collection(transfers);
