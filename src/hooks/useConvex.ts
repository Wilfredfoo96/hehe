import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// User hooks
export const useUserByUsername = (username: string | null) => {
  return useQuery(api.users.getUserByUsername, username ? { username } : "skip");
};

export const useUserByEmail = (email: string | null) => {
  return useQuery(api.users.getUserByEmail, email ? { email } : "skip");
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

// Video hooks
export const useAllVideos = () => {
  return useQuery(api.videos.getAllVideos, {});
};

export const useVideosByCreator = (creatorId: string | null) => {
  return useQuery(api.videos.getVideosByCreator, creatorId ? { creatorId: creatorId as any } : "skip");
};

export const useTrendingVideos = () => {
  return useQuery(api.videos.getTrendingVideos, {});
};

export const useVideoById = (videoId: string | null) => {
  return useQuery(api.videos.getVideoById, videoId ? { videoId: videoId as any } : "skip");
};

// User mutations
export const useUpsertUser = () => {
  return useMutation(api.users.upsertUser);
};

// Video mutations
export const useCreateVideo = () => {
  return useMutation(api.videos.createVideo);
};

export const useUpdateVideoMetrics = () => {
  return useMutation(api.videos.updateVideoMetrics);
};

export const useIncrementVideoViews = () => {
  return useMutation(api.videos.incrementVideoViews);
};

export const useDeleteVideo = () => {
  return useMutation(api.videos.deleteVideo);
};
