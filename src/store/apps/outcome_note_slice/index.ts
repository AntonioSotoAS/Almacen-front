import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { OutcomeNoteType } from "src/types/apps/outcomeNoteTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllOutcomeNotes = createAsyncThunk(
  "appOutcomeNote/fetchAllOutcomeNotes",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/outcomeNotes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllOutcomeNotesError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchOutcomeNote = createAsyncThunk(
  "appOutcomeNote/fetchOutcomeNote",
  async (idNotaSalida: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/outcomeNotes/${idNotaSalida}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchOutcomeNoteError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addOutcomeNote = createAsyncThunk(
  "appOutcomeNote/addOutcomeNote",
  async (data: OutcomeNoteType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/outcomeNotes`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllOutcomeNotes());
        toast.success("Outcome note added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding outcome note");
        throw err;
      }
    }

    return null;
  }
);

export const updateOutcomeNote = createAsyncThunk(
  'appOutcomeNote/updateOutcomeNote',
  async (data: OutcomeNoteType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idNotaSalida, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/outcomeNotes/${idNotaSalida}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllOutcomeNotes());
        toast.success('Outcome note updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating outcome note');
        throw err;
      }
    }

    return null;
  }
);

export const deleteOutcomeNote = createAsyncThunk(
  "appOutcomeNote/deleteOutcomeNote",
  async (idNotaSalida: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/outcomeNotes/${idNotaSalida}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllOutcomeNotes());
        toast.success("Outcome note deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting outcome note");
        throw err;
      }
    }

    return null;
  }
);

export const appOutcomeNoteSlice = createSlice({
  name: "appOutcomeNote",
  initialState: {
    outcomeNotes: [] as OutcomeNoteType[],
    selectedOutcomeNote: {} as OutcomeNoteType | null,
  },
  reducers: {
    handleSelectOutcomeNote: (state, action) => {
      state.selectedOutcomeNote = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllOutcomeNotes.fulfilled, (state, action) => {
      state.outcomeNotes = action.payload;
    });
    builder.addCase(fetchOutcomeNote.fulfilled, (state, action) => {
      state.selectedOutcomeNote = action.payload;
    });
  },
});

export const { handleSelectOutcomeNote } = appOutcomeNoteSlice.actions;

export default appOutcomeNoteSlice.reducer;
