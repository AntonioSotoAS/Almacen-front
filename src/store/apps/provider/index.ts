import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ProviderType } from "src/types/apps/providerTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllProviders = createAsyncThunk(
  "appProvider/fetchAllProviders",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/providers`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllProvidersError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchProvider = createAsyncThunk(
  "appProvider/fetchProvider",
  async (idProveedor: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/providers/${idProveedor}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchProviderError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addProvider = createAsyncThunk(
  "appProvider/addProvider",
  async (data: ProviderType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/providers`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllProviders());
        toast.success("Provider added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding provider");
        throw err;
      }
    }

    return null;
  }
);

export const updateProvider = createAsyncThunk(
  'appProvider/updateProvider',
  async (data: ProviderType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idProveedor, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/providers/${idProveedor}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllProviders());
        toast.success('Provider updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating provider');
        throw err;
      }
    }

    return null;
  }
);

export const deleteProvider = createAsyncThunk(
  "appProvider/deleteProvider",
  async (idProveedor: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/providers/${idProveedor}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllProviders());
        toast.success("Provider deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting provider");
        throw err;
      }
    }

    return null;
  }
);

export const appProviderSlice = createSlice({
  name: "appProvider",
  initialState: {
    providers: [] as ProviderType[],
    selectedProvider: {} as ProviderType | null,
  },
  reducers: {
    handleSelectProvider: (state, action) => {
      state.selectedProvider = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllProviders.fulfilled, (state, action) => {
      state.providers = action.payload;
    });
    builder.addCase(fetchProvider.fulfilled, (state, action) => {
      state.selectedProvider = action.payload;
    });
  },
});

export const { handleSelectProvider } = appProviderSlice.actions;

export default appProviderSlice.reducer;
