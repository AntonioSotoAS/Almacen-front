import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { UserType } from "src/types/apps/userTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllUsers = createAsyncThunk(
  "appUser/fetchAllUsers",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllUsersError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchUser = createAsyncThunk(
  "appUser/fetchUser",
  async (idUsuario: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/users/${idUsuario}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchUserError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addUser = createAsyncThunk(
  "appUser/addUser",
  async (data: UserType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/users`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllUsers());
        toast.success("User added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding user");
        throw err;
      }
    }

    return null;
  }
);

export const updateUser = createAsyncThunk(
  'appUser/updateUser',
  async (data: UserType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idUsuario, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/users/${idUsuario}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllUsers());
        toast.success('User updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating user');
        throw err;
      }
    }

    return null;
  }
);

export const deleteUser = createAsyncThunk(
  "appUser/deleteUser",
  async (idUsuario: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/users/${idUsuario}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllUsers());
        toast.success("User deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting user");
        throw err;
      }
    }

    return null;
  }
);

export const appUserSlice = createSlice({
  name: "appUser",
  initialState: {
    users: [] as UserType[],
    selectedUser: {} as UserType | null,
  },
  reducers: {
    handleSelectUser: (state, action) => {
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.selectedUser = action.payload;
    });
  },
});

export const { handleSelectUser } = appUserSlice.actions;

export default appUserSlice.reducer;
