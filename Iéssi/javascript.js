// Configuração do Firebase
const firebaseConfig = {
    apiKey: "SUA_API_KEY_AQUI", // Pegue no Console do Firebase
    authDomain: "iessi-1aead.firebaseapp.com",
    databaseURL: "https://iessi-1aead-default-rtdb.firebaseio.com",
    projectId: "iessi-1aead",
    storageBucket: "iessi-1aead.appspot.com",
    messagingSenderId: "SEU_ID",
    appId: "SEU_APP_ID"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Dados dos Livros
const books = [
    { title: "Soul Land (Douluo Dalu)", author: "Tang Jia San Shao", tag: "Tang Jia San Shao", img: "https://m.media-amazon.com/images/I/81L8pS6X9HL.jpg" },
    { title: "Battle Through the Heavens", author: "Tian Can Tu Dou", tag: "Tian Can Tu Dou", img: "https://m.media-amazon.com/images/I/51r2XbF6pGL.jpg" },
    { title: "The Great Ruler", author: "Tian Can Tu Dou", tag: "Tian Can Tu Dou", img: "https://m.media-amazon.com/images/I/71Y87570GcL.jpg" },
    { title: "Throne of Seal", author: "Tang Jia San Shao", tag: "Tang Jia San Shao", img: "https://m.media-amazon.com/images/I/61NfTBy2BqL.jpg" },
    { title: "Reverend Insanity", author: "Gu Zhen Ren", tag: "Outros", img: "https://m.media-amazon.com/images/I/61Vf6Y6uDYL.jpg" },
    { title: "Lord of the Mysteries", author: "Cuttlefish That Loves Diving", tag: "Outros", img: "https://m.media-amazon.com/images/I/61f-B8lS8vL.jpg" }
];

// 1. Mostrar Livros
function filterBooks(category) {
    const grid = document.getElementById('book-grid');
    grid.innerHTML = '';
    const filtered = category === 'all' ? books : books.filter(b => b.tag === category);
    
    filtered.forEach(book => {
        grid.innerHTML += `
            <div class="book-card">
                <img src="${book.img}" alt="${book.title}">
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <span>${book.author}</span>
                </div>
            </div>`;
    });
}

// 2. Enviar Comentário
const form = document.getElementById('comment-form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('user-name').value;
    const rating = document.getElementById('user-rating').value;
    const text = document.getElementById('user-comment').value;

    db.ref('comments').push({
        name: name,
        rating: parseInt(rating),
        text: text,
        date: new Date().toLocaleString('pt-BR')
    }).then(() => {
        form.reset();
    }).catch(error => {
        alert("Erro ao enviar: " + error.message);
    });
});

// 3. Ouvir Comentários em Tempo Real
db.ref('comments').on('value', (snapshot) => {
    const display = document.getElementById('comments-display');
    display.innerHTML = '';
    const data = snapshot.val();

    if (data) {
        // Converte objeto em array e inverte para o mais novo aparecer primeiro
        const commentsArray = Object.values(data).reverse();
        
        commentsArray.forEach(c => {
            const stars = "⭐".repeat(c.rating);
            display.innerHTML += `
                <div class="comment-card">
                    <h4>${c.name} <span class="rating-stars">${stars}</span></h4>
                    <small style="color:#666">${c.date}</small>
                    <p>${c.text}</p>
                </div>`;
        });
    } else {
        display.innerHTML = '<p>O mural está silencioso. Deixe sua marca!</p>';
    }
});

// Iniciar página
filterBooks('all');