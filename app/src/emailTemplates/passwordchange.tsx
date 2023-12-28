import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';
// TODO: Esto: https://resend.com/
// https://www.youtube.com/watch?v=D4pS4b9-DgA&ab_channel=ColbyFayock 5:59
interface DropboxResetPasswordEmailProps {
  userFirstname?: string;
  resetPasswordLink?: string;
  language?: string;
}

const baseUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : '';

export const ResetPasswordEmail = ({
  userFirstname = 'Zeno',
  resetPasswordLink = 'https://dropbox.com',
  language = 'esp'
}: DropboxResetPasswordEmailProps) => {
  return (
    <Html>
      <Head />
      {language === 'esp' ?
        (<Preview>Solicitud de recuperación de contraseña Foodie Movie</Preview>)
        :
        <Preview>Password change request for Foodie Movie</Preview>
      }
      <Body style={main}>
        {language === 'esp' ?
          (
            <Container style={container}>
              {/* Logo */}
              <Img
                src={`${baseUrl}/static/dropbox-logo.png`}
                width="40"
                height="33"
                alt="Foodie Movie"
              />
              {/* Texto 1 */}
              <Section>
                <Text style={text}>¡Hola, {userFirstname}!,</Text>
                <Text style={text}>
                  Alguien ha solicitado un cambio de contraseña para tu
                  cuenta de Foodie Movie. Si fuiste tú, restablece tu contraseña
                  aquí:
                </Text>
                <Button style={button} href={resetPasswordLink}>
                  Restablecer contraseña
                </Button>
                <Text style={text}>
                  Si no quieres cambiar tu contraseña o no fuiste quien solicitó
                  este cambio, ignora y borra este mensaje.
                </Text>
                <Text style={text}>Un saludo!</Text>
                <Text style={text}>El equipo de Foodie Movie</Text>
              </Section>
            </Container>
          ) : (
            <Container style={container}>
              <Img
                src={`${baseUrl}/static/dropbox-logo.png`}
                width="40"
                height="33"
                alt="Foodie Movie"
              />
              <Section>
                <Text style={text}>Hi, {userFirstname}!,</Text>
                <Text style={text}>
                  Someone recently requested a password change for your
                  Foodie movie account. If this was you, set a new password
                  here:
                </Text>
                <Button style={button} href={resetPasswordLink}>
                  Reset password
                </Button>
                <Text style={text}>
                  If you don't want to change your password or weren't the one who
                  requested this change, you can ignore and delete this message.
                </Text>
                <Text style={text}>Greetings!</Text>
                <Text style={text}>The Foodie Movie team</Text>
              </Section>
            </Container>
          )
        }

      </Body>
    </Html>
  );
};

export default ResetPasswordEmail;

const main = {
  backgroundColor: '#f6f9fc',
  padding: '10px 0',
};

const container = {
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
  padding: '45px',
};

const text = {
  fontSize: '16px',
  fontFamily:
    "'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: '300',
  color: '#404040',
  lineHeight: '26px',
};

const button = {
  backgroundColor: '#007ee6',
  borderRadius: '4px',
  color: '#fff',
  fontFamily: "'Open Sans', 'Helvetica Neue', Arial",
  fontSize: '15px',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '210px',
  padding: '14px 7px',
};

const anchor = {
  textDecoration: 'underline',
};


/*
<p>Hola, {{to_name}}!,</p>

<p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;">
¿Has olvidado tu contraseña?<br>
¡No hay problema! Haz clic abajo y restablece una nueva contraseña.
<br><br>
{{link}}
<br><br>
Si no fuiste tú quien solicitó este cambio, puedes ignorar este email.
</p>
<p>Un saludo,<br>el equipo de Foodie Movie.</p>
&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;--------------------------------------------------------------------------------------------------

<p>Hi, {{to_name}}!,</p>
<p style="padding: 12px; border-left: 4px solid #d0d0d0; font-style: italic;">Have you forgotten your password?
<br>
No problem! Click on the link and reset it. 
<br><br>{{link}} <br><br>
If it wasn't you who asked for this change, you may ignore this email.</p>
<p>Best regards,<br>Foodie Movie's team.
</p>

*/
