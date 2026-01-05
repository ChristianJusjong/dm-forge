/**
 * Modal Accessibility Utilities
 * Handles focus trapping and keyboard navigation for modals.
 */

export function initModalFocusTrap() {
    document.querySelectorAll('dialog, .modal, [role="dialog"]').forEach(modal => {
        modal.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal(modal);
            }
            if (e.key === 'Tab') {
                trapFocus(e, modal);
            }
        });

        // Close on backdrop click (optional, common pattern)
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
}

function trapFocus(e, modal) {
    const focusableElements = modal.querySelectorAll(
        'a[href], button, textarea, input[type="text"], input[type="radio"], input[type="checkbox"], select'
    );
    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) { /* Shift + Tab */
        if (document.activeElement === firstElement) {
            lastElement.focus();
            e.preventDefault();
        }
    } else { /* Tab */
        if (document.activeElement === lastElement) {
            firstElement.focus();
            e.preventDefault();
        }
    }
}

function closeModal(modal) {
    // If it's a <dialog> element
    if (typeof modal.close === 'function') {
        modal.close();
    } else {
        // Fallback for custom div modals
        modal.style.display = 'none';
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
    }
}

// Auto-init specific modals if needed, or export for manual use
// window.initModalFocusTrap = initModalFocusTrap;
