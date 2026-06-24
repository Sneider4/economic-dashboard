# 🌐 Dashboard Económico Global

Panel interactivo de indicadores económicos mundiales con datos en tiempo real, construido con Angular 21 y Chart.js.

![Angular](https://img.shields.io/badge/Angular-21-DD0031?style=flat&logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat&logo=typescript&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?style=flat&logo=chartdotjs&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5-7952B3?style=flat&logo=bootstrap&logoColor=white)
![Deploy](https://img.shields.io/badge/Deploy-GitHub%20Pages-181717?style=flat&logo=github&logoColor=white)

## ¿Qué muestra?

### Tarjetas KPI — Colombia
| Indicador | Fuente |
|-----------|--------|
| Crecimiento del PIB (%) | Banco Mundial |
| Inflación IPC (%) | Banco Mundial |
| Desempleo (%) | Banco Mundial |
| Tasa de cambio USD/COP | Open Exchange Rates |

### Gráficas
- **Crecimiento del PIB** — Líneas comparativas de 6 economías (Colombia, EE.UU., Brasil, México, Argentina, Chile) en los últimos 20 años
- **Tasas de cambio** — USD/COP en tiempo real + tabla de monedas principales vs COP
- **Inflación comparada** — Barras del último año disponible para 8 países, con colores por severidad

## Tecnologías

- **Framework:** Angular 21 (standalone components, control flow `@if` / `@for`)
- **Gráficas:** Chart.js 4 (integración directa sin wrapper)
- **Estilos:** Bootstrap 5 + SCSS personalizado — tema oscuro
- **HTTP:** Angular HttpClient con `withFetch()`, timeout y manejo de errores independiente por petición

## APIs utilizadas — sin costo, sin API key

| API | Uso |
|-----|-----|
| [Banco Mundial v2](https://api.worldbank.org/v2/) | PIB, inflación, desempleo histórico por país |
| [Open Exchange Rates](https://open.er-api.com/v6/latest/USD) | Tasas de cambio en tiempo real |

## Ejecutar localmente

```bash
# 1. Clonar el repositorio
git clone https://github.com/Sneider4/economic-dashboard.git
cd economic-dashboard

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo
ng serve
```

Abrir `http://localhost:4200`

## Autor

**Richard Sneider Malagón** — Desarrollador Fullstack  
Especializado en Angular · Node.js · PostgreSQL  
Desarrollador en U.D.C.A — Sistema de Información Institucional (SII) · Bogotá, Colombia

[![LinkedIn](https://img.shields.io/badge/LinkedIn-sneider--malagon-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/sneider-malagon/)
[![GitHub](https://img.shields.io/badge/GitHub-Sneider4-181717?style=flat&logo=github&logoColor=white)](https://github.com/Sneider4)
