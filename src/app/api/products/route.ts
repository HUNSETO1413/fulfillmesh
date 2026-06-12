import { products } from "@/lib/repositories";
import { collection } from "@/lib/api";

export const { GET, POST } = collection(products);
