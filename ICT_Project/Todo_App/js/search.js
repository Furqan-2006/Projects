document.addEventListener("DOMContentLoaded", () => {
    const searchButton = document.getElementById('search-btn');
    const searchInput = document.getElementById('search-input');
    const todoList = document.getElementById('myList');

    const highlightText = (itemText, searchTerm) => {
        const lowerText = itemText.value.toLowerCase();
        const searchTermLower = searchTerm.toLowerCase();

        const startIndex = lowerText.indexOf(searchTermLower);
        if (startIndex !== -1) {
            const endIndex = startIndex + searchTerm.length;

            const beforeMatch = itemText.value.slice(0, startIndex);
            const matchText = itemText.value.slice(startIndex, endIndex);
            const afterMatch = itemText.value.slice(endIndex);

            // Set innerHTML safely while keeping buttons intact
            itemText.value = beforeMatch + matchText + afterMatch;
            itemText.style.background = 'linear-gradient(35deg, #1919a7, #1919a7)';
        }
    };

    const removeHighlight = (itemText) => {
        itemText.value = itemText.value; // Reset the original text
    };

    searchInput.addEventListener('input', () => {
        const filter = searchInput.value.toLowerCase();
        const items = todoList.getElementsByTagName('li');

        for (let i = 0; i < items.length; i++) {
            const textarea = items[i].querySelector('textarea');
            const itemText = textarea.value.toLowerCase();
            if (itemText.includes(filter)) {
                items[i].style.display = '';
                removeHighlight(textarea); // Reset highlight before applying new one
                highlightText(textarea, filter);
            } else {
                items[i].style.display = 'none';
                removeHighlight(textarea);
            }
        }
    });
    searchButton.addEventListener('click', ()=>{
        const filter = searchInput.value.toLowerCase();
        const items = todoList.getElementsByTagName('li');

        for (let i = 0; i < items.length; i++) {
            const textarea = items[i].querySelector('textarea');
            const itemText = textarea.value.toLowerCase();
            if (itemText.includes(filter)) {
                items[i].style.display = '';
                removeHighlight(textarea); // Reset highlight before applying new one
                highlightText(textarea, filter);
            } else {
                items[i].style.display = 'none';
                removeHighlight(textarea);
            }
        }
    })
});
