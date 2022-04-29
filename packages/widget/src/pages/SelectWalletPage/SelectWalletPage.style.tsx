import { ListItem, ListItemButton, Typography } from '@mui/material';
import { listItemSecondaryActionClasses } from '@mui/material/ListItemSecondaryAction';
import { styled } from '@mui/material/styles';

export const WalletListItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  paddingLeft: theme.spacing(1.5),
  height: 64,
  '&:hover': {
    backgroundColor: 'rgba(0, 0, 0, 0.04)',
  },
}));

export const WalletListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(1.5),
  [`.${listItemSecondaryActionClasses.root}`]: {
    right: theme.spacing(3),
  },
}));

export const WalletIdentityPopoverContent = styled(Typography)({
  maxWidth: 400,
});
