import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { KardexType } from "src/types/apps/kardexTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllKardexes = createAsyncThunk(
  "appKardex/fetchAllKardexes",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/kardexes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllKardexesError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchKardex = createAsyncThunk(
  "appKardex/fetchKardex",
  async (idKardex: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/kardexes/${idKardex}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchKardexError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addKardex = createAsyncThunk(
  "appKardex/addKardex",
  async (data: KardexType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/kardexes`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllKardexes());
        toast.success("Kardex added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding kardex");
        throw err;
      }
    }

    return null;
  }
);

export const updateKardex = createAsyncThunk(
  'appKardex/updateKardex',
  async (data: KardexType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idKardex, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/kardexes/${idKardex}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllKardexes());
        toast.success('Kardex updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating kardex');
        throw err;
      }
    }

    return null;
  }
);

export const deleteKardex = createAsyncThunk(
  "appKardex/deleteKardex",
  async (idKardex: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/kardexes/${idKardex}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllKardexes());
        toast.success("Kardex deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting kardex");
        throw err;
      }
    }

    return null;
  }
);

export const appKardexSlice = createSlice({
  name: "appKardex",
  initialState: {
    kardexes: [] as KardexType[],
    selectedKardex: {} as KardexType | null,
  },
  reducers: {
    handleSelectKardex: (state, action) => {
      state.selectedKardex = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllKardexes.fulfilled, (state, action) => {
      state.kardexes = action.payload;
    });
    builder.addCase(fetchKardex.fulfilled, (state, action) => {
      state.selectedKardex = action.payload;
    });
  },
});

export const { handleSelectKardex } = appKardexSlice.actions;

export default appKardexSlice.reducer;
