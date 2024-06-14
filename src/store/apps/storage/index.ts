import { Dispatch } from "redux";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { StorageType } from "src/types/apps/storageTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllStorages = createAsyncThunk(
  "appStorage/fetchAllStorages",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/almacenes`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllStoragesError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchStorage = createAsyncThunk(
  "appStorage/fetchStorage",
  async (idAlmacen: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/almacenes/${idAlmacen}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchStorageError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addStorage = createAsyncThunk(
  "appStorage/addStorage",
  async (data: StorageType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/almacenes`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllStorages());
        toast.success("Almacenamiento añadido correctamente", { duration: 4000 });

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error al añadir almacenamiento", { duration: 4000 });
        throw err;
      }
    }

    return null;
  }
);

export const updateStorage = createAsyncThunk(
  'appStorage/updateStorage',
  async (data: StorageType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idAlmacen, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/almacenes/${idAlmacen}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllStorages());
        toast.success('Almacenamiento actualizado correctamente', { duration: 4000 });

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error al actualizar el almacenamiento', { duration: 4000 });
        throw err;
      }
    }

    return null;
  }
);

export const deleteStorage = createAsyncThunk(
  "appStorage/deleteStorage",
  async (idAlmacen: number | string, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/almacenes/${idAlmacen}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllStorages());
        toast.success("Almacenamiento eliminado correctamente", { duration: 4000 });

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error al borrar el almacenamiento", { duration: 4000 });
        throw err;
      }
    }

    return null;
  }
);

export const appStorageSlice = createSlice({
  name: "appStorage",
  initialState: {
    storages: [] as StorageType[],
    selectedStorage: {} as StorageType | null,
  },
  reducers: {
    handleSelectStorage: (state, action: PayloadAction<number | string | null>) => {
      if (action.payload !== null) {
        state.selectedStorage = state.storages.find(
          (storage) => storage.idAlmacen === action.payload
        ) || null;
      } else {
        state.selectedStorage = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllStorages.fulfilled, (state, action) => {
      state.storages = action.payload;
    });
    builder.addCase(fetchStorage.fulfilled, (state, action) => {
      state.selectedStorage = action.payload;
    });
  },
});

export const { handleSelectStorage } = appStorageSlice.actions;

export default appStorageSlice.reducer;
