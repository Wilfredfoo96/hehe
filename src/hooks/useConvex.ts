import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// User hooks
export const useUserByUsername = (username: string | null) => {
  return useQuery(api.users.getUserByUsername, username ? { username } : "skip");
};

export const useAllUsers = () => {
  return useQuery(api.users.getAllUsers);
};

export const useUsersByCompany = (companyName: string | null) => {
  return useQuery(api.users.getUsersByCompany, companyName ? { companyName } : "skip");
};

export const useUsersByCompanyType = (companyType: string | null) => {
  return useQuery(api.users.getUsersByCompanyType, companyType ? { companyType } : "skip");
};

// Mutations
export const useUpsertUser = () => {
  return useMutation(api.users.upsertUser);
};
