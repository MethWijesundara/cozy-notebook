
async function fetchNotes(){
    const response = await fetch('/api/notes');
    const notes = await response.json();
    const notesList = document.getElementById('notesList');
    notesList.innerHTML = '';

    if (notes.length === 0) {
        notesList.innerHTML = 
            '<p style="text-align: center; opacity: 0.6;">No notes yet! Add one on the left</p>';
        return;
    }

    notes.forEach (note => {
        const card = document.createElement('div');
        card.className = 'note-card';
        card.innerHTML = 
            `<h3>${(note.title)}</h3>
            <h4>${note.date}</h4>
            <p>${(note.content)}</p>
            <button class="delete-btn" onclick="deleteNote(${note.id})">X</button>
        `;
        notesList.appendChild(card);
    });
}

// take form values
// send them to backend
// clear form
// refresh notes. 

async function createNote(){

    // 1. take form values
    const title = document.getElementById('noteTitle').value;
    const content = document.getElementById('noteContent').value;
    const date = document.getElementById('noteDate').value;
    
    
    if(!title || !content){
        window.alert("Don't forget to enter a title and content!🪴");
        return;
    }
        
    
    // 2. sending them to backend
    await fetch('/api/notes', {
        method: 'POST',
        headers: {'Content-Type' : 'application/json'},
        body: JSON.stringify({
            title: title,
            content: content,
            date: date
        })
    });

    // 3. clear form
    document.getElementById('noteTitle').value = '';
    document.getElementById('noteContent').value = '';
    document.getElementById('noteDate').value = '';

    // 4. refresh notes
    fetchNotes();
}

async function deleteNote(id){
    await fetch(`/api/notes/${id}`, {method: 'DELETE'});
    fetchNotes();
}

// idk what this function is doing. 
// function escapeHtml(text){}

// initial load
fetchNotes();
