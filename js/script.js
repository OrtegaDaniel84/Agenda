document.addEventListener('DOMContentLoaded', function() {
    // Variables globales para la semana actual en vista
    let currentSunday, currentSaturday, weekDates = {};
    const daysIds = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // Función auxiliar para formatear fechas a YYYY-MM-DD en hora local
    function formatLocalDate(d) {
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
        locale: 'es',
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
            const today = new Date();
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
        const formatOpt = { day: 'numeric', month: 'short' };
        const formatOptYear = { day: 'numeric', month: 'short', year: 'numeric' };
        const labelEl = document.getElementById('current-date-label');
        if (labelEl) {
            labelEl.innerText =
                `Semana: ${currentSunday.toLocaleDateString('es-ES', formatOpt)} - ${currentSaturday.toLocaleDateString('es-ES', formatOptYear)}`;
        }

        weekDates = {};
        const todayFormatted = formatLocalDate(new Date());

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

    // 3. Vista Anual Estática (12 Meses)
    function renderAnnualCalendar() {
        const container = document.getElementById('annual-calendar');
        if (!container) return;
        container.innerHTML = '';

        const year = new Date().getFullYear();
        const yearBadge = document.getElementById('annual-year-badge');
        if (yearBadge) {
            yearBadge.innerText = year;
        }

        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const daysShort = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

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
            const today = new Date();
            for (let day = 1; day <= totalDays; day++) {
                const currentDayOfWeek = new Date(year, monthIndex, day).getDay();
                const isToday = day === today.getDate() && monthIndex === today.getMonth() && year === today.getFullYear();
                const isSunday = currentDayOfWeek === 0;

                let cellClass = 'annual-day-cell';
                if (isToday) {
                    cellClass += ' annual-today';
                } else if (isSunday) {
                    cellClass += ' text-danger fw-bold annual-sunday';
                }

                html += `<span class="${cellClass}" data-year="${year}" data-month="${monthIndex}" data-day="${day}" title="${day} de ${monthName} de ${year}">${day}</span>`;
            }

            html += `</div>`;
            monthDiv.innerHTML = html;
            container.appendChild(monthDiv);
        });

        // Permitir hacer clic en cualquier día del calendario anual para ir a esa semana
        container.querySelectorAll('.annual-day-cell').forEach(cell => {
            cell.addEventListener('click', () => {
                const y = parseInt(cell.dataset.year, 10);
                const m = parseInt(cell.dataset.month, 10);
                const d = parseInt(cell.dataset.day, 10);
                const targetDate = new Date(y, m, d);
                miniCalendar.gotoDate(targetDate);
                updateWeekView(targetDate);
            });
        });
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
        // Evitar sondeo si la pestaña no está visible o el navegador está sin conexión
        if (typeof document !== 'undefined' && document.hidden) return;
        if (typeof navigator !== 'undefined' && navigator.onLine === false) {
            syncTimeLabel.textContent = 'Sin conexión';
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

                // Actualizar icono y texto de estado
                if (data.isSyncing) {
                    syncTimeLabel.textContent = 'Actualizando base de datos...';
                    if (syncStatusIcon) syncStatusIcon.className = 'bi bi-arrow-repeat text-primary';
                } else if (data.lastSync) {
                    const syncDate = new Date(data.lastSync);
                    const hours = String(syncDate.getHours()).padStart(2, '0');
                    const minutes = String(syncDate.getMinutes()).padStart(2, '0');
                    syncTimeLabel.textContent = `BD al día (${hours}:${minutes})`;
                    if (syncStatusIcon) syncStatusIcon.className = 'bi bi-database-check text-success';
                } else {
                    syncTimeLabel.textContent = 'BD sin sincronizar';
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
                    syncTimeLabel.textContent = 'BD no disponible';
                    if (syncStatusIcon) syncStatusIcon.className = 'bi bi-exclamation-triangle text-warning';
                }
            }
        } catch (e) {
            consecutiveSyncErrors++;
            // Manejo silencioso y resiliente de fallos temporales de red o reconexiones del servidor
            if (consecutiveSyncErrors >= 3 && syncTimeLabel) {
                syncTimeLabel.textContent = 'Reconectando...';
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
        btnRefresh.disabled = true;
        if (refreshIcon) refreshIcon.classList.add('spin');
        if (refreshText) refreshText.textContent = 'Consultando...';
        if (syncTimeLabel) syncTimeLabel.textContent = 'Consultando calendarios...';

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
            if (syncTimeLabel) syncTimeLabel.textContent = 'Error al consultar';
        } finally {
            if (refreshIcon) refreshIcon.classList.remove('spin');
            if (refreshText) refreshText.textContent = 'Actualizar';
            btnRefresh.disabled = false;
        }
    }

    if (btnRefresh) {
        btnRefresh.addEventListener('click', forceRefreshCalendars);
    }

    function renderEvents(events) {
        document.querySelectorAll('.events-list').forEach(el => el.innerHTML = '');
        const now = new Date();
        const todayStr = formatLocalDate(now);
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTimeMinutes = currentHours * 60 + currentMinutes;

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

        // Completar con renglones visuales vacíos para mantener estructura prolija
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

    async function fetchRealEvents() {
        if (!currentSunday || !currentSaturday) return;
        const startStr = formatLocalDate(currentSunday);
        const endStr = formatLocalDate(currentSaturday);

        document.querySelectorAll('.events-list').forEach(el => {
            el.innerHTML = `
                <div class="d-flex justify-content-center align-items-center py-3 text-muted small">
                    <div class="spinner-border spinner-border-sm text-primary me-2" role="status">
                        <span class="visually-hidden">Cargando...</span>
                    </div>
                    Cargando eventos...
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
                el.innerHTML = '<div class="text-secondary small text-center py-2"><i class="bi bi-clock-history me-1"></i>Reconectando eventos...</div>';
            });
        }
    }

    // 5. Gestión de Calendarios mediante la API
    const modalEl = document.getElementById('modal-calendars');
    const form = document.getElementById('form-calendar');
    const list = document.getElementById('list-calendars');

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
                renderCalendarList(calendars);
            }
        } catch (error) {
            console.error("Error al cargar la lista de calendarios:", error);
        }
    }

    function renderCalendarList(calendars) {
        if (!list) return;
        list.innerHTML = '';
        if (calendars.length === 0) {
            list.innerHTML = `<li class="list-group-item text-center text-muted small py-3">No hay calendarios configurados aún</li>`;
            return;
        }

        calendars.forEach((cal) => {
            list.innerHTML += `
                <li class="list-group-item d-flex justify-content-between align-items-center p-2 mb-1 border rounded bg-white">
                    <div class="d-flex align-items-center gap-2 text-truncate me-2">
                        <span class="rounded-circle d-inline-block flex-shrink-0" style="width: 12px; height: 12px; background-color: ${cal.color}"></span>
                        <span class="fw-semibold text-truncate small">${cal.title}</span>
                    </div>
                    <button onclick="deleteCalendar(${cal.id})" class="btn btn-outline-danger btn-sm border-0 py-0 px-2" title="Eliminar calendario">
                        <i class="bi bi-trash3"></i>
                    </button>
                </li>`;
        });
    }

    window.deleteCalendar = async function(id) {
        try {
            const response = await fetch(`/api/calendars/${id}`, {
                method: 'DELETE'
            });
            if (response.ok) {
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

            const newCal = {
                title: titleInput.value.trim(),
                color: colorInput.value,
                url: urlInput.value.trim()
            };

            try {
                const response = await fetch('/api/calendars', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newCal)
                });

                if (response.ok) {
                    form.reset();
                    colorInput.value = "#3b82f6";
                    loadCalendarList();
                    fetchRealEvents();
                }
            } catch (error) {
                console.error("Error al guardar el calendario:", error);
            }
        });
    }

    // 6. Sincronización milimétrica del tamaño de los 7 bloques de días
    function syncDayBlockHeights() {
        const monday = document.getElementById('monday');
        const sunday = document.getElementById('sunday');
        if (!monday || !sunday) return;

        if (window.innerWidth < 768) {
            document.querySelectorAll('.day-block').forEach(el => {
                el.style.height = '220px';
                el.style.flex = '0 0 220px';
            });
            return;
        }

        // En pantallas medianas y grandes, Sunday ocupa limpiamente el espacio restante de la columna 2
        sunday.style.height = '';
        sunday.style.maxHeight = 'none';
        sunday.style.flex = '1 1 auto';
    }

    // Carga inicial
    updateWeekView(new Date());
    loadCalendarList();
    updateSyncStatusBadge();
    setTimeout(syncDayBlockHeights, 50);

    // Observador de cambio de tamaño para mantener simetría absoluta
    window.addEventListener('resize', syncDayBlockHeights);
    const mondayEl = document.getElementById('monday');
    if (window.ResizeObserver && mondayEl && mondayEl.parentElement) {
        new ResizeObserver(syncDayBlockHeights).observe(mondayEl.parentElement);
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
    let lastCheckedDay = new Date().getDate();
    setInterval(() => {
        const currentDay = new Date().getDate();
        if (currentDay !== lastCheckedDay) {
            lastCheckedDay = currentDay;
            console.log('[Agenda] Cambio de día detectado. Refrescando interfaz...');
            location.reload();
        }
    }, 30000);
});
