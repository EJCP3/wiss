import { renderSileoToast } from '../src/styles/wiss';
import type { Toast } from '../src/core/types';

const viewport = document.getElementById('viewport');
if (!viewport) {
  throw new Error('#viewport not found');
}

let counter = 0;
function nextId(): string {
  counter += 1;
  return `demo-${counter}`;
}

function spawn(toast: Omit<Toast, 'id' | 'position'>): void {
  const node = renderSileoToast({ id: nextId(), position: 'top-center', ...toast });
  viewport.append(node);
}

document.getElementById('btn-success-plain')?.addEventListener('click', () => {
  spawn({
    type: 'success',
    message: 'Changes Saved',
    duration: 6000,
  });
});

document.getElementById('btn-success')?.addEventListener('click', () => {
  spawn({
    type: 'success',
    message: 'Changes Saved',
    description: 'Changes saved successfully to the database. Please refresh the page to see the changes.',
    duration: 6000,
  });
});

document.getElementById('btn-warning')?.addEventListener('click', () => {
  spawn({
    type: 'warning',
    message: 'Storage Almost Full',
    description: "You've used 95% of your available storage. Please upgrade your plan to continue.",
    duration: 8000,
  });
});

document.getElementById('btn-error')?.addEventListener('click', () => {
  spawn({
    type: 'error',
    message: 'Something Went Wrong',
    description: "We're having trouble saving your changes to the server. Please try again in a few minutes.",
    duration: 8000,
  });
});

document.getElementById('btn-clear')?.addEventListener('click', () => {
  viewport.replaceChildren();
});
