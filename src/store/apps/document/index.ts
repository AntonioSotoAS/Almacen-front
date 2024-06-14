import { Dispatch } from "redux";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { DocumentType } from "src/types/apps/documentTypes";
import authConfig from "src/configs/auth";
import toast from "react-hot-toast";

const apiURL = process.env.NEXT_PUBLIC_API_URL;

interface Redux {
  getState: any;
  dispatch: Dispatch<any>;
}

export const fetchAllDocuments = createAsyncThunk(
  "appDocument/fetchAllDocuments",
  async (_, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/documents`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchAllDocumentsError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const fetchDocument = createAsyncThunk(
  "appDocument/fetchDocument",
  async (idDocumento: number, thunkAPI) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    try {
      const response = await axios.get(`${apiURL}/documents/${idDocumento}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (error: any) {
      console.log({ fetchDocumentError: error });

      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const addDocument = createAsyncThunk(
  "appDocument/addDocument",
  async (data: DocumentType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.post(
          `${apiURL}/documents`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllDocuments());
        toast.success("Document added successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error adding document");
        throw err;
      }
    }

    return null;
  }
);

export const updateDocument = createAsyncThunk(
  'appDocument/updateDocument',
  async (data: DocumentType, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);

    if (token) {
      try {
        const { idDocumento, ...updateData } = data;
        const response = await axios.patch(
          `${apiURL}/documents/${idDocumento}`,
          updateData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        dispatch(fetchAllDocuments());
        toast.success('Document updated successfully');

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error('Error updating document');
        throw err;
      }
    }

    return null;
  }
);

export const deleteDocument = createAsyncThunk(
  "appDocument/deleteDocument",
  async (idDocumento: number, { dispatch }: Redux) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName);
    if (token) {
      try {
        const response = await axios.delete(`${apiURL}/documents/${idDocumento}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        dispatch(fetchAllDocuments());
        toast.success("Document deleted successfully");

        return response.data;
      } catch (err) {
        console.error(err);
        toast.error("Error deleting document");
        throw err;
      }
    }

    return null;
  }
);

export const appDocumentSlice = createSlice({
  name: "appDocument",
  initialState: {
    documents: [] as DocumentType[],
    selectedDocument: {} as DocumentType | null,
  },
  reducers: {
    handleSelectDocument: (state, action) => {
      state.selectedDocument = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllDocuments.fulfilled, (state, action) => {
      state.documents = action.payload;
    });
    builder.addCase(fetchDocument.fulfilled, (state, action) => {
      state.selectedDocument = action.payload;
    });
  },
});

export const { handleSelectDocument } = appDocumentSlice.actions;

export default appDocumentSlice.reducer;
