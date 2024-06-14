import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { KardexDetailType } from "src/types/apps/kardexDetailTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllKardexDetails = createAsyncThunk(
  "appKardexDetail/fetchAllKardexDetails",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/kardexDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllKardexDetailsError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchKardexDetail = createAsyncThunk(
  "appKardexDetail/fetchKardexDetail",
  async (idDetailKardex: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/kardexDetails/${idDetailKardex}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchKardexDetailError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addKardexDetail = createAsyncThunk(
  "appKardexDetail/addKardexDetail",
  async (data: KardexDetailType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/kardexDetails`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllKardexDetails());
        toast.success("Kardex detail added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding kardex detail");
        throw err;
      }
    }

    return null;
  }
);

export const updateKardexDetail = createAsyncThunk(
  'appKardexDetail/updateKardexDetail',
  async (data: KardexDetailType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idDetailKardex, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/kardexDetails/${idDetailKardex}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllKardexDetails());
        toast.success('Kardex detail updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating kardex detail');
        throw err;
      }
    }

    return null;
  }
);

export const deleteKardexDetail = createAsyncThunk(
  "appKardexDetail/deleteKardexDetail",
  async (idDetailKardex: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/kardexDetails/${idDetailKardex}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllKardexDetails());
        toast.success("Kardex detail deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting kardex detail");
        throw err;
      }
    }

    return null;
  }
);

export const appKardexDetailSlice = createSlice({
  name: "appKardexDetail",
  initialState: {
    kardexDetails: [] as KardexDetailType[],
    selectedKardexDetail: {} as KardexDetailType | null,
  },
  reducers: {
    handleSelectKardexDetail: (state, action) => {
      state.selectedKardexDetail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllKardexDetails.fulfilled, (state, action) => {
      state.kardexDetails = action.payload;
    });
    builder.addCase(fetchKardexDetail.fulfilled, (state, action) => {
      state.selectedKardexDetail = action.payload;
    });
  },
});

export const { handleSelectKardexDetail } = appKardexDetailSlice.actions;

export default appKardexDetailSlice.reducer;
