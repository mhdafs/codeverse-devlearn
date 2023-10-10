import { adminAxiosInstance } from "../axios";

//? ============================================= Authorization =============================================

export const adminLogin = (values) => {
  return adminAxiosInstance.post("/signin", values);
};

export const getAdmin = () => {
  return adminAxiosInstance.get("/get-admin");
};

//? ============================================== Dashboard ==============================================

export const listDashboard = () => {
  return adminAxiosInstance.get("/list-dashboard");
};

//? ============================================== User Manage ==============================================

export const listUser = () => {
  return adminAxiosInstance.get("/list-user");
};

export const blockUser = (userId) => {
  return adminAxiosInstance.post(`/block-user/${userId}`);
};

export const unblockUser = (userId) => {
  return adminAxiosInstance.post(`/unblock-user/${userId}`);
};

//? ============================================= Banner Manage =============================================

export const listBanner = () => {
  return adminAxiosInstance.get("/list-Banner");
};

export const insertBanner = (values) => {
  return adminAxiosInstance.post("/insert-Banner", values);
};

export const editBanner = (bannerId, values) => {
  return adminAxiosInstance.post(`/edit-Banner/${bannerId}`, values);
};

export const bannerStatus = (bannerId, status) => {
  return adminAxiosInstance.post(`/banner-status/${bannerId}`, { status });
};

export const deleteBanner = (bannerId) => {
  return adminAxiosInstance.delete(`/delete-Banner/${bannerId}`);
};

//? ============================================= Service Manage =============================================

export const listService = () => {
  return adminAxiosInstance.get("/list-service");
};

export const insertService = (values) => {
  return adminAxiosInstance.post("/insert-service", values);
};

export const editService = (serviceId, values) => {
  return adminAxiosInstance.post(`/edit-service/${serviceId}`, values);
};

export const serviceStatus = (serviceId, status) => {
  return adminAxiosInstance.post(`/service-status/${serviceId}`, { status });
};

export const deleteService = (serviceId) => {
  return adminAxiosInstance.delete(`/delete-service/${serviceId}`);
};

//? ============================================= Project Manage =============================================

export const listProject = () => {
  return adminAxiosInstance.get("/list-project");
};

export const insertProject = (values) => {
  return adminAxiosInstance.post("/insert-project", values);
};

export const editProject = (projectId, values) => {
  return adminAxiosInstance.post(`/edit-project/${projectId}`, values);
};

export const projectStatus = (projectId, status) => {
  return adminAxiosInstance.post(`/project-status/${projectId}`, { status });
};

export const deleteProject = (projectId) => {
  return adminAxiosInstance.delete(`/delete-project/${projectId}`);
};

//? ============================================= Course Manage =============================================

export const listCourse = () => {
  return adminAxiosInstance.get("/list-course");
};

export const insertCourse = (values) => {
  return adminAxiosInstance.post("/insert-course", values);
};

export const editCourse = (courseId, values) => {
  return adminAxiosInstance.delete(`/edit-course/${courseId}`, values);
};

export const deleteCourse = (courseId) => {
  return adminAxiosInstance.delete(`/delete-course/${courseId}`);
};

//? =============================================== Settings ===============================================

export const updateAbout = (adminId, values) => {
  return adminAxiosInstance.put(`/update-about/${adminId}`, values);
};
