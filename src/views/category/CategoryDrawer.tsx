import { useEffect, useState } from 'react'
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import CustomTextField from 'src/@core/components/mui/text-field'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm, Controller } from 'react-hook-form'
import Icon from 'src/@core/components/icon'
import { useDispatch, useSelector } from 'react-redux'
import { addCategory, fetchAllCategories, updateCategory } from 'src/store/apps/category'
import { RootState, AppDispatch } from 'src/store'
import { CategoryType } from 'src/types/apps/categoryTypes'

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const defaultValues = {
  nombre: ''
}

const schema = yup.object().shape({
  nombre: yup.string().required('Nombre es requerido')
})

interface SidebarAddCategoryProps {
  open: boolean
  toggle: () => void
}

const SidebarCategory = (props: SidebarAddCategoryProps) => {
  const { open, toggle } = props
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.category)

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors, isDirty }
  } = useForm({
    defaultValues,
    mode: 'onChange',
    resolver: yupResolver(schema)
  })

  useEffect(() => {
    if (open) {
      const category = store.categories?.find(
        (elem: CategoryType) => elem.idCategoria === store.selectedCategory?.idCategoria
      )
      if (category) {
        reset({ nombre: category.nombre })
      } else {
        reset(defaultValues)
      }
    }
  }, [open, store.selectedCategory, store.categories, reset])

  const onSubmit = (data: { nombre: string }) => {
    if (store.selectedCategory?.idCategoria) {
      // Actualizar categoría existente
      dispatch(updateCategory({ idCategoria: store.selectedCategory.idCategoria, nombre: data.nombre })).then(() => {
        dispatch(fetchAllCategories())
      })
    } else {
      // Agregar nueva categoría
      dispatch(addCategory(data)).then(() => {
        dispatch(fetchAllCategories())
      })
    }
    toggle()
    reset()
  }

  const handleClose = () => {
    reset(defaultValues)
    toggle()
  }

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
          {store.selectedCategory?.idCategoria ? 'Actualizar ' : 'Agregar '}Categoría
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
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type="submit" variant="contained" sx={{ mr: 3 }} disabled={!isDirty}>
              {store.selectedCategory?.idCategoria ? 'Actualizar' : 'Agregar'}
            </Button>
            <Button variant="tonal" color="secondary" onClick={handleClose}>
              Cancelar
            </Button>
          </Box>
        </form>
      </Box>
    </Drawer>
  )
}

export default SidebarCategory
