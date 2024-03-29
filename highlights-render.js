function renderHighlights(viewJson) {

    var htmlRender = {
            "toc__items": [],
            "sections": []
        },
        isJsonBookcision = viewJson.asin ? true : false;
        
    // Kindle Highlights json via Bookcision: has asin indentifier from Amazon cloud reader
    if (isJsonBookcision) {
        var notesHTML = [];

        viewJson.highlights.forEach((note) => {
            var note = 
            `<p class="sp_note sp_note--highlight">
                <span class="sp_note-level">&bull;</span> ${note.text}
                <a href="${note.location.url}" class="sp_note-location">&mdash;Location: <span class="sp_note-location__value">${note.location.value}</span></a>
            </p>`;
            notesHTML.push(note);
        });

        htmlRender.sections = notesHTML;
        viewJson.source = "Kindle Store / Amazon"; // Bookcision Json doesn't have this custom property
    } // Highlights export from html file scraped and parsed to viewJson
    else {
        // Render sections > notes and ToC
        viewJson.sections.forEach((section, curr) => {
            var toc__item,
                sectionHTML = '',
                notesHTML = [];

            section.notes.forEach((note) => {
                var note = 
                `<p class="sp_note sp_note--${note.level} sp_note--${note.type}">
                <span class="sp_note-level">&bull;</span> ${note.text}
                <span class="sp_note-location">&mdash;Location: <span class="sp_note-location__value">${note.location}</span></span>
                </p>`;
                notesHTML.push(note);
            });

            sectionHTML += `<section class="sp_section" id="sp_section${curr+1}">`;
            sectionHTML += `<h2 class="sp_section-title">${section.sectionTitle} (${section.noteCount})</h2>`;
            sectionHTML += notesHTML.join('');
            sectionHTML += '</section>';

            htmlRender.sections.push(sectionHTML);
            
            toc__item = `<li id="#sp_section${curr+1}-toc">${section.sectionTitle}&nbsp;(${section.noteCount})</li>`;
            htmlRender.toc__items.push(toc__item);
        });
    }


    // Put the rendered elements together and add it to the document
    var renderedEl,
        headerEl,
        sectionsEl;

    headerEl = document.createElement('header');
    headerEl.innerHTML = '<h1 class="sp_title"></h1><p class="sp_author"></p><ol class="sp_toc"></ol>';

    if(isJsonBookcision) {
        headerEl.querySelector('.sp_toc').remove(); // Bookcision / Amazon cloud doesn't include section titles
    } 
    else {
        headerEl.querySelector('.sp_toc').innerHTML = htmlRender.toc__items.join('');
    }
    headerEl.querySelector('.sp_title').innerText = viewJson.title; 
    headerEl.querySelector('.sp_author').innerText = 'By: ' + viewJson.authors + ' - Excerpts from: ' + viewJson.source;
    

    sectionsEl = document.createElement('div');
    sectionsEl.classList.add('sp_highlights__notes');
    sectionsEl.innerHTML = htmlRender.sections.join('');
    
    renderedEl = document.createElement('article');
    renderedEl.classList.add('sp_highlights');
    renderedEl.append(headerEl);
    renderedEl.append(sectionsEl);

    return renderedEl;
}