import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { OutcomeNoteDetailType } from "src/types/apps/outcomeNoteDetailTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllOutcomeNoteDetails = createAsyncThunk(
  "appOutcomeNoteDetail/fetchAllOutcomeNoteDetails",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/outcomeNoteDetails`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllOutcomeNoteDetailsError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchOutcomeNoteDetail = createAsyncThunk(
  "appOutcomeNoteDetail/fetchOutcomeNoteDetail",
  async (idDetailNotSal: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/outcomeNoteDetails/${idDetailNotSal}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchOutcomeNoteDetailError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addOutcomeNoteDetail = createAsyncThunk(
  "appOutcomeNoteDetail/addOutcomeNoteDetail",
  async (data: OutcomeNoteDetailType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/outcomeNoteDetails`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllOutcomeNoteDetails());
        toast.success("Outcome note detail added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding outcome note detail");
        throw err;
      }
    }

    return null;
  }
);

export const updateOutcomeNoteDetail = createAsyncThunk(
  'appOutcomeNoteDetail/updateOutcomeNoteDetail',
  async (data: OutcomeNoteDetailType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idDetailNotSal, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/outcomeNoteDetails/${idDetailNotSal}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllOutcomeNoteDetails());
        toast.success('Outcome note detail updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating outcome note detail');
        throw err;
      }
    }

    return null;
  }
);

export const deleteOutcomeNoteDetail = createAsyncThunk(
  "appOutcomeNoteDetail/deleteOutcomeNoteDetail",
  async (idDetailNotSal: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/outcomeNoteDetails/${idDetailNotSal}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllOutcomeNoteDetails());
        toast.success("Outcome note detail deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting outcome note detail");
        throw err;
      }
    }

    return null;
  }
);

export const appOutcomeNoteDetailSlice = createSlice({
  name: "appOutcomeNoteDetail",
  initialState: {
    outcomeNoteDetails: [] as OutcomeNoteDetailType[],
    selectedOutcomeNoteDetail: {} as OutcomeNoteDetailType | null,
  },
  reducers: {
    handleSelectOutcomeNoteDetail: (state, action) => {
      state.selectedOutcomeNoteDetail = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllOutcomeNoteDetails.fulfilled, (state, action) => {
      state.outcomeNoteDetails = action.payload;
    });
    builder.addCase(fetchOutcomeNoteDetail.fulfilled, (state, action) => {
      state.selectedOutcomeNoteDetail = action.payload;
    });
  },
});

export const { handleSelectOutcomeNoteDetail } = appOutcomeNoteDetailSlice.actions;

export default appOutcomeNoteDetailSlice.reducer;
