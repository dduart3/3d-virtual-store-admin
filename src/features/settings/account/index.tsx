import ContentSection from '../components/content-section'
import { AccountForm } from './account-form'

export default function SettingsAccount() {
  return (
    <ContentSection
      title='Cuenta'
      desc='Actualiza la configuración de tu cuenta. Establece tu idioma y zona horaria preferidos.'
    >
      <AccountForm />
    </ContentSection>
  )
}
