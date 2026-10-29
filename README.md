# Toscana Tours · Oficina de agentes

Copia de [Agentes IA 3D](https://github.com/ederland/Agentes_IA_3D) (de Ederland Studio, licencia MIT) adaptada a
**Toscana Tours**: tablero de tareas donde el equipo y los agentes de IA trabajan juntos, y nada se publica sin aprobación.

Lo propio de Toscana:

- `toscana/instalacion-base.json`: datos del negocio, marca y equipo de agentes para `/instalar` (sin claves).
- `roles/catalogo.json`: roles Cotizador, Itinerarios, Redes (Instagram y Facebook), Flyers y Seguimiento de prospectos.
- `motor/CLAUDE.md`: reglas de Toscana que todos los agentes cumplen.
- Herramienta `html_a_imagen` para que el agente de Flyers entregue imágenes, usando el Edge o Chrome del PC.
- Logo y tipografía Raleway en la app.

Aquí nunca van claves, datos de clientes ni precios: este repositorio es público.

---

# Agentes IA 3D

![Oficina con agentes de IA](docs/oficina-3d.jpg)

**Una oficina 3D con agentes de IA que trabajan para tu negocio.** Crea tu equipo de agentes (copies, estrategia,
diseño web, video, imágenes, SEO, asistente personal…), ponles el nombre que quieras, asígnales tareas y míralos
trabajar en una oficina 3D. Cada entrega llega a "Espera Aprobación": **nada se publica sin ti**.

Funciona con **Claude Code** y tu propia suscripción de Claude. Código abierto (MIT), sin cuotas.

> Hecho por [Ederland Studio](https://eder-land.com). Si te sirve, dale una ⭐.

## Qué incluye

- **Oficina 3D**: tu equipo humano y tus agentes en tiempo real. Ves quién trabaja, quién está en pausa y quién toma café.
  El coordinador camina hasta cada agente para entregarle las tareas y te trae los resultados. Gira la vista con `Q` / `E`.
- **Pipeline de tareas** (Kanban): pendiente → en progreso → espera aprobación → correcciones → completada,
  con cronómetro, prioridades, clientes y reportes.
- **Agentes con roles**: elige del catálogo o crea los tuyos. Cada rol define qué herramientas puede usar.
- **Chat con cada agente y chat de grupo**: los agentes te preguntan lo que les falta y colaboran con `@menciones`.
- **Asistente coordinador por Telegram** (opcional): háblale por texto o nota de voz, reparte tareas y te avisa
  cuando un agente termina o necesita información.
- **Editor de video local**: transcripción con Whisper, corte de silencios y tomas falsas, limpieza de audio,
  subtítulos y animaciones con código ([HyperFrames](https://github.com/heygen-com/hyperframes)).
- **Avatares personalizables** para cada persona y agente, con vista previa 3D.

## Cómo instalarlo (con Claude Code)

Necesitas: [Node.js 22+](https://nodejs.org), [Claude Code](https://claude.com/claude-code), una cuenta de Google
y unos 30 minutos.

```bash
git clone https://github.com/ederland/Agentes_IA_3D.git
cd Agentes_IA_3D
claude
```

Dentro de Claude Code escribe:

```
/instalar
```

Claude te hará las preguntas (tu negocio, tu marca, tus agentes y sus roles), te guiará para crear tu proyecto
gratis en Firebase y dejará la app publicada y el motor funcionando.

## Cómo funciona

```
 Tú (app web o Telegram)          Firebase (gratis)              Tu PC
 ───────────────────────    →    ─────────────────    →    ───────────────────────────
 creas tareas, apruebas,          tareas, agentes,           motor/ toma las tareas y las
 chateas con los agentes          chats, equipo              ejecuta con Claude Code
```

- Los agentes trabajan **mientras tu PC está encendido** y el motor corriendo. Usan tu suscripción de Claude.
- El motor entra a Firebase con un **usuario robot** con permisos mínimos: solo toca tareas de agentes.
- Tus claves viven solo en `motor/.env` y `app/.env`, que nunca se suben a GitHub.

## Roles incluidos

| Rol | Qué hace | Requiere |
|---|---|---|
| Asistente personal y coordinador | Correo, calendario, reparte tareas, Telegram | Gmail/Calendar/Telegram opcionales |
| Copies para redes | Captions, carruseles, guiones cortos | — |
| LinkedIn y X | Marca personal, posts e hilos | — |
| Estrategia de marketing | Diagnóstico, oferta, embudo, plan | — |
| Lanzamientos | Fases, cronograma y piezas | — |
| Textos largos y SEO | Blogs, webs, emails, VSL | — |
| Diseño web | Landing pages en HTML | — |
| Edición de video | Limpieza, subtítulos, animaciones | — |
| Imágenes | Posts y creativos con IA | Magnific (de pago) |
| Automatizaciones | Diseña flujos y funnels | — |
| Investigación | Informes con fuentes | — |

Agrega los tuyos en [`roles/catalogo.json`](roles/catalogo.json).

### Recomendado para el rol de diseño web

El agente de diseño web trabaja mucho mejor con sistemas de diseño instalados como skills de Claude.
Recomendamos las **[Design Skills de typeui.sh](https://www.typeui.sh/design-skills)** (licencia MIT, de sus autores):
más de 60 estilos (bento, glassmorphism, brutalism, premium, minimal…). No vienen incluidas en este repositorio;
instálalas desde su sitio en `motor/.claude/skills/` y el agente las usará solo. El asistente `/instalar` te lo ofrece
si eliges ese rol.

## Estructura

```
app/        App web (React, Vite, Three.js, Firebase)
motor/      Motor local de agentes (Node + Claude Code)
roles/      Catálogo de roles y herramientas
tools/      Configurador e inicio automático
.claude/    Skill /instalar
```

## Licencia

MIT. Usa, modifica y comparte libremente. Los nombres y marcas de terceros pertenecen a sus dueños;
el proyecto no incluye personajes con marca registrada: cada negocio nombra a sus agentes.
