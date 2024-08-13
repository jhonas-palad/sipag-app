import { WastePost } from "./maps";
export type User = {
  id: string | number;
  first_name?: string;
  last_name?: string;
  is_verified?: boolean;
  phone_number?: string;
  email?: string;
  photo?: {
    img_file: string;
    hash: string;
  };
};

export type UserPost = {
  user: User;
} & WastePost;
