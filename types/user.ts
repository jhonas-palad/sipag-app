import { WastePost } from "./maps";
export type User = {
  id: string | number;
  firstName: string;
  lastName: string;
};

export type UserPost = {
  user: User;
} & WastePost;
