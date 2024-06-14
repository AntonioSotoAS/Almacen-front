import { useEffect } from 'react'
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
import { addStorage, fetchAllStorages, updateStorage } from 'src/store/apps/storage'
import { RootState, AppDispatch } from 'src/store'
import { StorageType } from 'src/types/apps/storageTypes'

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(6),
  justifyContent: 'space-between'
}))

const defaultValues = {
  nombre: '',
  ubicacion: ''
}

const schema = yup.object().shape({
  nombre: yup.string().required('Nombre es requerido'),
  ubicacion: yup.string().required('Ubicación es requerida')
})

interface SidebarAddStorageProps {
  open: boolean
  toggle: () => void
}

const SidebarStorage = (props: SidebarAddStorageProps) => {
  const { open, toggle } = props
  const dispatch = useDispatch<AppDispatch>()
  const store = useSelector((state: RootState) => state.storage)

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
      const storage = store.storages?.find(
        (elem: StorageType) => elem.idAlmacen === store.selectedStorage?.idAlmacen
      )
      if (storage) {
        reset({ nombre: storage.nombre, ubicacion: storage.ubicacion })
      } else {
        reset(defaultValues)
      }
    }
  }, [open, store.selectedStorage, store.storages, reset])

  const onSubmit = (data: { nombre: string, ubicacion: string }) => {
    if (store.selectedStorage?.idAlmacen) {
      // Actualizar almacén existente
      dispatch(updateStorage({ idAlmacen: store.selectedStorage.idAlmacen, ...data })).then(() => {
        dispatch(fetchAllStorages())
      })
    } else {
      // Agregar nuevo almacén
      dispatch(addStorage(data)).then(() => {
        dispatch(fetchAllStorages())
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
          {store.selectedStorage?.idAlmacen ? 'Actualizar ' : 'Agregar '}Almacén
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
            name="ubicacion"
            render={({ field: { value, onChange } }) => (
              <CustomTextField
                label="Ubicación"
                fullWidth
                value={value}
                placeholder="Ingrese Ubicación"
                sx={{ mb: 4 }}
                onChange={onChange}
                error={Boolean(errors.ubicacion)}
                {...(errors.ubicacion && { helperText: errors.ubicacion.message })}
              />
            )}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Button type="submit" variant="contained" sx={{ mr: 3 }} disabled={!isDirty}>
              {store.selectedStorage?.idAlmacen ? 'Actualizar' : 'Agregar'}
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

export default SidebarStorage
