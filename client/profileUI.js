const applyBoxShadow = (e) => {
    const tagContainer = document.querySelector('.genre-tag-container');
    tagContainer.style.outline = 'none';
    tagContainer.style.border = '0.5px solid black';
    tagContainer.style.boxShadow = '-5px -5px 0px #07031A';
    tagContainer.style.backgroundColor = '#F4F6FF';
}

const revertBoxShadow = (e) => {
    const tagContainer = document.querySelector('.genre-tag-container');
    tagContainer.style = "";
}

const createTag = (tags, label) => {
    // Set class to tag
    const div = document.createElement('div');
    div.setAttribute('class', 'tag');

    // Set the tag label
    const span = document.createElement('span');
    span.innerHTML = label;

    // Set the X close button
    const closeBtn = document.createElement('i');
    closeBtn.setAttribute('class', 'material-symbols-outlined');
    closeBtn.setAttribute('data-item', label);
    closeBtn.innerHTML = 'close';

    // Set event for close button
    closeBtn.addEventListener('click', (e) => {
        // Get the stored tag and the index within the array
        const tag = e.target.getAttribute('data-item');
        const index = tags.indexOf(tag);

        // remove the tag from the array
        tags = [...tags.slice(0, index), ...tags.slice(index + 1)];

        // Reload the tags
        addTags(tags);
    });

    // Append the children to the div
    div.appendChild(span);
    div.appendChild(closeBtn);

    return div;
}

const createTagEvent = (e, tags) => {
    if(e.key === 'Enter') {
        // Sanitizer and store the tag
        const tagToAdd = e.target.value.trim();

        // If the tag is already included, return
        if(
            tags.includes(tagToAdd) ||
            tags.includes(tagToAdd.toUpperCase()) ||
            tags.includes(tagToAdd.toLowerCase())
        ) return;

        // Add the tag to the list
        tags.push(tagToAdd);
        addTags(tags);

        // Reset the input value
        e.target.value = '';
    }
}

const resetTags = () => {
    // Remove all .tag class elements
    document.querySelectorAll('.tag').forEach((tag) => {
        tag.parentElement.removeChild(tag);
    });
}

const addTags =(tags) => {
    // Reset tags
    resetTags();

    // Add a tag for each tag in the tags array
    // Using .slice().reverse() to put in the right order
    tags.slice().reverse().forEach((tag) => {
        const input = createTag(tags, tag);
        const tagContainer = document.querySelector('.genre-tag-container');
        tagContainer.prepend(input);
    });
}

module.exports = {
    applyBoxShadow,
    revertBoxShadow,
    addTags,
    createTagEvent,
}