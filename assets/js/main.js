const STORAGE_KEY = "BOOKSHELF_APPS";

let books = [];
let book = [];

// kondisi 
function isStorageExist(){
   if(typeof(Storage) === undefined){
        return false;
   } 
   return true;
}

// untuk menyimpan data
function saveBook(){
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event('ondatasaved'));
}

// proses saat load data di penyimpan
function loadDataFromStorage(){
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);
    if(data !== null){
        books = data;
    }

    document.dispatchEvent(new Event('ondataloaded'));
}

// update data dan menyimpan data
function updateBook(){
    if(isStorageExist()){
        saveBook();
    }
}

// membuat Objek Buku
function composeBookObject(title, author, year, isCompleted){
    return{
        id: +new Date(),
        title,
        author,
        year,
        isCompleted
    }
}

// untuk mencari buku
function findBook(bookId){
    for(book of books){
        if(book.id === bookId)
        return book;
    }
    return null;
}

// untuk mencari buku berdasarkan index
function findbookIndex(bookId){
    let index = 0;
    for(book of books){
        if(book.id === bookId)
        return index;
        index++;
    }
    return -1;
}

const ID_BOOK_COMPLETED = "completeBookshelfList";
const ID_BOOK_UNCOMPLETED = "incompleteBookshelfList";
const BOOK_ID = "bookId";

// membuat data buku
function makeBook(title, author, year, isCompleted){
    const bookTitle = document.createElement("h2");
    bookTitle.innerText = title;

    const bookAuthor = document.createElement("p");
    bookAuthor.classList.add("author");
    bookAuthor.innerText = "Penulis : " + author;

    const bookYear = document.createElement("p");
    bookYear.classList.add("year");
    bookYear.innerText = "Tahun : " + year;

    const btnSection = document.createElement("div");
    btnSection.classList.add("action");

    const section = document.createElement("article");
    section.classList.add("book_item");
    section.append(bookTitle, bookAuthor, bookYear);

    if(isCompleted){
        btnSection.append(unfinishedBtn(), deleteBtn());
    }else{
        btnSection.append(finishedBtn(), deleteBtn());
    }
    section.append(btnSection);
    return section;
}


// fungsi button sebelum selesai di baca
function unfinishedBtn(){
    return createBtn("btn_unfinished", "Belum Selesai Di Baca", "green", function(e){
        unfinishedBook(e.target.parentElement.parentElement)
    })
}

// fungsi button selesai di baca
function finishedBtn(){
    return createBtn("btn_finished", "Selesai Di Baca", "green", function(e){
        finishedBook(e.target.parentElement.parentElement)
    })
}

// fungsi button hapus 
function deleteBtn(){
    return createBtn("btn_delete", "Hapus Buku", "red", function(e){
        deleteBook(e.target.parentElement.parentElement)
    })
}

// pembuatan button ketika muncul
function createBtn(btnclass, text, color, eventListener){
    const button = document.createElement("button");
    button.innerText = text;
    button.classList = btnclass;
    button.classList = color;
    button.addEventListener("click", function(e){
        eventListener(e);
    });
    return button;
}

// fungsi data buku
function storeBook(){
    const uncompletedBook = document.getElementById(ID_BOOK_UNCOMPLETED);
    const completedBook = document.getElementById(ID_BOOK_COMPLETED);
    const bookTitle = document.getElementById("inputBookTitle").value;
    const bookAuthor = document.getElementById("inputBookAuthor").value;
    const bookYear = document.getElementById("inputBookYear").value;
    let isCompleted = document.getElementById("inputBookIsComplete");
    if (isCompleted.checked) {
        isCompleted = true;
    } else {
        isCompleted = false;
    }
    const newBook = makeBook(bookTitle, bookAuthor, bookYear, isCompleted);
    const bookObject = composeBookObject(bookTitle, bookAuthor, bookYear, isCompleted);
    newBook[BOOK_ID] = bookObject.id;
    books.push(bookObject);
    if(isCompleted){
        completedBook.append(newBook);
    } else {
        uncompletedBook.append(newBook);
    }
    updateBook();
}

// ketika selesai di baca
function finishedBook(bookElement){
    const bookCompleted = document.getElementById(ID_BOOK_COMPLETED);
    const bookTitle = bookElement.querySelector(".book_item > h2").innerText;
    const bookAuthor = bookElement.querySelector(".author").innerText.replace("Penulis : ","");
    const bookYear = bookElement.querySelector(".year").innerText.replace("Tahun : ", "");
    const newBook = makeBook(bookTitle, bookAuthor, bookYear, true)
    const book = findBook(bookElement[BOOK_ID])
    book.isCompleted = true;
    newBook[BOOK_ID] = book.id;
    bookCompleted.append(newBook);
    bookElement.remove();
    updateBook();
}

// ketika sebelum di baca
function unfinishedBook(bookElement){
    const bookUncompleted = document.getElementById(ID_BOOK_UNCOMPLETED);
    const bookTitle = bookElement.querySelector(".book_item > h2").innerText;
    const bookAuthor = bookElement.querySelector(".author").innerText.replace("Penulis : ","");
    const bookYear = bookElement.querySelector(".year").innerText.replace("Tahun : ", "");
    const newBook = makeBook(bookTitle, bookAuthor, bookYear, false);
    const book = findBook(bookElement[BOOK_ID]);
    book.isCompleted = false;
    newBook[BOOK_ID] = book.id;
    bookUncompleted.append(newBook);
    bookElement.remove();
    updateBook();
}

// ketika data buku di hapus
function deleteBook(bookElement){
    if (confirm("Apakah kamu yakin akan menghapus buku ?")) {
        const bookPosition = findbookIndex(bookElement[BOOK_ID]);
        books.splice(bookPosition, 1);
        bookElement.remove();
        updateBook();
    }
}

// kondisi ketika halaman di refresh maka menmapilkan semua data
function refreshDataFromBooks(){
    const bookUncompleted = document.getElementById(ID_BOOK_UNCOMPLETED);
    const bookCompleted = document.getElementById(ID_BOOK_COMPLETED);
    for(book of books){
        const newBook = makeBook(book.title, book.author, book.year, book.isCompleted);
        newBook[BOOK_ID] = book.id;
        if(book.isCompleted){
            bookCompleted.append(newBook);
        }else{
            bookUncompleted.append(newBook);
        }
    }
}

// perkondisian  
document.addEventListener('DOMContentLoaded', function(){
    const formBook = document.getElementById('inputBook');
    formBook.addEventListener('submit', function(e){
        e.preventDefault();
        storeBook();
    })
    if(isStorageExist){
        loadDataFromStorage();
    }
});

document.addEventListener('ondatasaved', function(){
    alert('Buku Berhasil Disimpan!');
});

document.addEventListener('ondataloaded', function(){
    refreshDataFromBooks();
})

// untuk pencarian data buku
const searchBook = document.getElementById('searchBook');

searchBook.addEventListener('submit', function(e){
    e.preventDefault();
    const searchBookTitle = document.getElementById('searchBookTitle').value.toLowerCase();
    const bookItem = document.querySelectorAll(".book_item");
    for (book of bookItem){
        let text = book.querySelector(".book_item > h2").innerText;
        if(text.toLowerCase().indexOf(searchBookTitle) > -1){
            book.style.display = '';
        }else{
            book.style.display = 'none';
        }
    }
    
})
