// Function to handle modal opening and closing
function setupModal(buttonId, modalId) {
    const modal = document.getElementById(modalId);
    const btn = document.getElementById(buttonId);
    const span = modal.getElementsByClassName("close")[0];

   // Modal opening
btn.onclick = function() {
    modal.style.display = "block";
    modal.setAttribute('aria-hidden', 'false');
    modal.focus();
}

// Modal closing
span.onclick = function() {
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
        modal.setAttribute('aria-hidden', 'true');
    }
}

}

// Set up modals
setupModal('myBtn', 'myModal');
setupModal('myBtn2', 'myModalx');
setupModal('myBtn3', 'myModalz');
