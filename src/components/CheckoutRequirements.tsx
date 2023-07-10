import {
  Grid,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  Typography,
} from '@mui/material';

export default function CheckoutRequirements(props: {
  step1?: boolean; //Login
  step2?: boolean; //Pick up details
  step3?: boolean; //Payment method
  step4?: boolean; //Place order?
}) {
  return (
    <Grid>
      <TableContainer>
        <Table>
          <TableRow className="checkout-requirements">
            <TableCell>
              <Typography className={props.step1 ? 'active' : ''}>
                Sign-in
              </Typography>
            </TableCell>
            <TableCell>
              <Typography className={props.step2 ? 'active' : ''}>
                Pick up details
              </Typography>
            </TableCell>
            <TableCell>
              <Typography className={props.step3 ? 'active' : ''}>
                Payment Method
              </Typography>
            </TableCell>
            <TableCell>
              <Typography className={props.step4 ? 'active' : ''}>
                Place order
              </Typography>
            </TableCell>
          </TableRow>
        </Table>
      </TableContainer>
    </Grid>
  );
}
