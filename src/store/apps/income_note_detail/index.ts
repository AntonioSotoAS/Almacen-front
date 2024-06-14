import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IncomeNoteDetailType } from "src/types/apps/incomeNoteDetailTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllIncomeNoteDetails = createAsyncThunk(
  "appIncomeNoteDetail/fetchAllIncomeNoteDetails",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/incomeNoteDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllIncomeNoteDetailsError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchIncomeNoteDetail = createAsyncThunk(
  "appIncomeNoteDetail/fetchIncomeNoteDetail",
  async (idDetailNotIng: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/incomeNoteDetails/${idDetailNotIng}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchIncomeNoteDetailError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addIncomeNoteDetail = createAsyncThunk(
  "appIncomeNoteDetail/addIncomeNoteDetail",
  async (data: IncomeNoteDetailType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/incomeNoteDetails`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllIncomeNoteDetails());
        toast.success("Income note detail added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding income note detail");
        throw err;
      }
    }

    return null;
  }
);

export const updateIncomeNoteDetail = createAsyncThunk(
  'appIncomeNoteDetail/updateIncomeNoteDetail',
  async (data: IncomeNoteDetailType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idDetailNotIng, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/incomeNoteDetails/${idDetailNotIng}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllIncomeNoteDetails());
        toast.success('Income note detail updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating income note detail');
        throw err;
      }
    }

    return null;
  }
);

export const deleteIncomeNoteDetail = createAsyncThunk(
  "appIncomeNoteDetail/deleteIncomeNoteDetail",
  async (idDetailNotIng: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/incomeNoteDetails/${idDetailNotIng}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllIncomeNoteDetails());
        toast.success("Income note detail deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting income note detail");
        throw err;
      }
    }

    return null;
  }
);

export const appIncomeNoteDetailSlice = createSlice({
  name: "appIncomeNoteDetail",
  initialState: {
    incomeNoteDetails: [] as IncomeNoteDetailType[],
    selectedIncomeNoteDetail: {} as IncomeNoteDetailType | null,
  },
  reducers: {
    handleSelectIncomeNoteDetail: (state, action) => {
      state.selectedIncomeNoteDetail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllIncomeNoteDetails.fulfilled, (state, action) => {
      state.incomeNoteDetails = action.payload;
    });
    builder.addCase(fetchIncomeNoteDetail.fulfilled, (state, action) => {
      state.selectedIncomeNoteDetail = action.payload;
    });
  },
});

export const { handleSelectIncomeNoteDetail } = appIncomeNoteDetailSlice.actions;

export default appIncomeNoteDetailSlice.reducer;
