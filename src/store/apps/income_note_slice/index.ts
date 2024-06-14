import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { IncomeNoteType } from "src/types/apps/incomeNoteTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllIncomeNotes = createAsyncThunk(
  "appIncomeNote/fetchAllIncomeNotes",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/incomeNotes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllIncomeNotesError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchIncomeNote = createAsyncThunk(
  "appIncomeNote/fetchIncomeNote",
  async (idNotaIngreso: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/incomeNotes/${idNotaIngreso}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchIncomeNoteError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addIncomeNote = createAsyncThunk(
  "appIncomeNote/addIncomeNote",
  async (data: IncomeNoteType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/incomeNotes`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllIncomeNotes());
        toast.success("Income note added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding income note");
        throw err;
      }
    }

    return null;
  }
);

export const updateIncomeNote = createAsyncThunk(
  'appIncomeNote/updateIncomeNote',
  async (data: IncomeNoteType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idNotaIngreso, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/incomeNotes/${idNotaIngreso}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllIncomeNotes());
        toast.success('Income note updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating income note');
        throw err;
      }
    }

    return null;
  }
);

export const deleteIncomeNote = createAsyncThunk(
  "appIncomeNote/deleteIncomeNote",
  async (idNotaIngreso: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/incomeNotes/${idNotaIngreso}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllIncomeNotes());
        toast.success("Income note deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting income note");
        throw err;
      }
    }

    return null;
  }
);

export const appIncomeNoteSlice = createSlice({
  name: "appIncomeNote",
  initialState: {
    incomeNotes: [] as IncomeNoteType[],
    selectedIncomeNote: {} as IncomeNoteType | null,
  },
  reducers: {
    handleSelectIncomeNote: (state, action) => {
      state.selectedIncomeNote = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllIncomeNotes.fulfilled, (state, action) => {
      state.incomeNotes = action.payload;
    });
    builder.addCase(fetchIncomeNote.fulfilled, (state, action) => {
      state.selectedIncomeNote = action.payload;
    });
  },
});

export const { handleSelectIncomeNote } = appIncomeNoteSlice.actions;

export default appIncomeNoteSlice.reducer;
