// ** MUI Imports
import { Typography } from '@mui/material'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

interface TableHeaderProps {
  toggle?: () => void
  textButton?: string
  titleView: string
}

const TableHeader = (props: TableHeaderProps) => {
  // ** Props
  const { toggle, textButton, titleView } = props

  return (
    <Box
      sx={{
        py: 4,
        px: 6,
        rowGap: 2,
        columnGap: 4,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
        <Box
          sx={{
            rowGap: 2,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            flex: '1',
          }}
        >
          <Typography variant='h4'>{titleView}</Typography>
        </Box>
      <Box sx={{ rowGap: 2, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <Button onClick={toggle} variant='contained' sx={{ '& svg': { mr: 2 } }}>
          <Icon fontSize='1.125rem' icon='tabler:plus' />
          {textButton}
        </Button>
      </Box>
    </Box>
  )
}

export default TableHeader
