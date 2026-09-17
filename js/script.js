document.addEventListener('DOMContentLoaded', function() {
    // Variables globales para la semana actual en vista
    let currentSunday, currentSaturday, weekDates = {};
    const daysIds = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    // 1. Inicializar Mini Calendario con interactividad
    var miniCalendarEl = document.getElementById('mini-calendar');
    var miniCalendar = new FullCalendar.Calendar(miniCalendarEl, {
        initialView: 'dayGridMonth',
        locale: 'es',
        firstDay: 0,
        height: '100%',
        expandRows: true,
        fixedWeekCount: false, // Evita que dibuje una 6ta semana vacía
        headerToolbar: { left: 'prev', center: 'title', right: 'next' },
        dateClick: function(info) {
            updateWeekView(info.date);
        }
    });
    miniCalendar.render();
    

    // 2. Función para recalcular y dibujar la semana según la fecha seleccionada
    function updateWeekView(baseDate) {
        currentSunday = new Date(baseDate);
        currentSunday.setDate(baseDate.getDate() - baseDate.getDay()); 
        
        currentSaturday = new Date(currentSunday);
        currentSaturday.setDate(currentSunday.getDate() + 6);

        // Actualizar título superior
        const formatOpt = { day: 'numeric', month: 'short' };
        const formatOptYear = { day: 'numeric', month: 'short', year: 'numeric' };
        document.getElementById('current-date-label').innerText = 
            `Semana: ${currentSunday.toLocaleDateString('es-ES', formatOpt)} - ${currentSaturday.toLocaleDateString('es-ES', formatOptYear)}`;

        weekDates = {};
        const realToday = new Date().toDateString();

        daysIds.forEach((id, index) => {
            const currentDay = new Date(currentSunday);
            currentDay.setDate(currentSunday.getDate() + index);
            const dateString = currentDay.toISOString().split('T')[0];
            weekDates[dateString] = id; 

            // Actualizar número del día
            document.querySelector(`#${id} .date-label`).innerText = currentDay.getDate();
            
            // Limpiar resaltado previo y aplicar si es el día de hoy real
            const dayDiv = document.getElementById(id);
            dayDiv.classList.remove('ring-2', 'ring-blue-500');
            if (currentDay.toDateString() === realToday) {
                dayDiv.classList.add('ring-2', 'ring-blue-500');
            }
        });

        // Buscar eventos para la nueva semana seleccionada
        fetchRealEvents();
    }

    // Vista Anual Estática (12 Meses)
    function renderAnnualCalendar() {
        const container = document.getElementById('annual-calendar');
        container.innerHTML = '';
        
        const year = new Date().getFullYear();
        const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
        const daysShort = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];

        months.forEach((monthName, monthIndex) => {
            const monthDiv = document.createElement('div');
            monthDiv.className = 'flex flex-col';

            // Título del mes
            let html = `<div class="font-bold text-center text-gray-700 mb-1">${monthName}</div>`;
            html += `<div class="grid grid-cols-7 text-center text-gray-400 font-semibold mb-1">`;
            daysShort.forEach((d, index) => {
                let styleClass = '';
                if (index === 0) {
                    styleClass = 'text-red-500 font-bold'; // Domingo: Rojo y negrita
                } else if (index === 6) {
                    styleClass = 'font-bold text-gray-600'; // Sábado: Negrita
                }
                html += `<span class="${styleClass}">${d}</span>`;
            });
            html += `</div><div class="grid grid-cols-7 text-center gap-y-0.5">`;

            // Días del mes
            const firstDay = new Date(year, monthIndex, 1).getDay();
            const totalDays = new Date(year, monthIndex + 1, 0).getDate();

            // Espacios vacíos iniciales
            for (let i = 0; i < firstDay; i++) {
                html += `<span></span>`;
            }

            // Números de los días
            const today = new Date();
            for (let day = 1; day <= totalDays; day++) {
                const currentDayOfWeek = new Date(year, monthIndex, day).getDay();
                const isToday = day === today.getDate() && monthIndex === today.getMonth() && year === today.getFullYear();
                const isSunday = currentDayOfWeek === 0;
                let todayClass = isToday 
                    ? 'bg-blue-600 text-white rounded-full font-bold' 
                    : (isSunday ? 'font-bold hover:bg-gray-100 rounded-full' : 'hover:bg-gray-100 rounded-full');

                html += `<span class="h-5 flex items-center justify-center ${todayClass}">${day}</span>`;            
            }

            html += `</div>`;
            monthDiv.innerHTML = html;
            container.appendChild(monthDiv);
        });
    }

    renderAnnualCalendar();

    // 3. Funciones de renderizado y fetch de eventos
    function renderEvents(events) {
        document.querySelectorAll('.events-list').forEach(el => el.innerHTML = '');
        const now = new Date();
        const todayStr = now.toISOString().split('T')[0];
        const currentHours = now.getHours();
        const currentMinutes = now.getMinutes();
        const currentTimeMinutes = currentHours * 60 + currentMinutes;

        events.forEach(event => {
            if (weekDates[event.date]) {
                const dayContainer = document.querySelector(`#${weekDates[event.date]} .events-list`);
                
                let isFuture = false;
                if (event.date === todayStr) {
                    const [evHours, evMinutes] = event.time.split(':').map(Number);
                    const eventTimeMinutes = evHours * 60 + evMinutes;
                    if (eventTimeMinutes >= currentTimeMinutes) {
                        isFuture = true;
                    }
                }

                const titleStyle = isFuture ? 'font-bold text-gray-900' : 'text-gray-600';

                const eventHtml = `
                    <div class="flex items-start text-sm hover:bg-gray-100 p-0 rounded transition-colors">
                        <span class="font-bold mr-2 text-lg leading-none" style="color: ${event.color};">|</span>
                        <span class="font-mono text-gray-600 mr-2 mt-0.5">${event.time}</span>
                        <span class="truncate mt-0.5 ${titleStyle}" title="${event.title}">${event.title}</span>
                    </div>
                `;
                dayContainer.innerHTML += eventHtml;
            }
        });

        daysIds.forEach(id => {
            const dayContainer = document.querySelector(`#${id} .events-list`);
            const currentCount = dayContainer.children.length;
            
            for (let i = currentCount; i < 9; i++) {
                const emptyHtml = `
                    <div class="flex items-start text-sm p-0 select-none opacity-30">
                        <span class="font-bold mr-2 text-lg leading-none">|</span>
                        <span class="font-mono text-gray-600 mr-2 mt-0.5">__:__</span>
                        <span class="truncate mt-0.5 text-gray-400">___________________________________________________________</span>
                    </div>
                `;
                dayContainer.innerHTML += emptyHtml;
            }
        });
    }

    async function fetchRealEvents() {
        const startStr = currentSunday.toISOString().split('T')[0];
        const endStr = currentSaturday.toISOString().split('T')[0];

        document.querySelectorAll('.events-list').forEach(el => {
            el.innerHTML = `<div class="flex justify-center items-center h-full text-gray-400 text-sm animate-pulse">Cargando eventos...</div>`;
        });

        try {
            // El backend ahora busca los calendarios directamente en la base de datos SQLite
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
            console.error("Error de conexión:", error);
            document.querySelectorAll('.events-list').forEach(el => {
                el.innerHTML = '<div class="text-red-400 text-sm text-center mt-2">Error de conexión</div>';
            });
        }
    }

    // 4. Lógica de Gestión de Calendarios mediante la API (SQLite)
    const modal = document.getElementById('modal-calendars');
    const form = document.getElementById('form-calendar');
    const list = document.getElementById('list-calendars');

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
        list.innerHTML = '';
        calendars.forEach((cal) => {
            list.innerHTML += `
                <li class="flex justify-between items-center bg-gray-50 p-2 rounded mb-2 border text-sm">
                    <div class="flex items-center gap-2 truncate">
                        <span class="w-3 h-3 rounded-full" style="background-color: ${cal.color}"></span>
                        <strong>${cal.title}</strong>
                    </div>
                    <button onclick="deleteCalendar(${cal.id})" class="text-red-500 hover:text-red-700 ml-2">❌</button>
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

    document.getElementById('btn-settings').addEventListener('click', () => {
        modal.classList.remove('hidden');
        loadCalendarList(); // Carga la lista fresca al abrir el modal
    });
    
    document.getElementById('btn-close').addEventListener('click', () => modal.classList.add('hidden'));

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const newCal = {
            title: document.getElementById('cal-title').value,
            color: document.getElementById('cal-color').value,
            url: document.getElementById('cal-url').value
        };

        try {
            const response = await fetch('/api/calendars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCal)
            });

            if (response.ok) {
                form.reset();
                document.getElementById('cal-color').value = "#3b82f6";
                loadCalendarList();
                fetchRealEvents();
            }
        } catch (error) {
            console.error("Error al guardar el calendario:", error);
        }
    });

    // Carga inicial al abrir la página
    updateWeekView(new Date());
    loadCalendarList();

    // Auto-recarga en los minutos 29 y 59 de cada hora
    let lastReloadMinute = -1;
    setInterval(() => {
        const now = new Date();
        const minute = now.getMinutes();
        
        if ((minute === 29 || minute === 59) && lastReloadMinute !== minute) {
            lastReloadMinute = minute;
            location.reload();
        }
    }, 10000); // Revisa cada 10 segundos
});