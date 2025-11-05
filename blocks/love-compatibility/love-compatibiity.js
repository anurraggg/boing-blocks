import { decorateIcons } from '../../scripts/aem.js';

/**
 * Creates a form field element.
 * @param {string} labelText - The text for the <label>
 * @param {string} type - The input type (e.g., 'text', 'date', 'submit')
 * @param {string} placeholder - The placeholder text
 * @param {string} name - The 'name' attribute for the input
 * @returns {Element} - The fully built field wrapper
 */
function createField(labelText, type, placeholder, name) {
  const fieldWrapper = document.createElement('div');
  fieldWrapper.classList.add('form-field-wrapper');

  const label = document.createElement('label');
  label.setAttribute('for', name);
  label.textContent = labelText;
  fieldWrapper.append(label);

  if (type === 'submit') {
    const button = document.createElement('button');
    button.setAttribute('type', 'submit');
    button.classList.add('form-submit-button');
    button.textContent = labelText;
    fieldWrapper.append(button);
  } else {
    const inputWrapper = document.createElement('div');
    inputWrapper.classList.add('form-input-wrapper');

    const input = document.createElement('input');
    // Use 'text' for date to show placeholder, switch to 'date' on focus
    input.setAttribute('type', type === 'date' ? 'text' : type);
    input.setAttribute('id', name);
    input.setAttribute('name', name);
    input.setAttribute('placeholder', placeholder);

    if (type === 'date') {
      // This JS magic shows the placeholder, but gives a date picker on click
      input.setAttribute('onfocus', "(this.type='date')");
      input.setAttribute('onblur', "(if(!this.value) this.type='text')");
      // Add calendar icon
      const icon = document.createElement('span');
      icon.classList.add('icon', 'icon-calendar');
      inputWrapper.append(input, icon);
    } else {
      inputWrapper.append(input);
    }
    fieldWrapper.append(inputWrapper);
  }
  return fieldWrapper;
}

/**
 * Creates the decorative separator.
 * @returns {Element}
 */
function createSeparator() {
  const separator = document.createElement('div');
  separator.classList.add('form-separator');
  separator.innerHTML = '<span class="icon icon-heart"></span>';
  return separator;
}

export default async function decorate(block) {
  const form = document.createElement('form');
  const rows = [...block.children];

  rows.forEach((row) => {
    const label = row.children[0]?.textContent.trim();

    if (label === 'Header') {
      // This is the block title, not a field
      const header = document.createElement('div');
      // Use the new block name for the class
      header.classList.add('love-compatibility-header'); 
      header.innerHTML = row.children[1].innerHTML;
      // Put the header *before* the form
      block.before(header);
    } else if (label !== 'Field') {
      // This is a form field
      const [labelText, type, placeholder, name] = [...row.children].map((cell) => cell.textContent.trim());
      const field = createField(labelText, type, placeholder, name);
      form.append(field);

      // Add separator after "Your Date Of Birth"
      if (name === 'yourDob') {
        form.append(createSeparator());
      }
    }
  });

  // Add submit handler
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    // A developer can now wire this up.
    // E.g., const formData = new FormData(form);
    alert('Form submitted! (Developer: Connect this to your endpoint.)');
  });

  // Clean up the original table and add the new form
  block.textContent = '';
  block.append(form);
  
  // Find and decorate all icons
  await decorateIcons(block.parentElement);
}