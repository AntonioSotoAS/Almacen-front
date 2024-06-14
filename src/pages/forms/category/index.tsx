import {
  useState,
  useEffect,
  MouseEvent,
  SetStateAction,
  Dispatch,
  ReactElement,
  Ref,
  forwardRef,
} from "react";

// ** Next Imports
import Link from "next/link";

// ** MUI Imports
import Card from "@mui/material/Card";
import Menu from "@mui/material/Menu";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import MenuItem from "@mui/material/MenuItem";
import IconButton, { IconButtonProps } from "@mui/material/IconButton";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

// ** Store Imports
import { useDispatch, useSelector } from "react-redux";

// ** Icon Imports
import Icon from "src/@core/components/icon";

// ** Types
import { RootState, AppDispatch } from "src/store";
import { CategoryType } from "src/types/apps/categoryTypes";

// ** Custom Table Components Imports
import TableHeader from 'src/views/components/tableHeader/TableHeader'
import {
  deleteCategory,
  fetchAllCategories,
  handleSelectCategory,
} from "src/store/apps/category";

// ** Sidebar
import CategoryDrawer from "src/views/category/CategoryDrawer";

import { styled } from '@mui/material/styles'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import { Box, Button, CircularProgress, Fade, FadeProps, Typography } from "@mui/material";

interface CellType {
  row: CategoryType;
}

interface RowOptionsProps {
  id: string | number;
  toggle: (arg?: string | number) => void;
}

const RowOptions: React.FC<RowOptionsProps> = ({ id, toggle }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const rowOptionsOpen = Boolean(anchorEl);

  const handleRowOptionsClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleRowOptionsClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deleteCategory(id));
    handleRowOptionsClose();
  };

  const handleEdit = () => {
    toggle(id);
    handleRowOptionsClose();
  };

  const [show, setShow] = useState<boolean>(false);

  const handleClose = () => {
    setShow(false);
  };

  return (
    <>
      <IconButton size="small" onClick={handleRowOptionsClick}>
        <Icon icon="tabler:dots-vertical" />
      </IconButton>
      <Menu
        keepMounted
        anchorEl={anchorEl}
        open={rowOptionsOpen}
        onClose={handleRowOptionsClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{ style: { minWidth: "8rem" } }}
      >
        <MenuItem onClick={handleEdit} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="tabler:edit" fontSize={20} />
          Editar
        </MenuItem>
        <MenuItem onClick={() => setShow(true)} sx={{ "& svg": { mr: 2 } }}>
          <Icon icon="tabler:trash" fontSize={20} />
          Eliminar
        </MenuItem>
      </Menu>

      <Dialog
        fullWidth
        open={show}
        maxWidth='sm'
        scroll='body'
        onClose={handleClose}
        onBackdropClick={handleClose}
        TransitionComponent={Transition}
        sx={{ '& .MuiDialog-paper': { overflow: 'visible' } }}
      >
        <DialogContent
          sx={{
            pb: theme => `${theme.spacing(8)} !important`,
            px: theme => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`
            ],
            pt: theme => [
              `${theme.spacing(8)} !important`,
              `${theme.spacing(12.5)} !important`
            ]
          }}
        >
          <CustomCloseButton onClick={handleClose}>
            <Icon icon='tabler:x' fontSize='1.25rem' />
          </CustomCloseButton>
          <Box sx={{ mb: 4, textAlign: 'center' }}>
            <Typography variant='h3' sx={{ mb: 3 }}>
              Eliminar Categoría
            </Typography>
            <Typography sx={{ color: 'text.secondary' }}>
              La categoría seleccionada será eliminada permanentemente
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: 'center',
            px: theme => [
              `${theme.spacing(5)} !important`,
              `${theme.spacing(15)} !important`
            ],
            pb: theme => [
              `${theme.spacing(8)} !important`,
              `${theme.spacing(12.5)} !important`
            ]
          }}
        >
          <Button variant='contained' sx={{ mr: 1 }} onClick={handleDelete}>
            Eliminar
          </Button>
          <Button variant='tonal' color='secondary' onClick={handleClose}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const CustomCloseButton = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  top: 0,
  right: 0,
  color: 'grey.500',
  position: 'absolute',
  boxShadow: theme.shadows[2],
  transform: 'translate(10px, -10px)',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: `${theme.palette.background.paper} !important`,
  transition: 'transform 0.25s ease-in-out, box-shadow 0.25s ease-in-out',
  '&:hover': {
    transform: 'translate(7px, -5px)'
  }
}));

const Transition = forwardRef(function Transition(
  props: FadeProps & { children?: ReactElement<any, any> },
  ref: Ref<unknown>
) {
  return <Fade ref={ref} {...props} />;
});

const Categories = () => {
  const columns: GridColDef[] = [
    {
      flex: 0.1,
      minWidth: 120,
      sortable: false,
      disableColumnMenu: true,
      field: "actions",
      type: "actions",
      headerName: "Acciones",
      renderCell: ({ row }: CellType) => (
        <RowOptions id={row.idCategoria ?? ""} toggle={toggleCategoryDrawer} />
      ),
    },
    {
      flex: 1,
      minWidth: 300,
      headerName: "Nombre",
      field: "nombre",
      disableColumnMenu: true,
      renderCell: ({ row }: CellType) => row.nombre || "N/A",
    },
  ];

  const [addCategoryOpen, setAddCategoryOpen] = useState<boolean>(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });

  const dispatch = useDispatch<AppDispatch>();
  const { categories } = useSelector((state: RootState) => state.category);
  const [loadingCategories, setLoadingCategories] = useState<boolean>(true);

  useEffect(() => {
    setLoadingCategories(true);

    dispatch(fetchAllCategories())
      .then(() => {
        setLoadingCategories(false);
      })
      .catch((error: any) => {
        console.error("Error fetching categories:", error);
        setLoadingCategories(false);
      });
  }, [dispatch]);

  const toggleCategoryDrawer = (id?: string | number) => {
    console.log("hay o no hay id7834:");
    console.log(id);
    if (id) {
      dispatch(handleSelectCategory(id));
    } else {
      dispatch(handleSelectCategory(null));
    }
    setAddCategoryOpen(!addCategoryOpen);
  };

  return (
    <Grid container spacing={6.5}>
      <Grid item xs={12}>
        <Card>
          <Divider sx={{ m: "0 !important" }} />
          <TableHeader
            toggle={() => toggleCategoryDrawer()}
            titleView="Registro de Categorías"
            textButton="Agregar Categoría"
          />
          <DataGrid
            autoHeight
            rowHeight={62}
            rows={categories}
            columns={columns}
            disableRowSelectionOnClick
            pageSizeOptions={[10, 25, 50]}
            paginationModel={paginationModel}
            onPaginationModelChange={setPaginationModel}
            getRowId={(row) => row.idCategoria}
            components={{
              NoRowsOverlay: () => (
                <Box
                  p={3}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  minHeight="100px"
                >
                  {loadingCategories ? (
                    <CircularProgress />
                  ) : (
                    <Typography variant="body1">No hay categorías</Typography>
                  )}
                </Box>
              )
            }}
          />
        </Card>
      </Grid>
      <CategoryDrawer
        open={addCategoryOpen}
        toggle={() => toggleCategoryDrawer()}
      />
    </Grid>
  );
};

Categories.acl = {
  subject: 'seller'
}

export default Categories;
