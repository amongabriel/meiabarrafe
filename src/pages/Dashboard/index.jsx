import { useCallback, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import {
  Box,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  TableHead,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  DeleteOutline,
  EditOutlined
} from '@mui/icons-material';
import api from '../../services/api';
import OperacoesForm from './OperacoesForm';


const Dashboard = () => {
  const [operacoes, setOperacoes] = useState([])
  const [operacaoEdit, setOperacaoEdit] = useState(null)
  const { enqueueSnackbar } = useSnackbar();

  const getOperacoes = useCallback(async () => {
    try {
      const response = await api.get('/papeis');

      setOperacoes(response.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    getOperacoes();
  }, [getOperacoes])


  const onComplete = () => {
    setOperacaoEdit(null)
    getOperacoes()
  }

  const handleDeleteOperacao = async uuid => {
    try {

      const response = await api.delete(`/papeis/${uuid}`);
      getOperacoes();
      enqueueSnackbar(response.data.msg || 'Operação excluída com sucesso!', {
        variant: 'success'
      });

    } catch (error) {
      console.error(error.response.data.error);
      enqueueSnackbar(error.response.data.error || error.message, {
        variant: 'error'
      });
    }

  }

  const prepareToEdit = (operacao) => {
    console.log(operacao)
    setOperacaoEdit(operacao);
  }

  return (
    <Container>
      <Box sx={{ width: '100%', paddingTop: 4 }}>
        <Typography variant="h4" component="div" gutterBottom>
          Cadastro dos papéis do robô Meia Barra
        </Typography>
      </Box>
      <OperacoesForm onComplete={onComplete} operacao={operacaoEdit} />
      <TableContainer component={Paper} sx={{ marginTop: "2rem" }}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="h6">
                  Data
                </Typography>
              </TableCell>
              <TableCell >
                <Typography variant="h6">
                  Papeis
                </Typography>
              </TableCell>
              <TableCell >
                <Typography variant="h6">
                  Sentido
                </Typography>
              </TableCell>
              <TableCell >
                <Typography variant="h6">
                  Ações
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {operacoes.map((operacao) => (
              <TableRow
                key={operacao.uuid}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {operacao.data}
                </TableCell>
                <TableCell >{operacao.lista}</TableCell>
                <TableCell >{operacao.operacao}</TableCell>
                <TableCell >
                  <Tooltip title="Editar">
                    <IconButton onClick={() => prepareToEdit(operacao)}>
                      <EditOutlined />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Deletar">
                    <IconButton onClick={() => handleDeleteOperacao(operacao.uuid)}>
                      <DeleteOutline />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container >
  );
};

export default Dashboard;
