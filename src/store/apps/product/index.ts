import { Dispatch } from "redux";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import { ProductType } from "src/types/apps/productTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllProducts = createAsyncThunk(
  "appProduct/fetchAllProducts",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/productos`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllProductsError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  "appProduct/fetchProduct",
  async (idProducto: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/productos/${idProducto}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchProductError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addProduct = createAsyncThunk(
  "appProduct/addProduct",
  async (data: ProductType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        console.log("data34:")
        console.log({ data })
        const productData = {
          nombre: "inka kola",
          precio: 23.78,
          categoria: { idCategoria: 1 }, // Asegúrate de que el ID exista en la tabla de categorías
          unidMedida: "paquete",
          estado: "Activo", // Debe ser "Activo" o "Desactivo"
        };
        const response = await axios.post(
          `${apiURL}/productos`,
          productData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllProducts());
        toast.success("Product added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding product");
        throw err;
      }
    }

    return null;
  }
);

export const updateProduct = createAsyncThunk(
  'appProduct/updateProduct',
  async (data: ProductType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idProducto, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/productos/${idProducto}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllProducts());
        toast.success('Product updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating product');
        throw err;
      }
    }

    return null;
  }
);

export const deleteProduct = createAsyncThunk(
  "appProduct/deleteProduct",
  async (idProducto: number | string, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/productos/${idProducto}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllProducts());
        toast.success("Product deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting product");
        throw err;
      }
    }

    return null;
  }
);

export const appProductSlice = createSlice({
  name: "appProduct",
  initialState: {
    products: [] as ProductType[],
    selectedProduct: {} as ProductType | null,
  },
  reducers: {
    handleSelectProduct: (state, action: PayloadAction<number | string | null>) => {
      if (action.payload !== null) {
        state.selectedProduct = state.products.find(
          (product) => product.idProducto === action.payload
        ) || null;
      } else {
        state.selectedProduct = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllProducts.fulfilled, (state, action) => {
      state.products = action.payload;
    });
    builder.addCase(fetchProduct.fulfilled, (state, action) => {
      state.selectedProduct = action.payload;
    });
  },
});

export const { handleSelectProduct } = appProductSlice.actions;

export default appProductSlice.reducer;
