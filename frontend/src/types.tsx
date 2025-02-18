export type LoginFormInputs = {
  email: string;
  password: string;
  rememberMe?: boolean;
};

export type RegisterFormInputs = {
  fullName: string;
  dob: string;
  gender: "male" | "female";
  occupation: "working" | "student";
  institution?: string;
  country: string;
  email: string;
  password: string;
};
