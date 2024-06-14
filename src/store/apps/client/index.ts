import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { ClientType } from "src/types/apps/clientTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllClients = createAsyncThunk(
  "appClient/fetchAllClients",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/clients`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllClientsError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchClient = createAsyncThunk(
  "appClient/fetchClient",
  async (idCliente: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/clients/${idCliente}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchClientError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addClient = createAsyncThunk(
  "appClient/addClient",
  async (data: ClientType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/clients`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllClients());
        toast.success("Client added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding client");
        throw err;
      }
    }

    return null;
  }
);

export const updateClient = createAsyncThunk(
  'appClient/updateClient',
  async (data: ClientType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idCliente, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/clients/${idCliente}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllClients());
        toast.success('Client updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating client');
        throw err;
      }
    }

    return null;
  }
);

export const deleteClient = createAsyncThunk(
  "appClient/deleteClient",
  async (idCliente: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/clients/${idCliente}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllClients());
        toast.success("Client deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting client");
        throw err;
      }
    }

    return null;
  }
);

export const appClientSlice = createSlice({
  name: "appClient",
  initialState: {
    clients: [] as ClientType[],
    selectedClient: {} as ClientType | null,
  },
  reducers: {
    handleSelectClient: (state, action) => {
      state.selectedClient = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllClients.fulfilled, (state, action) => {
      state.clients = action.payload;
    });
    builder.addCase(fetchClient.fulfilled, (state, action) => {
      state.selectedClient = action.payload;
    });
  },
});

export const { handleSelectClient } = appClientSlice.actions;

export default appClientSlice.reducer;
