import { Box } from '@mui/material';

const Landing: React.FC = () => {
  // Redirigir a la lista de canales si el usuario está autenticado
  // if (user) return <Navigate to="/channel-list" />;

  return (
    <Box
      sx={{
        display: 'flex',
        width: '300px',
        margin: '300px auto',
        justifyContent: 'center',
        textAlign: 'center',
        fontSize: '20px',
        fontWeight: 'bold',
      }}
    >
      INGRESA A LA PLATAFORMA LOGUEANDOTE
    </Box>
  );
};

export default Landing;
