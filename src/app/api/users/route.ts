import { users } from "@/lib/repositories";
import { readOnlyCollection } from "@/lib/api";

export const { GET } = readOnlyCollection(users);
