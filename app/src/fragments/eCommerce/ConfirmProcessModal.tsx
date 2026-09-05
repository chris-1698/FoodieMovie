import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button
} from '@mui/material'

interface ConfirmActionDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  confirmColor?: 'primary' | 'secondary' | 'error' | 'success' | 'warning' | 'info'
  isProcessing?: boolean
  onConfirm: () => void
  onClose: () => void
}

export default function ConfirmActionDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  confirmColor = 'primary',
  isProcessing = false,
  onConfirm,
  onClose
}: ConfirmActionDialogProps) {
  const handleClose = () => {
    if (isProcessing) return
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth='xs'
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{description}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={isProcessing}>
          {cancelLabel}
        </Button>
        <Button
          variant='contained'
          color={confirmColor}
          onClick={onConfirm}
          disabled={isProcessing}
        >
          {isProcessing ? 'Procesando...' : confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  )
}