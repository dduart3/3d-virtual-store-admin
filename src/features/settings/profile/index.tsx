import ContentSection from '../components/content-section'
import ProfileForm from './profile-form'

export default function SettingsProfile() {
  return (
    <ContentSection
      title='Perfil'
      desc='Este es como otros verán tu perfil en el sitio.'
    >
      <ProfileForm />
    </ContentSection>
  )
}
