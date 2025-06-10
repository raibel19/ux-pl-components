import Card from '.';

export default function CardExamples() {
  return (
    <div className="container py-5">
      <div className="flex w-full flex-col">
        {/* <Inputs /> */}
        <div className="mx-auto min-h-screen max-w-6xl space-y-8 bg-gray-50 p-6 dark:bg-gray-900">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100">Docusaurus Card Component</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Componente flexible y elegante para tu documentación
            </p>
          </div>

          {/* Grid de ejemplos */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Card básica */}
            <Card title="Instalación Básica" subtitle="Comenzando con el proyecto" variant="default">
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Para instalar este componente en tu proyecto de Docusaurus:
                </p>
                <div className="overflow-x-auto rounded-lg bg-gray-900 p-4">
                  <code className="text-sm text-green-400">npm install @docusaurus/core</code>
                </div>
                <ul className="list-inside list-disc space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <li>Compatible con React 18+</li>
                  <li>Soporte completo para TypeScript</li>
                  <li>Optimizado para SSR</li>
                </ul>
              </div>
            </Card>

            {/* Card de información */}
            <Card
              title="Información Importante"
              subtitle="Conceptos clave que debes conocer"
              variant="info"
              badge="Nuevo"
            >
              <div className="space-y-3">
                <p className="text-gray-700 dark:text-gray-300">
                  Este componente está diseñado específicamente para Docusaurus y utiliza Tailwind CSS.
                </p>
                <div className="rounded-lg bg-blue-100 p-3 dark:bg-blue-900/30">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 <strong>Tip:</strong> Puedes personalizar completamente los estilos usando las clases de
                    Tailwind.
                  </p>
                </div>
              </div>
            </Card>

            {/* Card colapsable */}
            <Card
              title="Configuración Avanzada"
              subtitle="Opciones para usuarios experimentados"
              variant="warning"
              collapsible={true}
              defaultExpanded={false}
            >
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Estas configuraciones son opcionales pero pueden mejorar significativamente tu experiencia:
                </p>
                <div className="rounded-lg bg-amber-100 p-4 dark:bg-amber-900/30">
                  <h4 className="mb-2 font-semibold text-amber-800 dark:text-amber-200">
                    ⚠️ Configuraciones Avanzadas
                  </h4>
                  <ul className="space-y-1 text-sm text-amber-700 dark:text-amber-300">
                    <li>• Modificar el archivo docusaurus.config.js</li>
                    <li>• Configurar plugins personalizados</li>
                    <li>• Ajustar el tema y estilos globales</li>
                  </ul>
                </div>
              </div>
            </Card>

            {/* Card de éxito */}
            <Card
              title="¡Configuración Completada!"
              subtitle="Todo está funcionando correctamente"
              variant="success"
              footer={
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Última verificación: Hace 2 minutos</span>
                  <button className="text-sm font-medium text-green-600 transition-colors hover:text-green-700 dark:text-green-400 dark:hover:text-green-300">
                    Ver logs →
                  </button>
                </div>
              }
            >
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Tu sitio de Docusaurus está configurado y funcionando perfectamente.
                </p>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Build exitoso</span>
                  </div>
                  <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                    <span>Deploy activo</span>
                  </div>
                </div>
              </div>
            </Card>

            {/* Card de error */}
            <Card title="Error de Configuración" subtitle="Se encontraron algunos problemas" variant="error">
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Se detectaron los siguientes errores que necesitan ser corregidos:
                </p>
                <div className="space-y-2">
                  <div className="flex items-start space-x-3 rounded-lg bg-red-100 p-3 dark:bg-red-900/30">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">Variable de entorno faltante</p>
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">DOCUSAURUS_URL no está definida</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3 rounded-lg bg-red-100 p-3 dark:bg-red-900/30">
                    <div className="mt-2 h-2 w-2 flex-shrink-0 rounded-full bg-red-500"></div>
                    <div>
                      <p className="text-sm font-medium text-red-800 dark:text-red-200">Plugin incompatible</p>
                      <p className="mt-1 text-xs text-red-600 dark:text-red-400">@docusaurus/plugin-old-version</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Card premium */}
            <Card
              title="Funcionalidades Premium"
              subtitle="Desbloquea el potencial completo"
              variant="premium"
              footer={
                <div className="flex items-center justify-between">
                  <div className="text-sm">
                    <span className="font-bold text-purple-600 dark:text-purple-400">$19/mes</span>
                    <span className="ml-2 text-gray-500 dark:text-gray-400">por sitio</span>
                  </div>
                  <button className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700">
                    Actualizar Plan
                  </button>
                </div>
              }
            >
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  Accede a funcionalidades avanzadas para sitios de documentación profesionales.
                </p>
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <span className="text-sm text-purple-600 dark:text-purple-400">🚀</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">CDN Global</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Carga ultra rápida mundial</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                      <span className="text-sm text-purple-600 dark:text-purple-400">📊</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Analytics Avanzado</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Métricas detalladas de uso</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Card de ancho completo */}
          <Card
            title="Guía de Implementación Completa"
            subtitle="Todo lo que necesitas saber para usar este componente"
            variant="default"
            collapsible={true}
            className="w-full"
            footer={
              <div className="text-center">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  ¿Necesitas ayuda? Consulta nuestra{' '}
                  <a href="#" className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                    documentación completa
                  </a>
                </p>
              </div>
            }
          >
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div className="p-4 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">1. Instalación</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Copia el componente en tu proyecto de Docusaurus
                  </p>
                </div>
                <div className="p-4 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <span className="text-2xl">⚙️</span>
                  </div>
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">2. Configuración</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Personaliza las variantes según tu marca</p>
                </div>
                <div className="p-4 text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900/30">
                    <span className="text-2xl">🎨</span>
                  </div>
                  <h4 className="mb-2 font-semibold text-gray-900 dark:text-gray-100">3. Personalización</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Ajusta estilos con clases de Tailwind</p>
                </div>
              </div>

              <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
                <h5 className="mb-3 font-semibold text-gray-900 dark:text-gray-100">Ejemplo de uso:</h5>
                <pre className="overflow-x-auto text-sm text-gray-700 dark:text-gray-300">
                  {`import Card from '@site/src/components/Card';

                    <Card 
                      title="Mi Documentación"
                      variant="info"
                      collapsible={true}
                      badge="Nuevo"
                    >
                      <p>Contenido de tu documentación aquí...</p>
                    </Card>`}
                </pre>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
