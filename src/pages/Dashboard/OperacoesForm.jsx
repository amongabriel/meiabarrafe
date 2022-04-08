import React, { } from 'react';
import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useSnackbar } from 'notistack';
import {
  Box,
  Button,
  Paper,
  Divider,
  FormHelperText,
  Grid,
  TextField,
  MenuItem
} from '@mui/material';
import api from '../../services/api';

const sentidos = [
  {
    value: "compra",
    label: "Compra"
  },
  {
    value: "venda",
    label: "Venda"
  }
]

const OperacoesForm = ({ operacao, onComplete }) => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <Formik
      enableReinitialize={true}
      initialValues={{
        uuid: operacao?.uuid || null,
        operacao: operacao?.operacao || '',
        lista: operacao?.lista || '',
        data: operacao?.data || '',
        submit: null
      }}
      validationSchema={Yup.object().shape({
        operacao: Yup.string().required('Escolha o sentido da operação'),
        lista: Yup.string().required('Informe a lista de papeis'),
        data: Yup.string().required('Obrigatório')
      })}
      onSubmit={async (values, {

        resetForm,
        setErrors,
        setStatus,
        setSubmitting
      }) => {
        if (values.uuid) {
          try {
            const response = await api.put('/papeis', {
              uuid: values.uuid,
              operacao: values.operacao,
              lista: values.lista,
              data: values.data
            });

            resetForm();
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar(response.data.msg || 'Operação atualizada com sucesso!', {
              variant: 'success'
            });

            if (onComplete) {
              onComplete()
            }
          } catch (err) {
            console.error(err.response.data.error);
            setStatus({ success: false });
            setErrors({ submit: err.response.data.error || err.message });
            setSubmitting(false);
            enqueueSnackbar(err.response.data.error || err.message, {
              variant: 'error'
            });
          }
        }
        else {
          try {
            const response = await api.post('/papeis', {
              uuid: values.uuid,
              operacao: values.operacao,
              lista: values.lista,
              data: values.data
            });

            resetForm();
            setStatus({ success: true });
            setSubmitting(false);
            enqueueSnackbar(response.data.msg || 'Operação cadastrada com sucesso!', {
              variant: 'success'
            });

            if (onComplete) {
              onComplete()
            }

          } catch (err) {
            console.error(err.response.data.error);
            setStatus({ success: false });
            setErrors({ submit: err.response.data.error || err.message });
            setSubmitting(false);
            enqueueSnackbar(err.response.data.error || err.message, {
              variant: 'error'
            });
          }
        }

      }}
    >
      {({
        errors,
        handleBlur,
        handleChange,
        handleSubmit,
        isSubmitting,
        touched,
        values
      }) => (
        <form onSubmit={handleSubmit}>
          <Paper elevation={3}>
            <Box margin={3} padding={5} >
              <Grid container spacing={3}>
                <Grid item md={3}>
                  <TextField
                    error={Boolean(touched.data && errors.data)}
                    fullWidth
                    helperText={touched.data && errors.data}
                    label="Data"
                    name="data"
                    placeholder="dd/mm/yyyy"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.data}
                    variant="outlined"
                  />
                </Grid>
                <Grid item md={3}>
                  <TextField
                    error={Boolean(touched.operacao && errors.operacao)}
                    fullWidth
                    select
                    helperText={touched.operacao && errors.operacao}
                    label="Sentido da Operação"
                    name="operacao"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.operacao}
                    variant="outlined"
                  >
                    {sentidos.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                <Grid item md={6}>
                  <TextField
                    error={Boolean(touched.lista && errors.lista)}
                    fullWidth
                    helperText={touched.lista && errors.lista}
                    label="Lista de Papéis separados por vírgula"
                    name="lista"
                    placeholder="Ex.: AZUL4,BBAS3,PETR4"
                    onBlur={handleBlur}
                    onChange={handleChange}
                    type="text"
                    value={values.lista}
                    variant="outlined"
                  />
                </Grid>
              </Grid>
              {errors.submit && (
                <Box mt={3}>
                  <FormHelperText error>
                    {errors.submit}
                  </FormHelperText>
                </Box>
              )}
            </Box>
            <Divider />
            <Box p={2} display="flex" justifyContent="flex-end">
              <Button
                color="primary"
                disabled={isSubmitting}
                type="submit"
                variant="contained"
              >
                Salvar
              </Button>
            </Box>
          </Paper>
        </form>
      )}
    </Formik >
  );
};

OperacoesForm.propTypes = {
  operacao: PropTypes.object,
  onComplete: PropTypes.func
};

export default OperacoesForm;
