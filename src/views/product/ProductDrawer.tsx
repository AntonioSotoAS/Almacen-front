import { useEffect } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Box, { BoxProps } from '@mui/material/Box';
import CustomTextField from 'src/@core/components/mui/text-field';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, Controller } from 'react-hook-form';
import Icon from 'src/@core/components/icon';
import { useDispatch, useSelector } from 'react-redux';
import { addProduct, fetchAllProducts, updateProduct } from 'src/store/apps/product';
import { RootState, AppDispatch } from 'src/store';
import { ProductType } from 'src/types/apps/productTypes';

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between',
}));

const defaultValues = {
  nombre: '',
  precio: 0,
  idCategoria: 0,
  unidMedida: '',
  estado: ''
};

const schema = yup.object().shape({
  nombre: yup.string().required('Nombre es requerido'),
  precio: yup.number().required('Precio es requerido'),
  idCategoria: yup.number().required('Categoría es requerida'),
  unidMedida: yup.string().required('Unidad de medida es requerida'),
  estado: yup.string().required('Estado es requerido')
});

interface SidebarAddProductProps {
  open: boolean;
  toggle: () => void;
}

const SidebarProduct = (props: SidebarAddProductProps) => {
  const { open, toggle } = props;
  const dispatch = useDispatch<AppDispatch>();
  const store = useSelector((state: RootState) => state.product);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (open) {
      const product = store.products?.find(
        (elem: ProductType) => elem.idProducto === store.selectedProduct?.idProducto
      );
      if (product) {
        reset({
          nombre: product.nombre || '',
          precio: product.precio || 0,
          idCategoria: product.idCategoria || 0,
          unidMedida: product.unidMedida || '',
          estado: product.estado || ''
        });
      } else {
        reset(defaultValues);
      }
    }
  }, [open, store.selectedProduct, store.products, reset]);

  const onSubmit = (data: {
    nombre: string;
    precio: number;
    idCategoria: number;
    unidMedida: string;
    estado: string;
  }) => {
    if (store.selectedProduct?.idProducto) {
      dispatch(updateProduct({ idProducto: store.selectedProduct.idProducto, ...data })).then(() => {
        dispatch(fetchAllProducts());
      });
    } else {
      dispatch(addProduct(data)).then(() => {
        dispatch(fetchAllProducts());
      });
    }
    toggle();
    reset();
  };

  const handleClose = () => {
    reset(defaultValues);
    toggle();
  };

  return (
    <Drawer
      open={open}
      anchor="right"
      variant="temporary"
      onClose={handleClose}
      ModalProps={{ keepMounted: true }}
      sx={{ '& .MuiDrawer-paper': { width: { xs: 300, sm: 400 } } }}
    >
      <Header>
        <Typography variant="h5">
          {store.selectedProduct?.idProducto ? 'Actualizar ' : 'Agregar '}Producto
        </Typography>
        <IconButton
          size="small"
          onClick={handleClose}
          sx={{
            p: '0.438rem',
            borderRadius: 1,
            color: 'text.primary',
            backgroundColor: 'action.selected',
            '&:hover': {
              backgroundColor: (theme) => `rgba(${theme.palette.customColors.main}, 0.16)`,
            },
          }}
        >
          <Icon icon="tabler:x" fontSize="1.125rem" />
        </IconButton>
      </Header>
      <Box sx={{ p: (theme) => theme.spacing(0, 6, 6) }}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="nombre"
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                label="Nombre"
                fullWidth
                value={value}
                placeholder="Ingrese Nombre"
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.nombre)}
                {...(errors.nombre && { helperText: errors.nombre.message })}
              />
            )}
          />
          <Controller
            control={control}
            name="precio"
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                label="Precio"
                fullWidth
                type="number"
                value={value}
                placeholder="Ingrese Precio"
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.precio)}
                {...(errors.precio && { helperText: errors.precio.message })}
              />
            )}
          />
          <Controller
            control={control}
            name="idCategoria"
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                label="Categoría"
                fullWidth
                type="number"
                value={value}
                placeholder="Ingrese Categoría"
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.idCategoria)}
                {...(errors.idCategoria && { helperText: errors.idCategoria.message })}
              />
            )}
          />
          <Controller
            control={control}
            name="unidMedida"
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                label="Unidad de Medida"
                fullWidth
                value={value}
                placeholder="Ingrese Unidad de Medida"
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.unidMedida)}
                {...(errors.unidMedida && { helperText: errors.unidMedida.message })}
              />
            )}
          />
          <Controller
            control={control}
            name="estado"
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                label="Estado"
                fullWidth
                value={value}
                placeholder="Ingrese Estado"
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.estado)}
                {...(errors.estado && { helperText: errors.estado.message })}
              />
            )}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type="submit" variant="contained" sx={{ mr: 3 }} disabled={!isDirty}>
              {store.selectedProduct?.idProducto ? 'Actualizar' : 'Agregar'}
            </Button>
            <Button variant="tonal" color="secondary" onClick={handleClose}>
              Cancelar
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  );
};

export default SidebarProduct;
