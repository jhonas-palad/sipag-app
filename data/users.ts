import { User, UserPost } from "@/types/user";
import { wastePosts } from "./waste-posts";
import { findItem } from "@/utils/array";
import { WastePost } from "@/types/maps";

export const users: User[] = [
  { id: 1, firstName: "John", lastName: "Smith" },
  { id: 2, firstName: "Emily", lastName: "Johnson" },
  { id: 3, firstName: "Michael", lastName: "Davis" },
  { id: 4, firstName: "Sarah", lastName: "Brown" },
  { id: 5, firstName: "David", lastName: "Wilson" },
];

export const userPosts: UserPost[] = [
  {
    user: findItem(users, 1)!,
    ...findItem(wastePosts, 1)!,
  },
  {
    user: findItem(users, 1)!,
    ...findItem(wastePosts, 2)!,
  },
  {
    user: findItem(users, 2)!,
    ...findItem(wastePosts, 3)!,
  },
  {
    user: findItem(users, 2)!,
    ...findItem(wastePosts, 4)!,
  },
  {
    user: findItem(users, 3)!,
    ...findItem(wastePosts, 5)!,
  },
  {
    user: findItem(users, 3)!,
    ...findItem(wastePosts, 6)!,
  },
  {
    user: findItem(users, 5)!,
    ...findItem(wastePosts, 7)!,
  },
  {
    user: findItem(users, 3)!,
    ...findItem(wastePosts, 8)!,
  },
  {
    user: findItem(users, 4)!,
    ...findItem(wastePosts, 10)!,
  },
  {
    user: findItem(users, 4)!,
    ...findItem(wastePosts, 9)!,
  },
];
console.log(userPosts);
