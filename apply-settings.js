(function() {
  function interceptDOMContentLoaded(event) {
    // Prevent the default DOMContentLoaded event from firing
    event.stopImmediatePropagation();
    console.log('DOMContentLoaded intercepted');
  }

  // Add an event listener to intercept the DOMContentLoaded event
  document.addEventListener('DOMContentLoaded', interceptDOMContentLoaded, true);

  function applyGridSettings(settings) {
    // Function to replace text placeholders
    function replaceTextPlaceholders(node, settings) {
      let textContent = node.textContent;

      // Find all text placeholders in the text content
      const textPlaceholders = textContent.match(/{{txt:(.*?):(.*?)}}/g);
      // console.log({textPlaceholders})

      if (textPlaceholders) {
        // Replace each text placeholder with the corresponding value from settings
        textPlaceholders.forEach((placeholder) => {
          const key = placeholder.match(/{{txt:(.*?):(.*?)}}/)[1];
          console.log({key});
          if (settings[key]) {
            textContent = textContent.replace(placeholder, settings[key]);
          }
        });

        // Update the node text content
        node.textContent = textContent;
      }
    }

    function replaceAttributePlaceholders(node, settings, attribute, type = 'txt') {
      console.log('Attribute:', attribute, node.getAttribute(attribute));
      let textContent = node.getAttribute(attribute);

      // Find all text placeholders in the text content
      const textPlaceholders = textContent.match(/{{(.*?):(.*?):(.*?)}}/g);
      console.log({textPlaceholders})

      if (textPlaceholders) {
        // Replace each text placeholder with the corresponding value from settings
        textPlaceholders.forEach((placeholder) => {
          const [index, type, key, description] = placeholder.match(/{{(.*?):(.*?):(.*?)}}/);
          console.log({index, type, key, description});
          if (settings[key]) {
            if (type === 'img') {
              textContent = textContent.replace(placeholder, settings[key].media.url);
            } else {
              textContent = textContent.replace(placeholder, settings[key]);
            }
          }
        });
        console.log('Updated attibute content:', attribute, textContent)

        // Update the node text content
        node.setAttribute(attribute, textContent);
      }
    }

    // Function to replace image placeholders
    function replaceImagePlaceholders(element, settings) {
      let srcValue = element.getAttribute('src');

      // Find all image placeholders in the src attribute
      const imgPlaceholders = srcValue.match(/{{img:(.*?):(.*?)}}/g);
      // console.log({imgPlaceholders})

      if (imgPlaceholders) {
        // Replace each image placeholder with the corresponding value from settings
        imgPlaceholders.forEach((placeholder) => {
          const key = placeholder.match(/{{img:(.*?):(.*?)}}/)[1];
          console.log({key});
          if (settings[key]) {
            srcValue = srcValue.replace(placeholder, settings[key]);
          }
        });

        // Update the element's src attribute
        element.setAttribute('src', srcValue);
      }
    }

    // Iterate through all elements in the document
    document.querySelectorAll('*').forEach((element) => {
      // Check all child nodes of the element for text placeholders
      element.childNodes.forEach((node) => {
        if (node.nodeType === Node.TEXT_NODE) {
          replaceTextPlaceholders(node, settings);
        }
      });

      if (element.getAttribute('source') ) {
        replaceAttributePlaceholders(element, settings, 'source');
      }
      if (element.getAttribute('style') ) {
        replaceAttributePlaceholders(element, settings, 'style');
      }
      // Check if the element is an image and has src attribute for image placeholders
      if (element.tagName === 'IMG' && element.hasAttribute('src')) {
        replaceAttributePlaceholders(element, settings, 'src', 'img');
      }
    });
  }

  window.addEventListener('GridappReady', function () {
    // Remove the intercepting listener
    document.removeEventListener('DOMContentLoaded', interceptDOMContentLoaded, true);

    console.log('GridappReady event received');
    const settings = window.gridapp.getSettings();
    console.log({settings});
    applyGridSettings(settings);

    // Dispatch the DOMContentLoaded event manually
    console.log('Dispatching DOMContentLoaded event');
    const event = document.createEvent('Event');
    event.initEvent('DOMContentLoaded', true, true);
    document.dispatchEvent(event);
  });
})();

