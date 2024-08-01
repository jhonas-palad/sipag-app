import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { type SignupSchemaAllOptionalType } from "@/schemas/auth";

export type SignupFormState = SignupSchemaAllOptionalType;

export type SignupFormActions = {
  setFormState: (data: SignupSchemaAllOptionalType) => void;
  getFormState: () => SignupSchemaAllOptionalType;
  getFields: () => SignupSchemaAllOptionalType;
};

const initialDetails: SignupSchemaAllOptionalType = {
  email: "",
  phone_number: "",
  first_name: "",
  last_name: "",
  password: "",
  photo: null,
};

export const useSignupFormState = create<SignupFormState & SignupFormActions>()(
  immer((set, get) => ({
    ...initialDetails,
    setFormState(data: SignupFormState) {
      set({ ...data });
    },
    getFormState() {
      const user_details = get();
      return {
        ...user_details,
      };
    },
    getFields() {
      const { first_name, last_name, email, phone_number, photo } = get();
      return { first_name, last_name, email, phone_number, photo };
    },
  }))
);
