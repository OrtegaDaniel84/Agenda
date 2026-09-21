document.addEventListener('DOMContentLoaded', function() {
    // Diccionario de internacionalización (Español / Inglés)
    const I18N = {
        es: {
            pageTitle: 'Agenda Semanal',
            weekPrefix: 'Semana',
            loadingWeek: 'Cargando semana...',
            dbUpToDate: 'Base de datos al día',
            dbUpToDateWithTime: (t) => `BD al día (${t})`,
            dbSyncing: 'Actualizando base de datos...',
            dbNotSynced: 'BD sin sincronizar',
            dbOffline: 'Sin conexión',
            dbUnavailable: 'BD no disponible',
            dbReconnecting: 'Reconectando...',
            dbTooltipDefault: 'Los calendarios se consultan cada 15 min y se guardan en la base de datos',
            dbTooltipTime: (t) => `BD actualizada a las ${t} (hora del servidor)`,
            refreshBtn: 'Actualizar',
            refreshingBtn: 'Consultando...',
            refreshTooltip: 'Forzar consulta a los calendarios y guardar en la base de datos',
            errorRefresh: 'Error al consultar',
            settingsBtn: 'Configurar Calendarios',
            
            // Columna 1: Anual
            annualCalendarTitle: 'Calendario Anual',
            markingModeTooltip: 'Modo marcar días activo',
            markingWith: (name) => `Marcando con: ${name}`,
            months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
            daysShort: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
            dateTooltip: (d, m, y) => `${d} de ${m} de ${y}`,
            maxEventsPerDay: '¡Máximo 4 eventos por día!',

            // Columna 2: Mes
            monthlyCalendarTitle: 'Calendario Mensual',
            todayBtn: 'Hoy',
            todayBtnTooltip: 'Volver al día y semana actual',

            // Planificación
            planningTitle: 'Planificación',
            addPlanningBtn: 'Agregar',
            addPlanningTooltip: 'Crear evento de planificación',
            noPlanningEvents: 'Sin eventos de planificación.',
            addPlanningEventLink: '+ Agregar evento',
            dayUnit: (n) => n === 1 ? 'día' : 'días',
            dayMarkedTooltip: (n) => `${n} ${n === 1 ? 'día marcado en el calendario anual' : 'días marcados en el calendario anual'}`,
            markingBadge: 'Marcando',
            editEvent: 'Editar evento',
            deleteEvent: 'Eliminar evento',
            clickToDeselect: 'Haz clic para deseleccionar',
            clickToSelect: 'Haz clic para seleccionar y marcar días en el calendario anual',
            deselectEventTooltip: 'Deseleccionar evento',

            // Días de la semana
            daysOfWeek: {
                sunday: 'Domingo',
                monday: 'Lunes',
                tuesday: 'Martes',
                wednesday: 'Miércoles',
                thursday: 'Jueves',
                friday: 'Viernes',
                saturday: 'Sábado'
            },
            loadingEvents: 'Cargando eventos...',
            reconnectingEvents: 'Reconectando eventos...',

            // Modal Calendarios
            modalCalendarsTitle: 'Fuentes de Calendario',
            calTitleLabel: 'Título del calendario',
            calTitlePlaceholder: 'Ej: Trabajo, Personal, Clases',
            calColorLabel: 'Color',
            calColorTitle: 'Selecciona un color',
            calUrlLabel: 'URL iCal / Webcal',
            calUrlPlaceholder: 'https://... o webcal://...',
            btnAddCal: 'Añadir Calendario',
            btnUpdateCal: 'Actualizar Calendario',
            btnCancel: 'Cancelar',
            activeCalendarsTitle: 'Calendarios Activos',
            noCalendarsConfigured: 'No hay calendarios configurados aún',
            editCalendar: 'Editar calendario',
            deleteCalendar: 'Eliminar calendario',
            btnClose: 'Cerrar',

            // Modal Planificación
            newPlanningTitle: 'Nuevo Evento de Planificación',
            editPlanningTitle: 'Editar Evento de Planificación',
            planningTitleLabel: 'Título del evento',
            planningTitlePlaceholder: 'Ej: Revisión de sprint, Llamada con cliente...',
            planningColorLabel: 'Color',
            planningColorTitle: 'Selecciona un color para el evento',
            quickPaletteLabel: 'Paleta rápida',
            savePlanningEvent: 'Guardar Evento',
            updatePlanningEvent: 'Actualizar Evento'
        },
        en: {
            pageTitle: 'Weekly Planner',
            weekPrefix: 'Week',
            loadingWeek: 'Loading week...',
            dbUpToDate: 'Database up to date',
            dbUpToDateWithTime: (t) => `DB up to date (${t})`,
            dbSyncing: 'Updating database...',
            dbNotSynced: 'DB not synced',
            dbOffline: 'Offline',
            dbUnavailable: 'DB unavailable',
            dbReconnecting: 'Reconnecting...',
            dbTooltipDefault: 'Calendars are fetched periodically and stored in database',
            dbTooltipTime: (t) => `DB updated at ${t} (server time)`,
            refreshBtn: 'Refresh',
            refreshingBtn: 'Checking...',
            refreshTooltip: 'Force check remote calendars and save to database',
            errorRefresh: 'Error checking',
            settingsBtn: 'Configure Calendars',
            
            // Columna 1: Anual
            annualCalendarTitle: 'Annual Calendar',
            markingModeTooltip: 'Day marking mode active',
            markingWith: (name) => `Marking with: ${name}`,
            months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
            daysShort: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
            dateTooltip: (d, m, y) => `${m} ${d}, ${y}`,
            maxEventsPerDay: 'Maximum 4 events per day!',

            // Columna 2: Mes
            monthlyCalendarTitle: 'Monthly Calendar',
            todayBtn: 'Today',
            todayBtnTooltip: 'Return to current day and week',

            // Planificación
            planningTitle: 'Planning',
            addPlanningBtn: 'Add',
            addPlanningTooltip: 'Create planning event',
            noPlanningEvents: 'No planning events yet.',
            addPlanningEventLink: '+ Add event',
            dayUnit: (n) => n === 1 ? 'day' : 'days',
            dayMarkedTooltip: (n) => `${n} ${n === 1 ? 'day marked on annual calendar' : 'days marked on annual calendar'}`,
            markingBadge: 'Marking',
            editEvent: 'Edit event',
            deleteEvent: 'Delete event',
            clickToDeselect: 'Click to deselect',
            clickToSelect: 'Click to select and mark days on annual calendar',
            deselectEventTooltip: 'Deselect event',

            // Días de la semana
            daysOfWeek: {
                sunday: 'Sunday',
                monday: 'Monday',
                tuesday: 'Tuesday',
                wednesday: 'Wednesday',
                thursday: 'Thursday',
                friday: 'Friday',
                saturday: 'Saturday'
            },
            loadingEvents: 'Loading events...',
            reconnectingEvents: 'Reconnecting events...',

            // Modal Calendarios
            modalCalendarsTitle: 'Calendar Sources',
            calTitleLabel: 'Calendar title',
            calTitlePlaceholder: 'e.g., Work, Personal, Classes',
            calColorLabel: 'Color',
            calColorTitle: 'Select a color',
            calUrlLabel: 'iCal / Webcal URL',
            calUrlPlaceholder: 'https://... or webcal://...',
            btnAddCal: 'Add Calendar',
            btnUpdateCal: 'Update Calendar',
            btnCancel: 'Cancel',
            activeCalendarsTitle: 'Active Calendars',
            noCalendarsConfigured: 'No calendars configured yet',
            editCalendar: 'Edit calendar',
            deleteCalendar: 'Delete calendar',
            btnClose: 'Close',

            // Modal Planificación
            newPlanningTitle: 'New Planning Event',
            editPlanningTitle: 'Edit Planning Event',
            planningTitleLabel: 'Event title',
            planningTitlePlaceholder: 'e.g., Sprint review, Client call...',
            planningColorLabel: 'Color',
            planningColorTitle: 'Select a color for the event',
            quickPaletteLabel: 'Quick palette',
            savePlanningEvent: 'Save Event',
            updatePlanningEvent: 'Update Event'
        }
    };

    // Idioma activo (persistido en localStorage)
    let currentLang = localStorage.getItem('agenda_language') || 'es';
    if (currentLang !== 'es' && currentLang !== 'en') currentLang = 'es';

    // Variables globales para la semana actual en vista
    let currentSunday, currentSaturday, weekDates = {};
    const daysIds = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Zona horaria del servidor (se sincroniza con /api/sync-status)
    let serverTimeZone = null;

    // Obtener la fecha/hora actual alineada con la zona horaria del servidor
    function getServerNow() {
        if (!serverTimeZone) return new Date();
        try {
            const str = new Date().toLocaleString('en-US', { timeZone: serverTimeZone });
            const d = new Date(str);
            return isNaN(d.getTime()) ? new Date() : d;
        } catch {
            return new Date();
        }
    }

    // Función auxiliar para formatear fechas a YYYY-MM-DD en hora local/servidor
    function formatLocalDate(d) {
        if (!d) return '';
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    // Función auxiliar para normalizar fechas (acepta Date o string YYYY-MM-DD) al mediodía local
    function parseLocalDate(input) {
        if (!input) return new Date();
        if (typeof input === 'string') {
            const parts = input.split('T')[0].split('-');
            if (parts.length === 3) {
                return new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10), 12, 0, 0);
            }
        }
        const d = new Date(input);
        return new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12, 0, 0);
    }

    // 1. Inicializar Mini Calendario con FullCalendar
    const miniCalendarEl = document.getElementById('mini-calendar');
    const miniCalendar = new FullCalendar.Calendar(miniCalendarEl, {
        initialView: 'dayGridMonth',
        locale: currentLang,
        firstDay: 0, // Domingo es el primer día de la semana
        height: 'auto',
        aspectRatio: 1.25,
        expandRows: false,
        fixedWeekCount: false, // Evita que dibuje semanas vacías adicionales
        dayHeaderFormat: { weekday: 'narrow' }, // D, L, M, M, J, V, S
        headerToolbar: { left: 'prev', center: 'title', right: 'next' },
        dateClick: function(info) {
            // Usar info.dateStr para evitar desviaciones por zona horaria UTC
            updateWeekView(info.dateStr || info.date);
        },
        datesSet: function() {
            setTimeout(highlightSelectedWeek, 20);
        }
    });
    miniCalendar.render();

    // Resaltar en el mini-calendario los días correspondientes a la semana visible (Domingo a Sábado)
    function highlightSelectedWeek() {
        if (!weekDates || Object.keys(weekDates).length === 0) return;
        
        document.querySelectorAll('#mini-calendar .fc-daygrid-day').forEach(el => {
            el.classList.remove('fc-day-selected-week', 'fc-day-selected-first', 'fc-day-selected-last');
        });

        const datesArr = Object.keys(weekDates);
        datesArr.forEach((dateStr, idx) => {
            const dayEl = document.querySelector(`#mini-calendar .fc-daygrid-day[data-date="${dateStr}"]`);
            if (dayEl) {
                dayEl.classList.add('fc-day-selected-week');
                if (idx === 0) dayEl.classList.add('fc-day-selected-first'); // Domingo
                if (idx === datesArr.length - 1) dayEl.classList.add('fc-day-selected-last'); // Sábado
            }
        });
    }

    // Botón "Hoy" del mini calendario
    const btnMiniToday = document.getElementById('btn-mini-today');
    if (btnMiniToday) {
        btnMiniToday.addEventListener('click', () => {
            const today = getServerNow();
            miniCalendar.today();
            updateWeekView(today);
        });
    }

    // 2. Función para recalcular y dibujar la semana según la fecha seleccionada
    function updateWeekView(baseDateInput) {
        // Normalizar la fecha base al mediodía en hora local para evitar desfasajes de zona horaria o DST
        const normalized = parseLocalDate(baseDateInput);

        // En JavaScript: 0 = Domingo, 1 = Lunes, ..., 6 = Sábado
        const dayOfWeek = normalized.getDay();

        // El domingo de esta semana
        currentSunday = new Date(normalized);
        currentSunday.setDate(normalized.getDate() - dayOfWeek);

        // El sábado de esta semana (Domingo + 6 días)
        currentSaturday = new Date(currentSunday);
        currentSaturday.setDate(currentSunday.getDate() + 6);

        // Actualizar título superior con formato amigable
        const t = I18N[currentLang];
        const localeCode = currentLang === 'es' ? 'es-ES' : 'en-US';
        const formatOpt = { day: 'numeric', month: 'short' };
        const formatOptYear = { day: 'numeric', month: 'short', year: 'numeric' };
        const labelEl = document.getElementById('current-date-label');
        if (labelEl) {
            labelEl.innerText =
                `${t.weekPrefix}: ${currentSunday.toLocaleDateString(localeCode, formatOpt)} - ${currentSaturday.toLocaleDateString(localeCode, formatOptYear)}`;
        }

        weekDates = {};
        const todayFormatted = formatLocalDate(getServerNow());

        daysIds.forEach((id, index) => {
            const currentDay = new Date(currentSunday);
            currentDay.setDate(currentSunday.getDate() + index);
            const dateString = formatLocalDate(currentDay);
            weekDates[dateString] = id;

            // Actualizar número del día
            const dayLabel = document.querySelector(`#${id} .date-label`);
            if (dayLabel) {
                dayLabel.innerText = currentDay.getDate();
            }

            // Resaltar el día actual con clase de Bootstrap / estilo
            const dayDiv = document.getElementById(id);
            if (dayDiv) {
                dayDiv.classList.remove('today-highlight');
                if (dateString === todayFormatted) {
                    dayDiv.classList.add('today-highlight');
                }
            }
        });

        // Resaltar visualmente la semana seleccionada en el mini calendario
        highlightSelectedWeek();

        // Buscar eventos para la nueva semana seleccionada
        fetchRealEvents();
    }

    // 3. Vista Anual (12 Meses) con Marcas de Planificación
    let planningMarks = {};
    let selectedPlanningEventId = null;

    function getDateKey(year, monthIndex, day) {
        const m = String(monthIndex + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        return `${year}-${m}-${d}`;
    }

    // Calcula el fondo del cuadrado redondeado según el número de eventos (1 a 4)
    function getPlanningDayBackground(colors) {
        if (!colors || colors.length === 0) return '';
        if (colors.length === 1) {
            return colors[0];
        }
        if (colors.length === 2) {
            // Dividido en 2 mitades verticales
            return `linear-gradient(90deg, ${colors[0]} 0% 50%, ${colors[1]} 50% 100%)`;
        }
        if (colors.length === 3) {
            // Dividido en 3 franjas verticales
            return `linear-gradient(90deg, ${colors[0]} 0% 33.33%, ${colors[1]} 33.33% 66.67%, ${colors[2]} 66.67% 100%)`;
        }
        // 4 eventos: dividido en 4 cuadrantes (2x2)
        // 270deg inicia en las 9 en punto (cuadrante superior-izquierdo) y avanza en sentido horario
        return `conic-gradient(from 270deg at 50% 50%, ${colors[0]} 0deg 90deg, ${colors[1]} 90deg 180deg, ${colors[2]} 180deg 270deg, ${colors[3]} 270deg 360deg)`;
    }

    async function loadPlanningMarks() {
        try {
            const res = await fetch('/api/planning-marks');
            if (res.ok) {
                planningMarks = await res.json();
                renderAnnualCalendar();
                updatePlanningEventsDayCounts();
            }
        } catch (err) {
            console.warn('[Agenda] Error cargando marcas de planificación:', err);
        }
    }

    function renderAnnualCalendar() {
        const container = document.getElementById('annual-calendar');
        if (!container) return;
        container.innerHTML = '';

        const year = new Date().getFullYear();
        const yearBadge = document.getElementById('annual-year-badge');
        if (yearBadge) {
            yearBadge.innerText = year;
        }

        const t = I18N[currentLang];
        const months = t.months;
        const daysShort = t.daysShort;

        months.forEach((monthName, monthIndex) => {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'annual-month';

            // Título del mes
            let html = `<div class="annual-month-title">${monthName}</div>`;
            html += `<div class="annual-days-grid annual-days-header text-muted">`;
            daysShort.forEach((d, index) => {
                let styleClass = 'annual-day-header-cell';
                if (index === 0) {
                    styleClass += ' text-danger fw-bold'; // Domingo: Rojo
                } else if (index === 6) {
                    styleClass += ' fw-semibold text-secondary'; // Sábado
                }
                html += `<span class="${styleClass}">${d}</span>`;
            });
            html += `</div><div class="annual-days-grid annual-days-body">`;

            // Días del mes
            const firstDay = new Date(year, monthIndex, 1).getDay();
            const totalDays = new Date(year, monthIndex + 1, 0).getDate();

            // Espacios vacíos iniciales
            for (let i = 0; i < firstDay; i++) {
                html += `<span class="annual-empty-cell"></span>`;
            }

            // Números de los días
            const today = getServerNow();
            for (let day = 1; day <= totalDays; day++) {
                const currentDayOfWeek = new Date(year, monthIndex, day).getDay();
                const isToday = day === today.getDate() && monthIndex === today.getMonth() && year === today.getFullYear();
                const isSunday = currentDayOfWeek === 0;
                const dateKey = getDateKey(year, monthIndex, day);

                const eventIds = planningMarks[dateKey] || [];
                const assignedEvents = eventIds.map(id => planningEventsList.find(e => e.id === id)).filter(Boolean);
                const visibleEvents = assignedEvents.slice(0, 4);
                const hasMarks = visibleEvents.length > 0;

                let cellClass = 'annual-day-cell';
                if (isToday) {
                    cellClass += ' annual-today';
                } else if (isSunday) {
                    cellClass += ' text-danger fw-bold annual-sunday';
                }
                if (hasMarks) {
                    cellClass += ' has-planning-marks';
                }

                let styleAttr = '';
                if (hasMarks) {
                    const bg = getPlanningDayBackground(visibleEvents.map(e => e.color));
                    styleAttr = `style="background: ${bg};"`;
                }

                let tooltipText = t.dateTooltip(day, monthName, year);
                if (hasMarks) {
                    tooltipText += ` - ${visibleEvents.map(e => e.title).join(', ')}`;
                }

                html += `<span class="${cellClass}" data-date="${dateKey}" data-year="${year}" data-month="${monthIndex}" data-day="${day}" title="${tooltipText}" ${styleAttr}><span class="annual-day-number">${day}</span></span>`;
            }

            html += `</div>`;
            monthDiv.innerHTML = html;
            container.appendChild(monthDiv);
        });

        // Interacción al hacer clic en los días del calendario anual
        container.querySelectorAll('.annual-day-cell').forEach(cell => {
            cell.addEventListener('click', async (e) => {
                const dateKey = cell.dataset.date;
                const y = parseInt(cell.dataset.year, 10);
                const m = parseInt(cell.dataset.month, 10);
                const d = parseInt(cell.dataset.day, 10);
                const targetDate = new Date(y, m, d);

                if (selectedPlanningEventId) {
                    // Modo marcado: marcar o desmarcar con un solo clic
                    e.stopPropagation();
                    await toggleDatePlanningMark(dateKey, selectedPlanningEventId);
                } else {
                    // Modo navegación normal
                    miniCalendar.gotoDate(targetDate);
                    updateWeekView(targetDate);
                }
            });
        });
    }

    async function toggleDatePlanningMark(dateKey, eventId) {
        const id = Number(eventId);
        const currentList = Array.isArray(planningMarks[dateKey]) ? [...planningMarks[dateKey]] : [];
        const idx = currentList.indexOf(id);

        if (idx !== -1) {
            currentList.splice(idx, 1);
            if (currentList.length === 0) {
                delete planningMarks[dateKey];
            } else {
                planningMarks[dateKey] = currentList;
            }
        } else {
            if (currentList.length >= 4) {
                const feedbackEl = document.getElementById('active-event-name');
                if (feedbackEl) {
                    const origText = feedbackEl.textContent;
                    feedbackEl.textContent = I18N[currentLang].maxEventsPerDay;
                    feedbackEl.classList.add('text-danger');
                    setTimeout(() => {
                        feedbackEl.textContent = origText;
                        feedbackEl.classList.remove('text-danger');
                    }, 2000);
                }
                return;
            }
            currentList.push(id);
            planningMarks[dateKey] = currentList;
        }

        // Actualizar visualmente la celda y los días del evento de forma instantánea
        updateSingleAnnualDayCell(dateKey);
        updatePlanningEventsDayCounts();

        try {
            const res = await fetch('/api/planning-marks/toggle', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ date: dateKey, eventId: id })
            });
            if (res.ok) {
                const data = await res.json();
                if (data.eventIds) {
                    if (data.eventIds.length > 0) {
                        planningMarks[dateKey] = data.eventIds;
                    } else {
                        delete planningMarks[dateKey];
                    }
                    updateSingleAnnualDayCell(dateKey);
                    updatePlanningEventsDayCounts();
                }
            } else {
                const data = await res.json().catch(() => ({}));
                if (data.limitReached) {
                    const feedbackEl = document.getElementById('active-event-name');
                    if (feedbackEl) {
                        feedbackEl.textContent = I18N[currentLang].maxEventsPerDay;
                    }
                }
            }
        } catch (err) {
            console.error('[Agenda] Error alternando marca de planificación:', err);
        }
    }

    function updateSingleAnnualDayCell(dateKey) {
        const cell = document.querySelector(`.annual-day-cell[data-date="${dateKey}"]`);
        if (!cell) return;

        const y = parseInt(cell.dataset.year, 10);
        const m = parseInt(cell.dataset.month, 10);
        const d = parseInt(cell.dataset.day, 10);
        const today = getServerNow();
        const isToday = d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
        const isSunday = new Date(y, m, d).getDay() === 0;

        const eventIds = planningMarks[dateKey] || [];
        const assignedEvents = eventIds.map(id => planningEventsList.find(e => e.id === id)).filter(Boolean);
        const visibleEvents = assignedEvents.slice(0, 4);
        const hasMarks = visibleEvents.length > 0;

        let cellClass = 'annual-day-cell';
        if (isToday) {
            cellClass += ' annual-today';
        } else if (isSunday) {
            cellClass += ' text-danger fw-bold annual-sunday';
        }
        if (hasMarks) {
            cellClass += ' has-planning-marks';
            const bg = getPlanningDayBackground(visibleEvents.map(e => e.color));
            cell.style.background = bg;
        } else {
            cell.style.background = '';
        }
        cell.className = cellClass;

        const t = I18N[currentLang];
        let tooltipText = t.dateTooltip(d, t.months[m], y);
        if (hasMarks) {
            tooltipText += ` - ${visibleEvents.map(e => e.title).join(', ')}`;
        }
        cell.title = tooltipText;

        cell.innerHTML = `<span class="annual-day-number">${d}</span>`;
    }

    renderAnnualCalendar();

    // 4. Funciones de renderizado y fetch de eventos desde la Base de Datos
    const btnRefresh = document.getElementById('btn-refresh');
    const refreshIcon = document.getElementById('refresh-icon');
    const refreshText = document.getElementById('refresh-text');
    const syncTimeLabel = document.getElementById('sync-time-label');
    const syncStatusIcon = document.getElementById('sync-status-icon');

    let currentDataVersion = null;
    let isInitialVersionLoaded = false;
    let reloadPendingOnModalClose = false;
    let consecutiveSyncErrors = 0;

    // Actualiza la etiqueta de estado de la base de datos y detecta cambios de forma resiliente
    async function updateSyncStatusBadge() {
        if (!syncTimeLabel) return;
        const t = I18N[currentLang];
        // Evitar sondeo si la pestaña no está visible o el navegador está sin conexión
        if (typeof document !== 'undefined' && document.hidden) return;
        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            syncTimeLabel.textContent = t.dbOffline;
            if (syncStatusIcon) syncStatusIcon.className = 'bi bi-wifi-off text-warning';
            return;
        }

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 6000);

            const res = await fetch('/api/sync-status', {
                signal: controller.signal,
                headers: { 'Cache-Control': 'no-cache' }
            });
            clearTimeout(timeoutId);

            if (res.ok) {
                consecutiveSyncErrors = 0;
                const data = await res.json();

                // Sincronizar la zona horaria del servidor
                if (data.serverTimeZone) {
                    serverTimeZone = data.serverTimeZone;
                }

                // Actualizar icono y texto de estado
                if (data.isSyncing) {
                    syncTimeLabel.textContent = t.dbSyncing;
                    if (syncStatusIcon) syncStatusIcon.className = 'bi bi-arrow-repeat text-primary';
                } else if (data.lastSync) {
                    const localeCode = currentLang === 'es' ? 'es-ES' : 'en-US';
                    const timeFormatter = new Intl.DateTimeFormat(localeCode, {
                        timeZone: serverTimeZone || undefined,
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: false
                    });
                    const timeStr = timeFormatter.format(new Date(data.lastSync));
                    syncTimeLabel.textContent = t.dbUpToDateWithTime(timeStr);
                    if (syncStatusIcon) syncStatusIcon.className = 'bi bi-database-check text-success';
                    const syncBadge = document.getElementById('sync-info-badge');
                    if (syncBadge) {
                        syncBadge.title = t.dbTooltipTime(timeStr);
                    }
                } else {
                    syncTimeLabel.textContent = t.dbNotSynced;
                    if (syncStatusIcon) syncStatusIcon.className = 'bi bi-database text-secondary';
                }

                // Detección de cambios en los calendarios
                if (data.dataVersion !== undefined) {
                    if (!isInitialVersionLoaded) {
                        currentDataVersion = data.dataVersion;
                        isInitialVersionLoaded = true;
                    } else if (data.dataVersion !== currentDataVersion) {
                        console.log(`[Agenda] Cambio detectado en los calendarios (v${currentDataVersion} -> v${data.dataVersion}).`);
                        currentDataVersion = data.dataVersion;

                        // Si el modal de configuración está abierto, posponer recarga completa
                        const modalEl = document.getElementById('modal-calendars');
                        const isModalOpen = modalEl && modalEl.classList.contains('show');
                        if (isModalOpen) {
                            reloadPendingOnModalClose = true;
                            await fetchRealEvents();
                        } else {
                            console.log('[Agenda] Refrescando la página para mostrar los nuevos cambios...');
                            location.reload();
                        }
                    }
                }
            } else {
                consecutiveSyncErrors++;
                if (consecutiveSyncErrors >= 3 && syncTimeLabel) {
                    syncTimeLabel.textContent = t.dbUnavailable;
                    if (syncStatusIcon) syncStatusIcon.className = 'bi bi-exclamation-triangle text-warning';
                }
            }
        } catch (e) {
            consecutiveSyncErrors++;
            // Manejo silencioso y resiliente de fallos temporales de red o reconexiones del servidor
            if (consecutiveSyncErrors >= 3 && syncTimeLabel) {
                syncTimeLabel.textContent = t.dbReconnecting;
                if (syncStatusIcon) syncStatusIcon.className = 'bi bi-arrow-clockwise text-muted';
            }
        }
    }

    // Escuchar el cierre del modal para aplicar recarga si quedó pendiente
    const modalCalendarEl = document.getElementById('modal-calendars');
    if (modalCalendarEl) {
        modalCalendarEl.addEventListener('hidden.bs.modal', () => {
            if (reloadPendingOnModalClose) {
                reloadPendingOnModalClose = false;
                location.reload();
            }
        });
    }

    // Forzar consulta manual a los calendarios remotos
    async function forceRefreshCalendars() {
        if (!btnRefresh) return;
        const t = I18N[currentLang];
        btnRefresh.disabled = true;
        if (refreshIcon) refreshIcon.classList.add('spin');
        if (refreshText) refreshText.textContent = t.refreshingBtn;
        if (syncTimeLabel) syncTimeLabel.textContent = t.refreshingBtn;

        try {
            const response = await fetch('/api/refresh', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                const result = await response.json();
                console.log('[Agenda] Consulta forzada completada:', result);
                
                if (result.hasChanged) {
                    console.log('[Agenda] Se detectaron cambios durante la actualización. Refrescando página...');
                    location.reload();
                    return;
                }

                // Si no hubo cambios, actualizar la vista y badge en su lugar
                await fetchRealEvents();
                await updateSyncStatusBadge();
            }
        } catch (error) {
            console.warn('[Agenda] Problema temporal al forzar actualización:', error.message || error);
            if (syncTimeLabel) syncTimeLabel.textContent = t.errorRefresh;
        } finally {
            if (refreshIcon) refreshIcon.classList.remove('spin');
            if (refreshText) refreshText.textContent = t.refreshBtn;
            btnRefresh.disabled = false;
        }
    }

    if (btnRefresh) {
        btnRefresh.addEventListener('click', forceRefreshCalendars);
    }

    function renderEvents(events) {
        document.querySelectorAll('.events-list').forEach(el => el.innerHTML = '');
        const now = getServerNow();
        const todayStr = formatLocalDate(now);
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTimeMinutes = currentHours * 60 + currentMinutes;

        // Renderizar eventos en cada día específico
        events.forEach(event => {
            if (weekDates[event.date]) {
                const dayContainer = document.querySelector(`#${weekDates[event.date]} .events-list`);
                if (!dayContainer) return;

                let isFuture = false;
                if (event.date === todayStr) {
                    const [evHours, evMinutes] = (event.time || '00:00').split(':').map(Number);
                    const eventTimeMinutes = evHours * 60 + evMinutes;
                    if (eventTimeMinutes >= currentTimeMinutes) {
                        isFuture = true;
                    }
                }

                const titleStyle = isFuture ? 'fw-bold text-dark' : 'text-body-secondary';

                const eventHtml = `
                    <div class="d-flex align-items-center small py-0 px-1 rounded event-row" style="min-height: 22px;">
                        <span class="fw-bold me-1 fs-6 lh-1" style="color: ${event.color};">|</span>
                        <span class="font-monospace text-secondary me-2 small">${event.time}</span>
                        <span class="text-truncate flex-grow-1 ${titleStyle}" title="${event.title}">${event.title}</span>
                    </div>
                `;
                dayContainer.innerHTML += eventHtml;
            }
        });

        // Completar con renglones visuales vacíos para mantener estructura prolija en los días
        daysIds.forEach(id => {
            const dayContainer = document.querySelector(`#${id} .events-list`);
            if (!dayContainer) return;

            const currentCount = dayContainer.children.length;
            for (let i = currentCount; i < 7; i++) {
                const emptyHtml = `
                    <div class="d-flex align-items-center small py-0 px-1 user-select-none opacity-25 event-placeholder-row" style="min-height: 22px;">
                        <span class="fw-bold me-1 fs-6 lh-1">|</span>
                        <span class="font-monospace text-secondary me-2 small">__:__</span>
                        <span class="text-truncate text-muted">________________________________</span>
                    </div>
                `;
                dayContainer.innerHTML += emptyHtml;
            }
        });

        requestAnimationFrame(syncDayBlockHeights);
    }

    // 5. Gestión de Eventos de Planificación (Persistentes con Color y Título)
    let planningEventsList = [];
    const planningContainer = document.getElementById('general-events-list');
    const planningCountBadge = document.getElementById('events-count-badge');
    const formPlanning = document.getElementById('form-planning-event');
    const modalPlanningEl = document.getElementById('modal-add-planning-event');
    const planningColorInput = document.getElementById('planning-color');
    const planningIdInput = document.getElementById('planning-id');
    const modalPlanningTitleText = document.getElementById('modalPlanningTitleText');
    const modalPlanningIcon = document.getElementById('modalPlanningIcon');
    const btnSubmitPlanningText = document.getElementById('btn-submit-planning-text');
    const btnAddPlanningEvent = document.getElementById('btn-add-planning-event');

    function resetPlanningModal() {
        const t = I18N[currentLang];
        if (formPlanning) formPlanning.reset();
        if (planningIdInput) planningIdInput.value = '';
        if (planningColorInput) planningColorInput.value = '#0d6efd';
        if (modalPlanningTitleText) modalPlanningTitleText.textContent = t.newPlanningTitle;
        if (modalPlanningIcon) modalPlanningIcon.className = 'bi bi-calendar2-plus text-primary';
        if (btnSubmitPlanningText) btnSubmitPlanningText.textContent = t.savePlanningEvent;
    }

    if (btnAddPlanningEvent) {
        btnAddPlanningEvent.addEventListener('click', resetPlanningModal);
    }

    if (modalPlanningEl) {
        modalPlanningEl.addEventListener('hidden.bs.modal', resetPlanningModal);
    }

    // Manejar selección de paleta rápida
    document.querySelectorAll('.quick-color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const chosen = btn.dataset.color;
            if (planningColorInput && chosen) {
                planningColorInput.value = chosen;
            }
        });
    });

    // Barra de selección activa y badge del calendario anual
    const btnDeselectEvent = document.getElementById('btn-deselect-event');
    if (btnDeselectEvent) {
        btnDeselectEvent.addEventListener('click', () => selectPlanningEvent(null));
    }
    const annualMarkingBadge = document.getElementById('annual-marking-badge');
    if (annualMarkingBadge) {
        annualMarkingBadge.style.cursor = 'pointer';
        annualMarkingBadge.addEventListener('click', () => selectPlanningEvent(null));
    }

    function selectPlanningEvent(id) {
        if (selectedPlanningEventId === id) {
            selectedPlanningEventId = null;
        } else {
            selectedPlanningEventId = id;
        }

        const activeBar = document.getElementById('planning-active-bar');
        const activeColorBox = document.getElementById('active-event-indicator');
        const activeName = document.getElementById('active-event-name');
        const annualBadge = document.getElementById('annual-marking-badge');
        const annualEventName = document.getElementById('annual-marking-event-name');

        if (selectedPlanningEventId) {
            const ev = planningEventsList.find(e => e.id === selectedPlanningEventId);
            if (ev) {
                if (activeBar) activeBar.classList.remove('d-none');
                if (activeColorBox) activeColorBox.style.backgroundColor = ev.color;
                if (activeName) activeName.textContent = I18N[currentLang].markingWith(ev.title);

                if (annualBadge) {
                    annualBadge.classList.remove('d-none');
                    annualBadge.classList.add('d-inline-flex');
                    annualBadge.style.backgroundColor = ev.color;
                }
                if (annualEventName) annualEventName.textContent = ev.title;

                document.body.classList.add('marking-mode-active');
                document.documentElement.style.setProperty('--active-mark-color', ev.color);
            } else {
                selectedPlanningEventId = null;
            }
        }

        if (!selectedPlanningEventId) {
            if (activeBar) activeBar.classList.add('d-none');
            if (annualBadge) {
                annualBadge.classList.add('d-none');
                annualBadge.classList.remove('d-inline-flex');
            }
            document.body.classList.remove('marking-mode-active');
            document.documentElement.style.removeProperty('--active-mark-color');
        }

        renderPlanningEvents();
    }

    async function loadPlanningEvents() {
        try {
            const res = await fetch('/api/planning-events');
            if (res.ok) {
                planningEventsList = await res.json();
                renderPlanningEvents();
                renderAnnualCalendar();
            }
        } catch (err) {
            console.warn('[Agenda] Error cargando eventos de planificación:', err);
        }
    }

    function countDaysForPlanningEvent(eventId) {
        const id = Number(eventId);
        let count = 0;
        for (const date in planningMarks) {
            if (Array.isArray(planningMarks[date]) && planningMarks[date].includes(id)) {
                count++;
            }
        }
        return count;
    }

    function updatePlanningEventsDayCounts() {
        if (!planningContainer) return;
        const t = I18N[currentLang];
        planningContainer.querySelectorAll('.planning-event-days-badge[data-event-days-id]').forEach(badge => {
            const id = Number(badge.dataset.eventDaysId);
            const count = countDaysForPlanningEvent(id);
            badge.textContent = `${count} ${t.dayUnit(count)}`;
            badge.title = t.dayMarkedTooltip(count);
            if (count > 0) {
                badge.classList.add('has-days');
            } else {
                badge.classList.remove('has-days');
            }
        });
    }

    function renderPlanningEvents() {
        if (!planningContainer) return;
        planningContainer.innerHTML = '';
        const t = I18N[currentLang];

        if (planningEventsList.length === 0) {
            planningContainer.innerHTML = `
                <div class="text-center text-muted small py-3 px-2">
                    <i class="bi bi-calendar-check d-block fs-5 mb-1 opacity-50"></i>
                    <span>${t.noPlanningEvents}</span>
                    <button type="button" class="btn btn-link btn-sm p-0 d-block mx-auto mt-1 text-decoration-none fw-semibold" data-bs-toggle="modal" data-bs-target="#modal-add-planning-event">
                        ${t.addPlanningEventLink}
                    </button>
                </div>
            `;
            return;
        }

        planningEventsList.forEach(ev => {
            const isSelected = selectedPlanningEventId === ev.id;
            const daysCount = countDaysForPlanningEvent(ev.id);
            const itemEl = document.createElement('div');
            itemEl.className = `planning-event-item ${isSelected ? 'planning-event-selected' : ''}`;
            itemEl.dataset.id = ev.id;
            itemEl.setAttribute('role', 'button');
            itemEl.setAttribute('title', isSelected ? t.clickToDeselect : t.clickToSelect);
            itemEl.innerHTML = `
                <span class="planning-color-box flex-shrink-0" style="background-color: ${ev.color};" title="Color: ${ev.color}"></span>
                <div class="d-flex align-items-center text-truncate flex-grow-1 me-1">
                    <span class="fw-medium text-dark text-truncate small" title="${ev.title}">${ev.title}</span>
                </div>
                <span class="planning-event-days-badge ${daysCount > 0 ? 'has-days' : ''} flex-shrink-0" data-event-days-id="${ev.id}" title="${t.dayMarkedTooltip(daysCount)}">
                    ${daysCount} ${t.dayUnit(daysCount)}
                </span>
                ${isSelected ? `<span class="badge bg-primary text-white py-0 px-1 fs-8 flex-shrink-0 ms-1"><i class="bi bi-brush-fill me-1" style="font-size:0.6rem;"></i>${t.markingBadge}</span>` : ''}
                <div class="d-flex align-items-center gap-1 flex-shrink-0 ms-1">
                    <button type="button" class="btn btn-sm btn-outline-primary border-0 p-0 px-1 opacity-75 hover-opacity-100 btn-edit-planning" title="${t.editEvent}">
                        <i class="bi bi-pencil" style="font-size: 0.75rem;"></i>
                    </button>
                    <button type="button" class="btn btn-sm btn-outline-danger border-0 p-0 px-1 opacity-75 hover-opacity-100 btn-delete-planning" title="${t.deleteEvent}">
                        <i class="bi bi-trash3" style="font-size: 0.75rem;"></i>
                    </button>
                </div>
            `;

            // Clic para alternar selección
            itemEl.addEventListener('click', (e) => {
                if (e.target.closest('.btn-edit-planning') || e.target.closest('.btn-delete-planning')) {
                    return;
                }
                selectPlanningEvent(ev.id);
            });

            const editBtn = itemEl.querySelector('.btn-edit-planning');
            if (editBtn) {
                editBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    editPlanningEvent(ev.id);
                });
            }

            const delBtn = itemEl.querySelector('.btn-delete-planning');
            if (delBtn) {
                delBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deletePlanningEvent(ev.id);
                });
            }

            planningContainer.appendChild(itemEl);
        });

        // Renglones vacíos si hay pocos items para mantener estética impecable
        for (let i = planningEventsList.length; i < 4; i++) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'd-flex align-items-center gap-2 py-1 px-2 user-select-none opacity-25';
            emptyEl.innerHTML = `
                <span class="planning-color-box flex-shrink-0 bg-secondary opacity-50"></span>
                <span class="text-muted small">________________________</span>
            `;
            planningContainer.appendChild(emptyEl);
        }
    }

    window.editPlanningEvent = function(id) {
        const ev = planningEventsList.find(e => e.id === id);
        if (!ev) return;

        const t = I18N[currentLang];
        if (planningIdInput) planningIdInput.value = ev.id;
        const titleEl = document.getElementById('planning-title');
        if (titleEl) titleEl.value = ev.title;
        if (planningColorInput) planningColorInput.value = ev.color;

        if (modalPlanningTitleText) modalPlanningTitleText.textContent = t.editPlanningTitle;
        if (modalPlanningIcon) modalPlanningIcon.className = 'bi bi-pencil-square text-primary';
        if (btnSubmitPlanningText) btnSubmitPlanningText.textContent = t.updatePlanningEvent;

        if (modalPlanningEl && window.bootstrap && window.bootstrap.Modal) {
            bootstrap.Modal.getOrCreateInstance(modalPlanningEl).show();
        }
    };

    window.deletePlanningEvent = async function(id) {
        try {
            const res = await fetch(`/api/planning-events/${id}`, { method: 'DELETE' });
            if (res.ok) {
                planningEventsList = planningEventsList.filter(e => e.id !== id);
                if (selectedPlanningEventId === id) {
                    selectPlanningEvent(null);
                }
                // Limpiar marcas locales asociadas a este evento
                for (const date in planningMarks) {
                    if (Array.isArray(planningMarks[date])) {
                        planningMarks[date] = planningMarks[date].filter(evId => evId !== id);
                        if (planningMarks[date].length === 0) {
                            delete planningMarks[date];
                        }
                    }
                }
                renderPlanningEvents();
                renderAnnualCalendar();
            }
        } catch (err) {
            console.error('[Agenda] Error eliminando evento de planificación:', err);
        }
    };

    if (formPlanning) {
        formPlanning.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titleEl = document.getElementById('planning-title');
            const colorEl = document.getElementById('planning-color');
            const editingId = planningIdInput ? planningIdInput.value : '';

            const payload = {
                title: titleEl.value.trim(),
                color: colorEl.value || '#0d6efd'
            };

            try {
                const url = editingId ? `/api/planning-events/${editingId}` : '/api/planning-events';
                const method = editingId ? 'PUT' : 'POST';

                const res = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (res.ok) {
                    const data = await res.json();
                    if (data.event) {
                        if (editingId) {
                            const idx = planningEventsList.findIndex(ev => ev.id === Number(editingId));
                            if (idx !== -1) {
                                planningEventsList[idx] = data.event;
                            }
                        } else {
                            planningEventsList.push(data.event);
                        }
                        renderPlanningEvents();
                        renderAnnualCalendar();

                        if (selectedPlanningEventId && data.event && data.event.id === selectedPlanningEventId) {
                            // Actualizar colores del banner de marcado
                            selectPlanningEvent(selectedPlanningEventId);
                        }
                    }
                    resetPlanningModal();

                    // Cerrar el modal
                    if (modalPlanningEl && window.bootstrap && window.bootstrap.Modal) {
                        const modalInstance = bootstrap.Modal.getInstance(modalPlanningEl);
                        if (modalInstance) modalInstance.hide();
                    }
                }
            } catch (err) {
                console.error('[Agenda] Error guardando evento de planificación:', err);
            }
        });
    }

    async function fetchRealEvents() {
        if (!currentSunday || !currentSaturday) return;
        const startStr = formatLocalDate(currentSunday);
        const endStr = formatLocalDate(currentSaturday);
        const t = I18N[currentLang];

        document.querySelectorAll('.events-list').forEach(el => {
            el.innerHTML = `
                <div class="d-flex justify-content-center align-items-center py-3 text-muted small">
                    <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span class="visually-hidden">${t.loadingEvents}</span>
                    </div>
                    ${t.loadingEvents}
                </div>
            `;
        });

        try {
            const response = await fetch('/api/events', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ start_date: startStr, end_date: endStr })
            });
            if (response.ok) {
                const data = await response.json();
                renderEvents(data);
            }
        } catch (error) {
            console.warn('[Agenda] Problema temporal al conectar con la base de datos de eventos:', error.message || error);
            document.querySelectorAll('.events-list').forEach(el => {
                el.innerHTML = `<div class="text-secondary small text-center py-2"><i class="bi bi-clock-history me-1"></i>${t.reconnectingEvents}</div>`;
            });
        }
    }

    // 5. Gestión de Calendarios mediante la API
    const modalEl = document.getElementById('modal-calendars');
    const form = document.getElementById('form-calendar');
    const list = document.getElementById('list-calendars');
    const calIdInput = document.getElementById('cal-id');
    const btnSubmitCal = document.getElementById('btn-submit-cal');
    const btnSubmitCalText = document.getElementById('btn-submit-cal-text');
    const btnSubmitCalIcon = document.getElementById('btn-submit-cal-icon');
    const btnCancelEditCal = document.getElementById('btn-cancel-edit-cal');
    let currentCalendarsList = [];

    function resetCalendarForm() {
        const t = I18N[currentLang];
        if (form) form.reset();
        if (calIdInput) calIdInput.value = '';
        const colorInput = document.getElementById('cal-color');
        if (colorInput) colorInput.value = '#3b82f6';
        if (btnSubmitCal) {
            btnSubmitCal.className = 'btn btn-success fw-semibold flex-grow-1 d-inline-flex align-items-center justify-content-center gap-2';
        }
        if (btnSubmitCalText) btnSubmitCalText.textContent = t.btnAddCal;
        if (btnSubmitCalIcon) btnSubmitCalIcon.className = 'bi bi-plus-circle-fill';
        if (btnCancelEditCal) btnCancelEditCal.classList.add('d-none');
    }

    if (btnCancelEditCal) {
        btnCancelEditCal.addEventListener('click', resetCalendarForm);
    }

    if (modalEl) {
        modalEl.addEventListener('hidden.bs.modal', resetCalendarForm);
    }

    function getBsModal() {
        if (window.bootstrap && window.bootstrap.Modal && modalEl) {
            return bootstrap.Modal.getOrCreateInstance(modalEl);
        }
        return null;
    }

    async function loadCalendarList() {
        try {
            const response = await fetch('/api/calendars');
            if (response.ok) {
                const calendars = await response.json();
                currentCalendarsList = calendars;
                renderCalendarList(calendars);
            }
        } catch (error) {
            console.error("Error al cargar la lista de calendarios:", error);
        }
    }

    function renderCalendarList(calendars) {
        if (!list) return;
        list.innerHTML = '';
        const t = I18N[currentLang];
        if (calendars.length === 0) {
            list.innerHTML = `<li class="list-group-item text-center text-muted small py-3">${t.noCalendarsConfigured}</li>`;
            return;
        }

        calendars.forEach((cal) => {
            list.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center p-2 mb-1 border rounded bg-white">
                    <div class="d-flex align-items-center gap-2 text-truncate me-2">
                        <span class="rounded-circle d-inline-block flex-shrink-0" style="width: 12px; height: 12px; background-color: ${cal.color}"></span>
                        <span class="fw-semibold text-truncate small">${cal.title}</span>
                    </div>
                    <div class="d-flex align-items-center gap-1 flex-shrink-0">
                        <button onclick="editCalendar(${cal.id})" class="btn btn-outline-primary btn-sm border-0 py-0 px-2" title="${t.editCalendar}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button onclick="deleteCalendar(${cal.id})" class="btn btn-outline-danger btn-sm border-0 py-0 px-2" title="${t.deleteCalendar}">
                            <i class="bi bi-trash3"></i>
                        </button>
                    </div>
                </li>`;
        });
    }

    window.editCalendar = function(id) {
        const cal = currentCalendarsList.find(c => c.id === id);
        if (!cal) return;
        const t = I18N[currentLang];

        if (calIdInput) calIdInput.value = cal.id;
        const titleInput = document.getElementById('cal-title');
        const colorInput = document.getElementById('cal-color');
        const urlInput = document.getElementById('cal-url');

        if (titleInput) titleInput.value = cal.title;
        if (colorInput) colorInput.value = cal.color;
        if (urlInput) urlInput.value = cal.url;

        if (btnSubmitCal) {
            btnSubmitCal.className = 'btn btn-primary fw-semibold flex-grow-1 d-inline-flex align-items-center justify-content-center gap-2';
        }
        if (btnSubmitCalText) btnSubmitCalText.textContent = t.btnUpdateCal;
        if (btnSubmitCalIcon) btnSubmitCalIcon.className = 'bi bi-check-circle-fill';
        if (btnCancelEditCal) btnCancelEditCal.classList.remove('d-none');

        if (titleInput) titleInput.focus();
    };

    window.deleteCalendar = async function(id) {
        try {
            const response = await fetch(`/api/calendars/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
                if (calIdInput && Number(calIdInput.value) === id) {
                    resetCalendarForm();
                }
                loadCalendarList();
                fetchRealEvents();
            }
        } catch (error) {
            console.error("Error al eliminar el calendario:", error);
        }
    };

    const btnSettings = document.getElementById('btn-settings');
    if (btnSettings) {
        btnSettings.addEventListener('click', () => {
            const bsModal = getBsModal();
            if (bsModal) {
                bsModal.show();
            }
            loadCalendarList();
        });
    }

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const titleInput = document.getElementById('cal-title');
            const colorInput = document.getElementById('cal-color');
            const urlInput = document.getElementById('cal-url');
            const editingCalId = calIdInput ? calIdInput.value : '';

            const calPayload = {
                title: titleInput.value.trim(),
                color: colorInput.value,
                url: urlInput.value.trim()
            };

            try {
                const url = editingCalId ? `/api/calendars/${editingCalId}` : '/api/calendars';
                const method = editingCalId ? 'PUT' : 'POST';

                const response = await fetch(url, {
                    method,
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(calPayload)
                });

                if (response.ok) {
                    resetCalendarForm();
                    loadCalendarList();
                    fetchRealEvents();
                }
            } catch (error) {
                console.error("Error al guardar el calendario:", error);
            }
        });
    }

    // 6. Sincronización milimétrica del tamaño de todos los bloques (Lunes a Sábado, Mes, Planificación y Domingo)
    function syncDayBlockHeights() {
        const monday = document.getElementById('monday');
        const sunday = document.getElementById('sunday');
        const eventsBlock = document.getElementById('events-block');
        const miniCalendarCard = document.getElementById('mini-calendar-card');
        if (!monday) return;

        if (window.innerWidth < 768) {
            document.querySelectorAll('.day-block').forEach(el => {
                el.style.height = '220px';
                el.style.flex = '0 0 220px';
                el.style.maxHeight = '220px';
                el.style.minHeight = '220px';
            });
            if (miniCalendar) miniCalendar.updateSize();
            return;
        }

        // Limpiar estilos inline en todos los bloques para que el cálculo flex actúe de manera unificada
        document.querySelectorAll('.day-block').forEach(el => {
            el.style.height = '';
            el.style.flex = '';
            el.style.maxHeight = '';
            el.style.minHeight = '';
        });

        // En pantallas medianas y grandes, sincronizar Mes, Planificación y Domingo exactamente a la altura de los días
        const mondayHeight = Math.round(monday.getBoundingClientRect().height);
        if (mondayHeight > 60) {
            [miniCalendarCard, eventsBlock, sunday].forEach(el => {
                if (el) {
                    el.style.height = `${mondayHeight}px`;
                    el.style.flex = `0 0 ${mondayHeight}px`;
                    el.style.maxHeight = `${mondayHeight}px`;
                    el.style.minHeight = `${mondayHeight}px`;
                }
            });
        }

        if (miniCalendar) {
            miniCalendar.updateSize();
        }
    }

    // 7. Funciones de internacionalización y cambio dinámico de idioma
    function applyLanguageToStaticElements() {
        const t = I18N[currentLang];
        document.title = t.pageTitle;
        document.documentElement.lang = currentLang;

        // Header
        const refreshText = document.getElementById('refresh-text');
        if (refreshText) refreshText.textContent = t.refreshBtn;
        const btnRefreshEl = document.getElementById('btn-refresh');
        if (btnRefreshEl) btnRefreshEl.title = t.refreshTooltip;

        const settingsText = document.getElementById('settings-text');
        if (settingsText) settingsText.textContent = t.settingsBtn;

        // Columna 1: Calendario Anual
        const annualTitle = document.getElementById('annual-calendar-title');
        if (annualTitle) annualTitle.textContent = t.annualCalendarTitle;
        const annualMarkingBadgeEl = document.getElementById('annual-marking-badge');
        if (annualMarkingBadgeEl) annualMarkingBadgeEl.title = t.markingModeTooltip;

        // Columna 2: Calendario Mensual
        const monthlyTitle = document.getElementById('monthly-calendar-title');
        if (monthlyTitle) monthlyTitle.textContent = t.monthlyCalendarTitle;
        const btnMiniTodayEl = document.getElementById('btn-mini-today');
        if (btnMiniTodayEl) {
            btnMiniTodayEl.textContent = t.todayBtn;
            btnMiniTodayEl.title = t.todayBtnTooltip;
        }

        // Bloque de Planificación
        const planningTitle = document.getElementById('planning-block-title');
        if (planningTitle) planningTitle.textContent = t.planningTitle;
        const btnAddPlanningText = document.getElementById('btn-add-planning-text');
        if (btnAddPlanningText) btnAddPlanningText.textContent = t.addPlanningBtn;
        const btnAddPlanning = document.getElementById('btn-add-planning-event');
        if (btnAddPlanning) btnAddPlanning.title = t.addPlanningTooltip;
        const btnDeselect = document.getElementById('btn-deselect-event');
        if (btnDeselect) btnDeselect.title = t.deselectEventTooltip;

        // Días de la semana
        const labelSunday = document.getElementById('label-sunday');
        if (labelSunday) labelSunday.textContent = t.daysOfWeek.sunday;
        const labelMonday = document.getElementById('label-monday');
        if (labelMonday) labelMonday.textContent = t.daysOfWeek.monday;
        const labelTuesday = document.getElementById('label-tuesday');
        if (labelTuesday) labelTuesday.textContent = t.daysOfWeek.tuesday;
        const labelWednesday = document.getElementById('label-wednesday');
        if (labelWednesday) labelWednesday.textContent = t.daysOfWeek.wednesday;
        const labelThursday = document.getElementById('label-thursday');
        if (labelThursday) labelThursday.textContent = t.daysOfWeek.thursday;
        const labelFriday = document.getElementById('label-friday');
        if (labelFriday) labelFriday.textContent = t.daysOfWeek.friday;
        const labelSaturday = document.getElementById('label-saturday');
        if (labelSaturday) labelSaturday.textContent = t.daysOfWeek.saturday;

        // Modal Calendarios
        const modalCalTitle = document.getElementById('modal-calendars-title');
        if (modalCalTitle) modalCalTitle.textContent = t.modalCalendarsTitle;
        const lblCalTitle = document.getElementById('lbl-cal-title');
        if (lblCalTitle) lblCalTitle.textContent = t.calTitleLabel;
        const inputCalTitle = document.getElementById('cal-title');
        if (inputCalTitle) inputCalTitle.placeholder = t.calTitlePlaceholder;
        const lblCalColor = document.getElementById('lbl-cal-color');
        if (lblCalColor) lblCalColor.textContent = t.calColorLabel;
        const inputCalColor = document.getElementById('cal-color');
        if (inputCalColor) inputCalColor.title = t.calColorTitle;
        const lblCalUrl = document.getElementById('lbl-cal-url');
        if (lblCalUrl) lblCalUrl.textContent = t.calUrlLabel;
        const inputCalUrl = document.getElementById('cal-url');
        if (inputCalUrl) inputCalUrl.placeholder = t.calUrlPlaceholder;
        const btnSubmitCalText = document.getElementById('btn-submit-cal-text');
        const calIdInput = document.getElementById('cal-id');
        if (btnSubmitCalText) {
            btnSubmitCalText.textContent = (calIdInput && calIdInput.value) ? t.btnUpdateCal : t.btnAddCal;
        }
        const btnCancelCalText = document.getElementById('btn-cancel-cal-text');
        if (btnCancelCalText) btnCancelCalText.textContent = t.btnCancel;
        const lblActiveCals = document.getElementById('lbl-active-calendars');
        if (lblActiveCals) lblActiveCals.textContent = t.activeCalendarsTitle;
        const btnCloseModalCal = document.getElementById('btn-close-modal-cal');
        if (btnCloseModalCal) btnCloseModalCal.textContent = t.btnClose;

        // Modal Planificación
        const planningIdInput = document.getElementById('planning-id');
        const modalPlanningTitle = document.getElementById('modalPlanningTitleText');
        if (modalPlanningTitle) {
            modalPlanningTitle.textContent = (planningIdInput && planningIdInput.value) ? t.editPlanningTitle : t.newPlanningTitle;
        }
        const lblPlanningTitle = document.getElementById('lbl-planning-title');
        if (lblPlanningTitle) lblPlanningTitle.textContent = t.planningTitleLabel;
        const inputPlanningTitle = document.getElementById('planning-title');
        if (inputPlanningTitle) inputPlanningTitle.placeholder = t.planningTitlePlaceholder;
        const lblPlanningColor = document.getElementById('lbl-planning-color');
        if (lblPlanningColor) lblPlanningColor.textContent = t.planningColorLabel;
        const inputPlanningColor = document.getElementById('planning-color');
        if (inputPlanningColor) inputPlanningColor.title = t.planningColorTitle;
        const lblQuickPalette = document.getElementById('lbl-quick-palette');
        if (lblQuickPalette) lblQuickPalette.textContent = t.quickPaletteLabel;
        const btnCancelPlanning = document.getElementById('btn-cancel-planning');
        if (btnCancelPlanning) btnCancelPlanning.textContent = t.btnCancel;
        const btnSubmitPlanningText = document.getElementById('btn-submit-planning-text');
        if (btnSubmitPlanningText) {
            btnSubmitPlanningText.textContent = (planningIdInput && planningIdInput.value) ? t.updatePlanningEvent : t.savePlanningEvent;
        }
    }

    function setLanguage(newLang) {
        if (newLang !== 'es' && newLang !== 'en') return;
        currentLang = newLang;
        try {
            localStorage.setItem('agenda_language', currentLang);
        } catch (e) {
            console.warn('[Agenda] Could not save language preference:', e);
        }

        // Actualizar apariencia de los botones del selector
        const btnEs = document.getElementById('btn-lang-es');
        const btnEn = document.getElementById('btn-lang-en');
        if (btnEs && btnEn) {
            if (currentLang === 'es') {
                btnEs.classList.add('active');
                btnEn.classList.remove('active');
            } else {
                btnEn.classList.add('active');
                btnEs.classList.remove('active');
            }
        }

        // Aplicar textos estáticos
        applyLanguageToStaticElements();

        // Actualizar FullCalendar
        if (miniCalendar) {
            miniCalendar.setOption('locale', currentLang);
        }

        // Re-renderizar componentes dinámicos
        renderAnnualCalendar();
        renderPlanningEvents();
        renderCalendarList(currentCalendarsList);
        if (currentSunday) {
            updateWeekView(currentSunday);
        }
        updateSyncStatusBadge();
    }

    // Configurar listeners para selector de idioma
    const btnLangEs = document.getElementById('btn-lang-es');
    const btnLangEn = document.getElementById('btn-lang-en');
    if (btnLangEs) {
        btnLangEs.addEventListener('click', () => setLanguage('es'));
    }
    if (btnLangEn) {
        btnLangEn.addEventListener('click', () => setLanguage('en'));
    }

    // Carga inicial
    setLanguage(currentLang);
    updateWeekView(getServerNow());
    loadCalendarList();
    loadPlanningEvents();
    loadPlanningMarks();
    updateSyncStatusBadge();
    setTimeout(syncDayBlockHeights, 50);

    // Observador de cambio de tamaño para mantener simetría absoluta
    window.addEventListener('resize', () => {
        syncDayBlockHeights();
        if (miniCalendar) miniCalendar.updateSize();
    });
    const mondayEl = document.getElementById('monday');
    if (window.ResizeObserver && mondayEl && mondayEl.parentElement) {
        new ResizeObserver(() => {
            syncDayBlockHeights();
            if (miniCalendar) miniCalendar.updateSize();
        }).observe(mondayEl.parentElement);
    }

    // Comprobar sincronización y detectar cambios automáticamente cada 10 segundos
    setInterval(updateSyncStatusBadge, 10000);

    // Cuando el usuario regresa a la pestaña activa, comprobar inmediatamente el estado
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            updateSyncStatusBadge();
            syncDayBlockHeights();
        }
    });

    // Detección de cambio de día a medianoche para actualizar el resaltado de hoy
    let lastCheckedDay = getServerNow().getDate();
    setInterval(() => {
        const currentDay = getServerNow().getDate();
        if (currentDay !== lastCheckedDay) {
            lastCheckedDay = currentDay;
            console.log('[Agenda] Cambio de día detectado según el servidor. Refrescando interfaz...');
            location.reload();
        }
    }, 30000);
});
