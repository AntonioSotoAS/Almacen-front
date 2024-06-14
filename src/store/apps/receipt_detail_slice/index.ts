import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ReceiptDetailType } from "src/types/apps/receiptDetailTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllReceiptDetails = createAsyncThunk(
  "appReceiptDetail/fetchAllReceiptDetails",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/receiptDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllReceiptDetailsError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchReceiptDetail = createAsyncThunk(
  "appReceiptDetail/fetchReceiptDetail",
  async (idDetail: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/receiptDetails/${idDetail}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchReceiptDetailError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addReceiptDetail = createAsyncThunk(
  "appReceiptDetail/addReceiptDetail",
  async (data: ReceiptDetailType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/receiptDetails`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllReceiptDetails());
        toast.success("Receipt detail added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding receipt detail");
        throw err;
      }
    }

    return null;
  }
);

export const updateReceiptDetail = createAsyncThunk(
  'appReceiptDetail/updateReceiptDetail',
  async (data: ReceiptDetailType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idDetail, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/receiptDetails/${idDetail}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllReceiptDetails());
        toast.success('Receipt detail updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating receipt detail');
        throw err;
      }
    }

    return null;
  }
);

export const deleteReceiptDetail = createAsyncThunk(
  "appReceiptDetail/deleteReceiptDetail",
  async (idDetail: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/receiptDetails/${idDetail}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllReceiptDetails());
        toast.success("Receipt detail deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting receipt detail");
        throw err;
      }
    }

    return null;
  }
);

export const appReceiptDetailSlice = createSlice({
  name: "appReceiptDetail",
  initialState: {
    receiptDetails: [] as ReceiptDetailType[],
    selectedReceiptDetail: {} as ReceiptDetailType | null,
  },
  reducers: {
    handleSelectReceiptDetail: (state, action) => {
      state.selectedReceiptDetail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllReceiptDetails.fulfilled, (state, action) => {
      state.receiptDetails = action.payload;
    });
    builder.addCase(fetchReceiptDetail.fulfilled, (state, action) => {
      state.selectedReceiptDetail = action.payload;
    });
  },
});

export const { handleSelectReceiptDetail } = appReceiptDetailSlice.actions;

export default appReceiptDetailSlice.reducer;
