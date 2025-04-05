import { Link } from '@tanstack/react-router'
import { Button } from "@/components/ui/button"

export default function Privacy() {
  return (
    <div className="container max-w-3xl py-10">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Política de Privacidad</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Última actualización: {new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>
      
      <div className="mt-8 space-y-8">
        <section className="space-y-3">
          <h2 className="text-xl font-bold">1. Introducción</h2>
          <p>
            En Uribe's Boutique, respetamos su privacidad y nos comprometemos a proteger sus datos personales. Esta Política de Privacidad explica cómo recopilamos, utilizamos, divulgamos y protegemos su información cuando utiliza nuestro sistema de administración.
          </p>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">2. Información que Recopilamos</h2>
          <p>
            Podemos recopilar los siguientes tipos de información:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Información de cuenta:</strong> Nombre, dirección de correo electrónico, contraseña y otros datos necesarios para crear y mantener su cuenta.
            </li>
            <li>
              <strong>Información de perfil:</strong> Fotografía, cargo, departamento y otra información relacionada con su función en la empresa.
            </li>
            <li>
              <strong>Datos de uso:</strong> Información sobre cómo utiliza el sistema, incluyendo registros de acceso, acciones realizadas y preferencias de usuario.
            </li>
            <li>
              <strong>Información técnica:</strong> Dirección IP, tipo de navegador, dispositivo, sistema operativo y otros datos técnicos.
            </li>
          </ul>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">3. Cómo Utilizamos su Información</h2>
          <p>
            Utilizamos la información recopilada para:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Proporcionar, mantener y mejorar nuestro sistema</li>
            <li>Autenticar usuarios y gestionar cuentas</li>
            <li>Personalizar la experiencia del usuario</li>
            <li>Monitorear y analizar tendencias de uso</li>
            <li>Detectar, prevenir y abordar problemas técnicos y de seguridad</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">4. Compartición de Información</h2>
          <p>
            No compartimos su información personal con terceros, excepto en las siguientes circunstancias:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Con su consentimiento</li>
            <li>Con proveedores de servicios que nos ayudan a operar el sistema</li>
            <li>Para cumplir con obligaciones legales</li>
            <li>Para proteger los derechos, la propiedad o la seguridad de Uribe's Boutique, nuestros usuarios o el público</li>
          </ul>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">5. Seguridad de los Datos</h2>
          <p>
            Implementamos medidas de seguridad técnicas y organizativas apropiadas para proteger sus datos personales contra el acceso, uso o divulgación no autorizados. Sin embargo, ningún sistema es completamente seguro, y no podemos garantizar la seguridad absoluta de su información.
          </p>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">6. Retención de Datos</h2>
          <p>
            Conservamos su información personal mientras sea necesario para los fines establecidos en esta Política de Privacidad, a menos que la ley exija o permita un período de retención más largo.
          </p>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">7. Sus Derechos</h2>
          <p>
            Dependiendo de su ubicación, puede tener ciertos derechos con respecto a sus datos personales, incluyendo:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Acceder a sus datos personales</li>
            <li>Corregir datos inexactos</li>
            <li>Eliminar sus datos</li>
            <li>Oponerse al procesamiento de sus datos</li>
            <li>Solicitar la portabilidad de sus datos</li>
          </ul>
          <p className="mt-2">
            Para ejercer estos derechos, póngase en contacto con nosotros utilizando la información proporcionada al final de esta política.
          </p>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">8. Cambios a esta Política</h2>
          <p>
            Podemos actualizar esta Política de Privacidad periódicamente. Le notificaremos cualquier cambio significativo publicando la nueva Política de Privacidad en esta página y, si es necesario, a través de un aviso en el sistema.
          </p>
        </section>
        
        <section className="space-y-3">
          <h2 className="text-xl font-bold">9. Contacto</h2>
          <p>
            Si tiene preguntas o inquietudes sobre esta Política de Privacidad o nuestras prácticas de privacidad, póngase en contacto con nosotros en:
          </p>
          <p className="font-medium">
            Uribe's Boutique<br />
            Correo electrónico: privacy@uribesboutique.com<br />
            Teléfono: (123) 456-7890
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
