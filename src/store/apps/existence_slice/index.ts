import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ExistenceType } from "src/types/apps/existenceTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllExistences = createAsyncThunk(
  "appExistence/fetchAllExistences",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/existences`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllExistencesError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchExistence = createAsyncThunk(
  "appExistence/fetchExistence",
  async (idExistencia: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/existences/${idExistencia}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchExistenceError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addExistence = createAsyncThunk(
  "appExistence/addExistence",
  async (data: ExistenceType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/existences`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllExistences());
        toast.success("Existence added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding existence");
        throw err;
      }
    }

    return null;
  }
);

export const updateExistence = createAsyncThunk(
  'appExistence/updateExistence',
  async (data: ExistenceType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idExistencia, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/existences/${idExistencia}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllExistences());
        toast.success('Existence updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating existence');
        throw err;
      }
    }

    return null;
  }
);

export const deleteExistence = createAsyncThunk(
  "appExistence/deleteExistence",
  async (idExistencia: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/existences/${idExistencia}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllExistences());
        toast.success("Existence deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting existence");
        throw err;
      }
    }

    return null;
  }
);

export const appExistenceSlice = createSlice({
  name: "appExistence",
  initialState: {
    existences: [] as ExistenceType[],
    selectedExistence: {} as ExistenceType | null,
  },
  reducers: {
    handleSelectExistence: (state, action) => {
      state.selectedExistence = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllExistences.fulfilled, (state, action) => {
      state.existences = action.payload;
    });
    builder.addCase(fetchExistence.fulfilled, (state, action) => {
      state.selectedExistence = action.payload;
    });
  },
});

export const { handleSelectExistence } = appExistenceSlice.actions;

export default appExistenceSlice.reducer;
