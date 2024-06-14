import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { PersonType } from "src/types/apps/personTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllPersons = createAsyncThunk(
  "appPerson/fetchAllPersons",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/persons`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllPersonsError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchPerson = createAsyncThunk(
  "appPerson/fetchPerson",
  async (idPersona: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/persons/${idPersona}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchPersonError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addPerson = createAsyncThunk(
  "appPerson/addPerson",
  async (data: PersonType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/persons`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllPersons());
        toast.success("Person added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding person");
        throw err;
      }
    }

    return null;
  }
);

export const updatePerson = createAsyncThunk(
  'appPerson/updatePerson',
  async (data: PersonType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idPersona, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/persons/${idPersona}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllPersons());
        toast.success('Person updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating person');
        throw err;
      }
    }

    return null;
  }
);

export const deletePerson = createAsyncThunk(
  "appPerson/deletePerson",
  async (idPersona: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/persons/${idPersona}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllPersons());
        toast.success("Person deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting person");
        throw err;
      }
    }

    return null;
  }
);

export const appPersonSlice = createSlice({
  name: "appPerson",
  initialState: {
    persons: [] as PersonType[],
    selectedPerson: {} as PersonType | null,
  },
  reducers: {
    handleSelectPerson: (state, action) => {
      state.selectedPerson = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllPersons.fulfilled, (state, action) => {
      state.persons = action.payload;
    });
    builder.addCase(fetchPerson.fulfilled, (state, action) => {
      state.selectedPerson = action.payload;
    });
  },
});

export const { handleSelectPerson } = appPersonSlice.actions;

export default appPersonSlice.reducer;
