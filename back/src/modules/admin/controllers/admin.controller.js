import { subirArchivoCloudinary } from "../../../shared/utils/cloudinaryUpload.js";

import {
  getUsersService,
  addUserRoleService,
  removeUserRoleService,
  blockUserService,
  unblockUserService,
  createUserService,
  getCategoriesService,
  getActiveCategoriesService,
  createCategoryService,
  updateCategoryService,
  disableCategoryService,
  enableCategoryService,
} from "../services/admin.service.js";

export const getUsers = async (req, res, next) => {
  try {
    const usuarios = await getUsersService();
    res.status(200).json({ ok: true, usuarios });
  } catch (error) { next(error); }
};

export const createUser = async (req, res, next) => {
  try {
    const usuario = await createUserService(req.body);
    res.status(201).json({ ok: true, usuario });
  } catch (error) { next(error); }
};

export const addUserRole = async (req, res, next) => {
  try {
    const usuario = await addUserRoleService(req.params.id, req.body.rol);
    res.status(200).json({ ok: true, usuario });
  } catch (error) { next(error); }
};

export const removeUserRole = async (req, res, next) => {
  try {
    const usuario = await removeUserRoleService(req.params.id, req.body.rol);
    res.status(200).json({ ok: true, usuario });
  } catch (error) { next(error); }
};

export const blockUser = async (req, res, next) => {
  try {
    const usuario = await blockUserService(req.params.id);
    res.status(200).json({ ok: true, usuario });
  } catch (error) { next(error); }
};

export const unblockUser = async (req, res, next) => {
  try {
    const usuario = await unblockUserService(req.params.id);
    res.status(200).json({ ok: true, usuario });
  } catch (error) { next(error); }
};

export const getCategories = async (req, res, next) => {
  try {
    const categorias = await getCategoriesService();
    res.status(200).json({ ok: true, categorias });
  } catch (error) { next(error); }
};

export const getActiveCategories = async (req, res, next) => {
  try {
    const categorias = await getActiveCategoriesService();
    res.status(200).json({ ok: true, categorias });
  } catch (error) { next(error); }
};

export const createCategory = async (req, res, next) => {
  try {
    let imagenUrl = null;
    if (req.file) {
      const resultado = await subirArchivoCloudinary(req.file, "urbanlog/categorias");
      imagenUrl = resultado.url;
    }
    const categoria = await createCategoryService(req.body.nombre, imagenUrl);
    res.status(201).json({ ok: true, categoria });
  } catch (error) { next(error); }
};

export const updateCategory = async (req, res, next) => {
  try {
    const categoria = await updateCategoryService(req.params.id, req.body.nombre);
    res.status(200).json({ ok: true, categoria });
  } catch (error) { next(error); }
};

export const disableCategory = async (req, res, next) => {
  try {
    const categoria = await disableCategoryService(req.params.id);
    res.status(200).json({ ok: true, categoria });
  } catch (error) { next(error); }
};

export const enableCategory = async (req, res, next) => {
  try {
    const categoria = await enableCategoryService(req.params.id);
    res.status(200).json({ ok: true, categoria });
  } catch (error) { next(error); }
};