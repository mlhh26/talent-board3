# 🏥 Health Hub - Talent Board

Un tablero de empleo funcional y elegante para Health Hub que se conecta directamente con un formulario de Google Forms y obtiene las posiciones disponibles de un Google Sheet.

## ✨ Características

- 🎨 **Diseño Moderno**: Interfaz limpia y profesional con colores naranja de Health Hub
- 📱 **Responsive**: Funciona perfectamente en dispositivos móviles, tablets y escritorio
- 🔄 **Actualización Automática**: Se actualiza cada 5 minutos con nuevas posiciones
- 🔍 **Filtros Inteligentes**: Filtra por ciudad y departamento
- 📊 **Estadísticas en Tiempo Real**: Muestra total de posiciones y empresas
- 🎯 **Sin Base de Datos**: Todo se gestiona desde Google Sheets
- ⚡ **Muy Rápido**: Carga instantáneamente

## 🚀 Cómo Configurar

### 1. **Preparar tu Google Form**

Tu formulario debe tener estos campos **en este orden exacto**:

1. **Timestamp** (automático)
2. **Nombre de la Empresa**
3. **Posición**
4. **Ciudad**
5. **Departamento**
6. **Descripción del Puesto**
7. **Requisitos**
8. **Nivel de Experiencia**
9. **Tipo de Contrato**
10. **Rango Salarial**
11. **URL de Aplicación** (opcional)

### 2. **Obtener el ID de tu Google Sheet**

Tu Google Sheet está en: `https://docs.google.com/spreadsheets/d/1pEzAFcI1Mfk9mnokDQ08TU3EllXq3o5kJ_SrBqIfLVs/edit`

El ID es: `1pEzAFcI1Mfk9mnokDQ08TU3EllXq3o5kJ_SrBqIfLVs`

### 3. **Configurar el Código**

En el archivo `config.js`, asegúrate de que:

```javascript
const CONFIG = {
    SHEET_ID: '1pEzAFcI1Mfk9mnokDQ08TU3EllXq3o5kJ_SrBqIfLVs',
    SHEET_NAME: 'Form Responses 1', // Cambiar si es necesario
    // ...
};
```

### 4. **Hacer el Google Sheet Público**

Para que el tablero pueda acceder a los datos:

1. Abre tu Google Sheet
2. Haz clic en "Compartir"
3. Cambia a "Cualquiera con el enlace"
4. Selecciona "Espectador"
5. Copia el enlace

### 5. **Desplegar**

Sube los archivos a tu servidor web:

```bash
index.html
styles.css
script.js
config.js
```

O usa GitHub Pages:

1. Activa GitHub Pages en la rama `main`
2. El sitio estará en: `https://mlhh26.github.io/talent-board3`

## 📁 Estructura de Archivos

```
talent-board3/
├── index.html       # Estructura HTML
├── styles.css       # Estilos con tema naranja
├── script.js        # Lógica principal
├── config.js        # Configuración
└── README.md        # Este archivo
```

## 🎨 Personalización

### Cambiar Colores

En `styles.css`, modifica las variables CSS:

```css
:root {
    --primary-color: #FF6B35;      /* Naranja principal */
    --primary-dark: #E85A24;       /* Naranja oscuro */
    --primary-light: #FFB4A2;      /* Naranja claro */
    /* ... */
}
```

### Cambiar el Nombre del Sheet

Si tu hoja de Google Forms tiene un nombre diferente a "Form Responses 1", actualiza en `config.js`:

```javascript
SHEET_NAME: 'Tu Nombre Aqui'
```

### Ajustar Intervalo de Actualización

Para cambiar cada cuánto se actualiza (en milisegundos):

```javascript
REFRESH_INTERVAL: 5 * 60 * 1000  // 5 minutos
```

## 🔌 Cómo Funciona

1. **Google Form** → Los usuarios llenan el formulario
2. **Google Sheet** → Las respuestas se guardan automáticamente
3. **Talent Board** → Cada 5 minutos, nuestro script:
   - Descarga el Google Sheet como CSV
   - Parsea los datos
   - Muestra las posiciones en el tablero

## 📱 Vista Previa

- **Desktop**: 3 columnas de tarjetas de empleo
- **Tablet**: 2 columnas
- **Mobile**: 1 columna (responsive)

Cada tarjeta muestra:
- 💼 Posición y Empresa
- 📍 Ciudad
- 💼 Departamento
- ⏱️ Tipo de Contrato
- 📝 Descripción resumida
- 🏷️ Tags (Experiencia, Salario)
- ⏰ Fecha de publicación
- 🔗 Botón para aplicar

## 🔒 Privacidad

- ✅ Los datos se cargan directamente desde Google Sheets
- ✅ No se almacena información en servidores externos
- ✅ Todo es público (Google Sheet debe estar compartido)

## 📞 Soporte

Para el Google Form:
1. Asegúrate de que tiene exactamente 11 campos
2. Que estén en el orden correcto
3. Que el Google Sheet esté configurado como público

Para el tablero:
1. Abre la consola del navegador (F12)
2. Revisa si hay errores
3. Verifica que el SHEET_ID sea correcto

## 🌐 Ejemplo de URL de Aplicación

En el formulario, el campo "URL de Aplicación" puede ser:
- `https://www.medicarepus.es/careers`
- `https://form.typeform.com/to/xxxxx`
- `mailto:hr@company.com`

Si está vacío, el botón "Aplicar" dirá "Próximamente".

## 💡 Próximas Mejoras

- [ ] Integración con calendario
- [ ] Búsqueda por texto libre
- [ ] Guardar favoritos
- [ ] Notificaciones por email
- [ ] Soporte multi-idioma

---

**Health Hub Talent Board** - Conectando talento con oportunidades 🚀
