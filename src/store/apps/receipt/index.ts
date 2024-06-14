import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ReceiptType } from "src/types/apps/receiptTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllReceipts = createAsyncThunk(
  "appReceipt/fetchAllReceipts",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/receipts`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllReceiptsError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchReceipt = createAsyncThunk(
  "appReceipt/fetchReceipt",
  async (idComprobante: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/receipts/${idComprobante}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchReceiptError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addReceipt = createAsyncThunk(
  "appReceipt/addReceipt",
  async (data: ReceiptType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/receipts`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllReceipts());
        toast.success("Receipt added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding receipt");
        throw err;
      }
    }

    return null;
  }
);

export const updateReceipt = createAsyncThunk(
  'appReceipt/updateReceipt',
  async (data: ReceiptType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idComprobante, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/receipts/${idComprobante}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllReceipts());
        toast.success('Receipt updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating receipt');
        throw err;
      }
    }

    return null;
  }
);

export const deleteReceipt = createAsyncThunk(
  "appReceipt/deleteReceipt",
  async (idComprobante: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/receipts/${idComprobante}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllReceipts());
        toast.success("Receipt deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting receipt");
        throw err;
      }
    }

    return null;
  }
);

export const appReceiptSlice = createSlice({
  name: "appReceipt",
  initialState: {
    receipts: [] as ReceiptType[],
    selectedReceipt: {} as ReceiptType | null,
  },
  reducers: {
    handleSelectReceipt: (state, action) => {
      state.selectedReceipt = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllReceipts.fulfilled, (state, action) => {
      state.receipts = action.payload;
    });
    builder.addCase(fetchReceipt.fulfilled, (state, action) => {
      state.selectedReceipt = action.payload;
    });
  },
});

export const { handleSelectReceipt } = appReceiptSlice.actions;

export default appReceiptSlice.reducer;
