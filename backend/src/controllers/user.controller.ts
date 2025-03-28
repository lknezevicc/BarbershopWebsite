import { Request, Response, NextFunction } from "express";
import * as UserService from "../services/user.service";
import { formatResponse } from "../utils/responseFormatter";

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await UserService.getAllUsers();
    res.status(200).json(formatResponse(true, users));
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await UserService.getUserById(id);

    if (!user) {
      res.status(404).json(formatResponse(false, null, "User not found"));
      return;
    }

    res.status(200).json(formatResponse(true, user));
  } catch (error) {
    next(error);
  }
};

export const addUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await UserService.createUser(req.body);
    res.status(201).json(formatResponse(true, user, "User added successfully"));
  } catch (error) {
    next(error);
  }
};

export const editUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedUser = await UserService.updateUser(id, req.body);

    if (!updatedUser) {
      res.status(404).json(formatResponse(false, null, "User not found"));
      return;
    }

    res.status(200).json(formatResponse(true, updatedUser, "User updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const deletedUser = await UserService.deleteUserById(id);

    if (!deletedUser) {
      res.status(404).json(formatResponse(false, null, "User not found"));
      return;
    }

    res.status(200).json(formatResponse(true, null, "User deleted successfully"));
  } catch (error) {
    next(error);
  }
};

export const changeRole = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const user = await UserService.updateUserRole(id, role);

    if (!user) {
      res.status(404).json(formatResponse(false, null, "User not found"));
      return;
    }

    res.status(200).json(formatResponse(true, user, "User role updated successfully"));
  } catch (error) {
    next(error);
  }
};

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    await UserService.changeUserPassword(id, currentPassword, newPassword);
    
    res.status(200).json(formatResponse(true, null, "Password changed successfully"));
  } catch (error) {
    next(error);
  }
};