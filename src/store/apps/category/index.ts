import { Dispatch } from "redux";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { CategoryType } from "src/types/apps/categoryTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";
import { Console } from "console";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllCategories = createAsyncThunk(
  "appCategory/fetchAllCategories",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/categorias`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllCategoriesError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchCategory = createAsyncThunk(
  "appCategory/fetchCategory",
  async (idCategoria: number | string, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/categorias/${idCategoria}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchCategoryError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addCategory = createAsyncThunk(
  "appCategory/addCategory",
  async (data: CategoryType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/categorias`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllCategories());
        toast.success("Categoría añadida correctamente", { duration: 4000 });

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error al añadir una categoría", { duration: 4000 });
        throw err;
      }
    }

    return null;
  }
);

export const updateCategory = createAsyncThunk(
  'appCategory/updateCategory',
  async (data: CategoryType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idCategoria, ...updateData } = data;
        console.log("datra que se envi33a: " + JSON.stringify(updateData, null, 2));
        const response = await axios.patch(
          `${apiURL}/categorias/${idCategoria}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllCategories());
        toast.success('Categoría actualizada correctamente', { duration: 4000 });

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Categoría de actualización de errores', { duration: 4000 });
        throw err;
      }
    }

    return null;
  }
);

export const deleteCategory = createAsyncThunk(
  "appCategory/deleteCategory",
  async (idCategoria: number | string, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/categorias/${idCategoria}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllCategories());
        toast.success("Categoría eliminada correctamente", { duration: 4000 });

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error al borrar una categoría", { duration: 4000 });
        throw err;
      }
    }

    return null;
  }
);

export const appCategorySlice = createSlice({
  name: "appCategory",
  initialState: {
    categories: [] as CategoryType[],
    selectedCategory: {} as CategoryType | null,
  },
  reducers: {
    handleSelectCategory: (state, action: PayloadAction<number | string | null>) => {
      if (action.payload !== null) {
        state.selectedCategory = state.categories.find(
          (category) => category.idCategoria === action.payload
        ) || null;
      } else {
        state.selectedCategory = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllCategories.fulfilled, (state, action) => {
      state.categories = action.payload;
    });
    builder.addCase(fetchCategory.fulfilled, (state, action) => {
      state.selectedCategory = action.payload;
    });
  },
});

export const { handleSelectCategory } = appCategorySlice.actions;

export default appCategorySlice.reducer;
