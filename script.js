/* --- SECURITY & SETUP --- */
// Prevent Right Click
document.addEventListener('contextmenu', e => e.preventDefault());

// Prevent F12 and DevTools
document.onkeydown = function(e) {
    if(e.keyCode == 123) return false;
    if(e.ctrlKey && e.shiftKey && e.keyCode == 73) return false;
    if(e.ctrlKey && e.keyCode == 85) return false;
};

/* --- CURSOR LOGIC --- */
const cursor = document.getElementById('cursor');
document.addEventListener('mousemove', e => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});
document.addEventListener('mousedown', () => cursor.classList.add('clicking'));
document.addEventListener('mouseup', () => cursor.classList.remove('clicking'));

// Hover Effect
document.body.addEventListener('mouseover', e => {
    const target = e.target;
    if(target.tagName === 'BUTTON' || target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.classList.contains('task')) {
        cursor.classList.add('hovered');
    } else {
        cursor.classList.remove('hovered');
    }
});

/* --- DATA & STATE --- */
const KEY = 'kanban_pro_final';
const genId = () => '_' + Math.random().toString(36).substr(2, 9);

let state = JSON.parse(localStorage.getItem(KEY)) || {
    columns: [
        { id: 'c1', title: 'To Do' },
        { id: 'c2', title: 'In Progress' },
        { id: 'c3', title: 'Done' }
    ],
    tasks: [
        { id: 't1', colId: 'c1', title: 'Welcome Developer', priority: 'high', desc: 'System is ready.' }
    ]
};

const save = () => localStorage.setItem(KEY, JSON.stringify(state));
const board = document.getElementById('board');

/* --- RENDER FUNCTIONS --- */
function render() {
    board.innerHTML = '';
    state.columns.forEach(col => {
        const tasks = state.tasks.filter(t => t.colId === col.id);
        
        // Create Column
        const colDiv = document.createElement('div');
        colDiv.className = 'column';
        colDiv.dataset.id = col.id;
        
        // Inner HTML for Column
        colDiv.innerHTML = `
            <div class="column-header">
                ${col.title}
                <button class="btn btn-sec" style="padding: 5px 10px;" onclick="window.deleteCol('${col.id}')">✕</button>
            </div>
            <div class="task-list" id="${col.id}"></div>
            <button class="btn btn-sec" style="margin: 10px; width: 90%;" onclick="window.openModal('${col.id}')">+ Add Task</button>
        `;

        const list = colDiv.querySelector('.task-list');

        // Add Tasks
        tasks.forEach(t => {
            const taskEl = document.createElement('div');
            taskEl.className = 'task';
            taskEl.draggable = true;
            taskEl.dataset.id = t.id;
            taskEl.innerHTML = `
                <span class="tag tag-${t.priority}">${t.priority}</span>
                <strong>${t.title}</strong>
                <div style="font-size:0.8rem; color:gray; margin-top:5px;">${t.desc || ''}</div>
            `;
            
            // Events
            taskEl.onclick = (e) => { if(!e.target.closest('.tag')) window.openModal(col.id, t.id); };
            taskEl.addEventListener('dragstart', handleDragStart);
            taskEl.addEventListener('dragend', handleDragEnd);
            
            list.appendChild(taskEl);
        });

        // Drop Logic
        list.addEventListener('dragover', handleDragOver);
        board.appendChild(colDiv);
    });
}

/* --- DRAG & DROP HANDLERS --- */
let dragItem = null;

function handleDragStart() {
    dragItem = this;
    setTimeout(() => this.classList.add('dragging'), 0);
}

function handleDragEnd() {
    this.classList.remove('dragging');
    dragItem = null;
    updateStateFromDOM();
}

function handleDragOver(e) {
    e.preventDefault();
    const list = this;
    const afterElement = getDragAfterElement(list, e.clientY);
    if (afterElement == null) {
        list.appendChild(dragItem);
    } else {
        list.insertBefore(dragItem, afterElement);
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task:not(.dragging)')];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function updateStateFromDOM() {
    const newTasks = [];
    document.querySelectorAll('.column').forEach(col => {
        col.querySelectorAll('.task').forEach(t => {
            const original = state.tasks.find(x => x.id === t.dataset.id);
            if(original) newTasks.push({ ...original, colId: col.dataset.id });
        });
    });
    state.tasks = newTasks;
    save();
}

/* --- ACTIONS (Attached to Window for global access) --- */
const modal = document.getElementById('taskModal');
const inputs = {
    t: document.getElementById('inpTitle'),
    p: document.getElementById('inpPriority'),
    d: document.getElementById('inpDesc'),
    cid: document.getElementById('inpColId'),
    tid: document.getElementById('inpTaskId')
};

// Open Modal
window.openModal = (colId, taskId = null) => {
    inputs.cid.value = colId;
    inputs.tid.value = taskId || '';
    if(taskId) {
        const t = state.tasks.find(x => x.id === taskId);
        inputs.t.value = t.title; inputs.p.value = t.priority; inputs.d.value = t.desc;
    } else {
        inputs.t.value = ''; inputs.p.value = 'low'; inputs.d.value = '';
    }
    modal.classList.add('active');
};

// Delete Column
window.deleteCol = (id) => {
    if(confirm("Delete this column?")) {
        state.columns = state.columns.filter(c => c.id !== id);
        state.tasks = state.tasks.filter(t => t.colId !== id);
        save(); render();
    }
};

/* --- EVENT LISTENERS --- */
document.getElementById('closeModalBtn').addEventListener('click', () => modal.classList.remove('active'));

document.getElementById('saveTaskBtn').addEventListener('click', () => {
    if(!inputs.t.value) return;
    if(inputs.tid.value) {
        // Edit
        const idx = state.tasks.findIndex(x => x.id === inputs.tid.value);
        state.tasks[idx] = { ...state.tasks[idx], title: inputs.t.value, priority: inputs.p.value, desc: inputs.d.value };
    } else {
        // Add
        state.tasks.push({
            id: genId(), colId: inputs.cid.value, title: inputs.t.value, priority: inputs.p.value, desc: inputs.d.value
        });
    }
    save(); render(); modal.classList.remove('active');
});

document.getElementById('addColBtn').addEventListener('click', () => {
    const name = prompt("Enter Column Name:");
    if(name) { state.columns.push({ id: genId(), title: name }); save(); render(); }
});

document.getElementById('themeBtn').addEventListener('click', () => {
    const curr = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', curr === 'dark' ? 'light' : 'dark');
});

document.getElementById('searchInput').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    document.querySelectorAll('.task').forEach(t => {
        t.style.display = t.innerText.toLowerCase().includes(q) ? 'block' : 'none';
    });
});

/* --- EXPORT / IMPORT --- */
document.getElementById('exportBtn').addEventListener('click', () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state));
    const dlAnchorElem = document.createElement('a');
    dlAnchorElem.setAttribute("href", dataStr);
    dlAnchorElem.setAttribute("download", "kanban_data.json");
    dlAnchorElem.click();
});

document.getElementById('importBtn').addEventListener('click', () => document.getElementById('importFile').click());

document.getElementById('importFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if(!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
        try {
            state = JSON.parse(ev.target.result);
            save(); render(); alert("Imported!");
        } catch(err) { alert("Invalid JSON"); }
    };
    reader.readAsText(file);
});

// START APP
render();