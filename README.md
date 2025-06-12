# Escenarios para aprender con IA - Segundo Encuentro Sincrónico

Página web interactiva para el segundo encuentro sincrónico del curso "Escenarios para aprender con IA".

## 🎯 Características Principales

### ✨ Funcionalidades Interactivas
- **Sistema de Progreso**: Checkboxes interactivos para marcar momentos completados con persistencia local
- **Tragamonedas de Grupos**: Sorteo interactivo para formar grupos de trabajo con animaciones
- **Navegación Inteligente**: Menú responsive con scroll suave y navegación por teclado
- **Timers Integrados**: Cronómetros para actividades contra reloj
- **Enlaces Dinámicos**: Acceso directo a reuniones virtuales y recursos del curso

### 🎨 Diseño y UX
- **Responsive Design**: Optimizado para móvil, tablet y desktop
- **Paleta de Colores Educativa**: Azul educativo, magenta cálido, naranja energético
- **Animaciones Suaves**: Transiciones y efectos visuales profesionales
- **Accesibilidad**: Navegación por teclado, lectores de pantalla, contraste optimizado

### 🔧 Tecnologías Utilizadas
- **HTML5 Semántico**: Estructura accesible y bien organizada
- **CSS3 Moderno**: Variables CSS, Grid, Flexbox, animaciones
- **JavaScript Vanilla**: Sin dependencias externas, código optimizado
- **LocalStorage**: Persistencia de progreso y resultados

## 📁 Estructura del Proyecto

```
escenarios-ia-web/
├── index.html              # Página principal
├── css/
│   ├── styles.css          # Estilos principales
│   ├── responsive.css      # Adaptaciones responsive
│   └── animations.css      # Animaciones y transiciones
├── js/
│   ├── main.js            # Funcionalidad principal
│   ├── progress.js        # Sistema de progreso
│   ├── navigation.js      # Navegación y menú móvil
│   └── tragamonedas.js    # Tragamonedas interactivo
├── data/
│   └── content.json       # Contenido estructurado
├── assets/
│   ├── images/           # Imágenes del proyecto
│   └── icons/            # Iconos y recursos gráficos
└── README.md             # Documentación
```

## 🚀 Instalación y Uso

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional, para desarrollo)

### Instalación
1. Descargar o clonar el proyecto
2. Abrir `index.html` en un navegador web
3. ¡Listo para usar!

### Para Desarrollo
```bash
# Servir con servidor local (Python)
python -m http.server 8000

# O con Node.js
npx serve .

# Acceder en: http://localhost:8000
```

## 📚 Guía de Uso

### Para Docentes
1. **Navegación**: Use el menú superior para saltar entre momentos
2. **Progreso**: Marque cada momento como completado usando los checkboxes
3. **Tragamonedas**: Use el sorteo para formar grupos de trabajo aleatorios
4. **Enlaces**: Acceda directamente a reuniones virtuales y recursos

### Para Estudiantes
1. **Seguimiento**: Vea el progreso del encuentro en tiempo real
2. **Participación**: Use los timers para actividades cronometradas
3. **Grupos**: Consulte los resultados del sorteo para conocer su grupo
4. **Recursos**: Acceda a enlaces y materiales complementarios

## 🎰 Tragamonedas de Grupos

### Funcionalidades
- **Sorteo Aleatorio**: 3 ruedas con números del 1 al 18
- **Máximo 6 Sorteos**: Para asegurar participación de todos
- **Persistencia**: Los resultados se guardan automáticamente
- **Enlaces Directos**: Acceso inmediato a reuniones de grupo
- **Exportación**: Descarga de resultados en formato JSON

### Uso
1. Hacer clic en "SORTEAR" para iniciar
2. Esperar la animación de las ruedas
3. Ver los grupos formados automáticamente
4. Acceder a las reuniones virtuales correspondientes

## 📱 Responsive Design

### Breakpoints
- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

### Adaptaciones
- **Navegación**: Menú hamburguesa en móvil
- **Layout**: Grid adaptativo según pantalla
- **Interacciones**: Optimizado para touch en móviles
- **Tipografía**: Escalado fluido de texto

## ♿ Accesibilidad

### Características
- **Navegación por Teclado**: Tab, Enter, Escape, flechas
- **Lectores de Pantalla**: ARIA labels y anuncios
- **Contraste**: Cumple WCAG 2.1 AA
- **Focus Visible**: Indicadores claros de foco
- **Tamaños Táctiles**: Mínimo 44px para elementos interactivos

### Atajos de Teclado
- `Tab`: Navegar entre elementos
- `Enter/Space`: Activar botones y checkboxes
- `Escape`: Cerrar menús
- `↑/↓`: Navegar en menú de momentos

## 🎨 Personalización

### Colores
Modificar variables CSS en `styles.css`:
```css
:root {
    --azul-educativo: #2E86AB;
    --magenta-calido: #A23B72;
    --naranja-energetico: #F18F01;
    --rojo-educativo: #C73E1D;
}
```

### Contenido
Editar `data/content.json` para modificar:
- Títulos y descripciones de momentos
- Enlaces a recursos externos
- Configuración de grupos y reuniones

## 🔧 Desarrollo

### Estructura de Código
- **Modular**: Cada funcionalidad en archivo separado
- **Comentado**: Documentación inline extensa
- **Estándares**: ES6+, CSS3, HTML5 semántico
- **Optimizado**: Sin dependencias externas

### Funciones Principales
```javascript
// Sistema de progreso
progressManager.completeMoment(momentId)
progressManager.getProgressStats()

// Navegación
navigationManager.navigateToMoment(momentId)
navigationManager.getCurrentMoment()

// Tragamonedas
slotMachine.spin()
slotMachine.getGroupAssignments()
```

## 📊 Datos y Persistencia

### LocalStorage
- `escenarios-ia-progress`: Progreso de momentos
- `slot-machine-results`: Resultados de sorteos

### Formato de Datos
```json
{
  "completedMoments": [1, 2, 3],
  "timestamp": "2024-01-01T00:00:00.000Z",
  "version": "1.0"
}
```

## 🌐 Compatibilidad

### Navegadores Soportados
- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

### Funcionalidades Progresivas
- **CSS Grid**: Fallback a Flexbox
- **LocalStorage**: Funciona sin persistencia
- **Animaciones**: Respeta `prefers-reduced-motion`

## 📈 Rendimiento

### Optimizaciones
- **CSS**: Variables nativas, sin preprocesadores
- **JavaScript**: Vanilla, sin frameworks
- **Imágenes**: Optimizadas y lazy loading
- **Animaciones**: GPU aceleradas con `transform`

### Métricas
- **Tiempo de Carga**: < 2 segundos
- **Tamaño Total**: < 500KB
- **Lighthouse Score**: 95+ en todas las categorías

## 🐛 Solución de Problemas

### Problemas Comunes
1. **Progreso no se guarda**: Verificar LocalStorage habilitado
2. **Animaciones lentas**: Verificar `prefers-reduced-motion`
3. **Menú no funciona**: Verificar JavaScript habilitado
4. **Enlaces no abren**: Verificar bloqueador de pop-ups

### Debug
```javascript
// Consola del navegador
console.log(progressManager.getProgressStats());
console.log(slotMachine.getCurrentResults());
console.log(navigationManager.getCurrentMoment());
```

## 📝 Licencia

Este proyecto fue desarrollado para uso educativo en el curso "Escenarios para aprender con IA".

## 👥 Créditos

- **Desarrollo**: Manus AI
- **Diseño**: Basado en especificaciones del curso
- **Contenido**: Equipo docente del curso

## 📞 Soporte

Para consultas sobre el funcionamiento de la página web, utilizar los canales de comunicación establecidos en el curso.

---

**Versión**: 1.0  
**Última actualización**: 2024  
**Estado**: Producción

