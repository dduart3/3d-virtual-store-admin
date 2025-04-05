import { Link } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"

export default function Terms() {
  return (
    <div className="container max-w-3xl py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Términos de Servicio</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      <div className="mt-8 space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold">1. Aceptación de los Términos</h2>
          <p>
            Al acceder y utilizar el sistema de administración de Uribe's Boutique, usted acepta estar legalmente obligado por estos Términos de Servicio. Si no está de acuerdo con alguno de estos términos, no debe utilizar nuestros servicios.
          </p>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">2. Descripción del Servicio</h2>
          <p>
            Uribe's Boutique proporciona una plataforma de administración para la gestión de inventario, ventas, clientes y otros aspectos relacionados con la operación de la boutique. El servicio está destinado exclusivamente para uso interno de los empleados y administradores autorizados.
          </p>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">3. Cuentas de Usuario</h2>
          <p>
            Para acceder al sistema, se le proporcionará una cuenta de usuario. Usted es responsable de mantener la confidencialidad de su información de inicio de sesión y de todas las actividades que ocurran bajo su cuenta. Debe notificar inmediatamente a Uribe's Boutique sobre cualquier uso no autorizado de su cuenta.
          </p>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">4. Uso Aceptable</h2>
          <p>
            Usted acepta utilizar el servicio solo para fines legítimos relacionados con su trabajo en Uribe's Boutique. Está prohibido:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Utilizar el servicio para actividades ilegales o no autorizadas</li>
            <li>Intentar acceder a áreas del sistema para las que no tiene autorización</li>
            <li>Compartir su información de inicio de sesión con terceros</li>
            <li>Introducir virus, malware u otro código malicioso en el sistema</li>
            <li>Interferir con el funcionamiento normal del servicio</li>
          </ul>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">5. Privacidad</h2>
          <p>
            El uso del servicio está sujeto a nuestra <Link to="/privacy" className="text-primary hover:underline">Política de Privacidad</Link>, que describe cómo recopilamos, utilizamos y protegemos la información.
          </p>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">6. Propiedad Intelectual</h2>
          <p>
            Todos los derechos de propiedad intelectual relacionados con el servicio, incluyendo pero no limitado a software, diseño, logotipos y contenido, son propiedad de Uribe's Boutique o sus licenciantes. No se le otorga ningún derecho o licencia sobre dicha propiedad intelectual más allá del uso necesario para acceder al servicio.
          </p>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">7. Limitación de Responsabilidad</h2>
          <p>
            En la medida permitida por la ley, Uribe's Boutique no será responsable por daños directos, indirectos, incidentales, especiales o consecuentes que resulten del uso o la imposibilidad de usar el servicio.
          </p>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">8. Modificaciones</h2>
          <p>
            Nos reservamos el derecho de modificar estos Términos de Servicio en cualquier momento. Las modificaciones entrarán en vigor inmediatamente después de su publicación. El uso continuado del servicio después de dichas modificaciones constituirá su aceptación de los nuevos términos.
          </p>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">9. Ley Aplicable</h2>
          <p>
            Estos Términos de Servicio se regirán e interpretarán de acuerdo con las leyes de México, sin tener en cuenta sus disposiciones sobre conflictos de leyes.
          </p>
        </section>
      </div>
      
      <div className="mt-8 flex justify-center">
        <Button asChild>
          <Link to="/">Volver al inicio</Link>
        </Button>
      </div>
    </div>
  )
}
